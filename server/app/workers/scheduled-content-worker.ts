import { SupabaseClient } from "@supabase/supabase-js";
import { postRedditComment } from "../services/reddit-comment-poster";

interface ScheduledContentItem {
  id: string;
  scheduled_at: string;
  reddit_account_id: string;
  source_user_interaction: string;
  user_id: string;
  is_posted: boolean | null;
  error_message: string | null;
  failed_times: number | null;
}

interface WorkerState {
  isRunning: boolean;
  pollingInterval: NodeJS.Timeout | null;
  realtimeSubscription: any;
  supabase: SupabaseClient;
}

let workerState: WorkerState = {
  isRunning: false,
  pollingInterval: null,
  realtimeSubscription: null,
  supabase: null as any,
};

// UTILITY FUNCTION FOR DELAYS
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PARSE REDDIT RATE LIMITING ERROR MESSAGE TO EXTRACT MINUTES
function parseRedditRateLimitError(errorMessage: string): number | null {
  if (!errorMessage) return null;

  // LOOK FOR PATTERNS LIKE "Take a break for 4 minutes" OR "Take a break for 1 minute"
  const rateLimitPattern = /take a break for (\d+) minutes?/i;
  const match = errorMessage.match(rateLimitPattern);

  if (match && match[1]) {
    const minutes = parseInt(match[1], 10);
    return isNaN(minutes) ? null : minutes;
  }

  return null;
}

// RESCHEDULE CONTENT FOR RATE LIMITING (MULTIPLY BY 1.5 FOR SAFETY)
async function rescheduleContentForRateLimit(
  id: string,
  rateLimitMinutes: number
): Promise<void> {
  try {
    // CALCULATE NEW SCHEDULE TIME (CURRENT TIME + MINUTES * 1.5)
    const delayMs = rateLimitMinutes * 1.5 * 60 * 1000;
    const newScheduledAt = new Date(Date.now() + delayMs).toISOString();

    await workerState.supabase
      .from("scheduled_content")
      .update({
        scheduled_at: newScheduledAt,
        error_message: null,
      })
      .eq("id", id);

    console.log(
      `⏰ Rescheduled content ${id} for ${
        rateLimitMinutes * 1.5
      } minutes later due to rate limit`
    );
  } catch (error) {
    console.error(
      `❌ Failed to reschedule content ${id} for rate limit:`,
      error
    );
  }
}

// UPDATE SCHEDULED CONTENT WITH ERROR MESSAGE AND INCREMENT FAILED_TIMES
async function updateScheduledContentError(
  id: string,
  errorMessage: string,
  newFailedTimes: number
): Promise<void> {
  try {
    await workerState.supabase
      .from("scheduled_content")
      .update({
        error_message: errorMessage,
        failed_times: newFailedTimes,
      })
      .eq("id", id);
  } catch (error) {
    console.error(
      `❌ Failed to update error message for scheduled content ${id}:`,
      error
    );
  }
}

// MARK SCHEDULED CONTENT AS PERMANENTLY FAILED (ONLY FOR GENUINE PERMANENT FAILURES)
async function markScheduledContentFailed(
  id: string,
  errorMessage: string,
  isPermanentFailure: boolean = false
): Promise<void> {
  try {
    const updateData: any = {
      error_message: errorMessage,
    };

    // ONLY SET is_posted: true FOR GENUINE PERMANENT FAILURES (AUTH ERRORS, ETC.)
    if (isPermanentFailure) {
      updateData.is_posted = true;
    }

    await workerState.supabase
      .from("scheduled_content")
      .update(updateData)
      .eq("id", id);
  } catch (error) {
    console.error(
      `❌ Failed to mark scheduled content ${id} as failed:`,
      error
    );
  }
}

// PROCESS A SINGLE SCHEDULED CONTENT ITEM
async function processScheduledItem(item: ScheduledContentItem): Promise<void> {
  try {
    console.log(`🔄 Processing scheduled content ${item.id}...`);

    // GET THE SOURCE USER INTERACTION DETAILS
    const { data: interaction, error: interactionError } =
      await workerState.supabase
        .from("reddit_user_interactions")
        .select(
          "id, our_interaction_content, original_reddit_post_id, interaction_type"
        )
        .eq("id", item.source_user_interaction)
        .single();

    if (interactionError || !interaction) {
      const errorMsg = `Source interaction ${item.source_user_interaction} not found`;
      console.error(`❌ ${errorMsg}`);
      await markScheduledContentFailed(item.id, errorMsg);
      return;
    }

    // DETERMINE REDDIT THING ID BASED ON INTERACTION TYPE
    let thingId = interaction.original_reddit_post_id;
    if (interaction.interaction_type === "comment_reply") {
      thingId = `t3_${thingId}`;
    }

    // POST COMMENT TO REDDIT
    const postResult = await postRedditComment(
      workerState.supabase,
      item.reddit_account_id,
      thingId,
      interaction.our_interaction_content
    );

    if (postResult.success) {
      // UPDATE REDDIT USER INTERACTION WITH REDDIT RESPONSE
      const { error: updateInteractionError } = await workerState.supabase
        .from("reddit_user_interactions")
        .update({
          status: "submitted",
          our_interaction_reddit_id: postResult.comment_id,
        })
        .eq("id", interaction.id);

      if (updateInteractionError) {
        console.error(
          `❌ Failed to update interaction ${interaction.id}:`,
          updateInteractionError
        );
      }

      // MARK SCHEDULED CONTENT AS POSTED
      const { error: updateScheduledError } = await workerState.supabase
        .from("scheduled_content")
        .update({
          is_posted: true,
          error_message: null,
        })
        .eq("id", item.id);

      if (updateScheduledError) {
        console.error(
          `❌ Failed to update scheduled content ${item.id}:`,
          updateScheduledError
        );
      } else {
        console.log(
          `✅ Successfully processed scheduled content ${item.id} - Comment ${postResult.comment_id}`
        );
      }
    } else {
      // HANDLE POSTING FAILURE
      console.error(
        `❌ Failed to post scheduled content ${item.id}:`,
        postResult.error
      );

      const errorMessage = postResult.error || "Unknown posting error";

      // CHECK IF THIS IS A RATE LIMITING ERROR
      let rateLimitMinutes = null;

      // FIRST CHECK IF RATE LIMIT INFO IS PROVIDED DIRECTLY
      if (postResult.is_rate_limited && postResult.rate_limit_minutes) {
        rateLimitMinutes = postResult.rate_limit_minutes;
      } else {
        // FALLBACK: PARSE ERROR MESSAGE FOR RATE LIMIT INFO
        rateLimitMinutes = parseRedditRateLimitError(errorMessage);
      }

      if (rateLimitMinutes) {
        // RESCHEDULE CONTENT BASED ON RATE LIMIT (MULTIPLY BY 1.5 FOR SAFETY)
        await rescheduleContentForRateLimit(item.id, rateLimitMinutes);
        console.log(
          `⏰ Rate limited: Rescheduled content ${item.id} for ${
            rateLimitMinutes * 1.5
          } minutes`
        );
      } else {
        // INCREMENT FAILED_TIMES FOR NON-RATE-LIMIT ERRORS
        const currentFailedTimes = item.failed_times || 0;
        const newFailedTimes = currentFailedTimes + 1;

        if (newFailedTimes >= 3) {
          // PERMANENTLY FAILED AFTER 3 ATTEMPTS
          await markScheduledContentFailed(item.id, errorMessage, true);
          console.log(
            `❌ Scheduled content ${item.id} permanently failed after 3 attempts`
          );

          // UPDATE INTERACTION STATUS TO REFLECT FAILURE
          await workerState.supabase
            .from("reddit_user_interactions")
            .update({ status: "new" })
            .eq("id", interaction.id);
        } else if (postResult.should_retry) {
          // INCREMENT FAILED_TIMES AND RETRY LATER
          await updateScheduledContentError(
            item.id,
            errorMessage,
            newFailedTimes
          );
          console.log(
            `🔄 Scheduled content ${item.id} will be retried later (attempt ${newFailedTimes}/3)`
          );
        } else {
          // MARK AS FAILED PERMANENTLY FOR NON-RETRYABLE ERRORS
          await markScheduledContentFailed(item.id, errorMessage, true);
          console.log(
            `❌ Scheduled content ${item.id} permanently failed (non-retryable error)`
          );

          // UPDATE INTERACTION STATUS TO REFLECT FAILURE
          await workerState.supabase
            .from("reddit_user_interactions")
            .update({ status: "new" })
            .eq("id", interaction.id);
        }
      }
    }
  } catch (error) {
    const errorMsg = `Unexpected error processing scheduled content: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    console.error(`❌ ${errorMsg}`);
    await markScheduledContentFailed(item.id, errorMsg);
  }
}

// PROCESS ALL DUE SCHEDULED CONTENT
async function processScheduledContent(): Promise<void> {
  if (!workerState.isRunning) {
    return;
  }

  try {
    // QUERY FOR SCHEDULED CONTENT THAT'S DUE AND NOT YET POSTED
    const { data: scheduledItems, error } = await workerState.supabase
      .from("scheduled_content")
      .select(
        "id, scheduled_at, reddit_account_id, source_user_interaction, user_id, is_posted, error_message, failed_times"
      )
      .lte("scheduled_at", new Date().toISOString())
      .or("is_posted.is.null,is_posted.eq.false")
      .or("failed_times.is.null,failed_times.lt.3")
      .order("scheduled_at", { ascending: true })
      .limit(10);

    if (error) {
      console.error("❌ Error querying scheduled content:", error);
      return;
    }

    if (!scheduledItems || scheduledItems.length === 0) {
      return;
    }

    console.log(
      `📋 Found ${scheduledItems.length} scheduled content items to process`
    );

    // PROCESS EACH ITEM SEQUENTIALLY TO AVOID RATE LIMITING
    for (const item of scheduledItems) {
      await processScheduledItem(item);

      // ADD SMALL DELAY BETWEEN POSTS TO RESPECT RATE LIMITS
      await sleep(2000);
    }
  } catch (error) {
    console.error("❌ Error processing scheduled content:", error);
  }
}

// SETUP REAL-TIME SUBSCRIPTION FOR SCHEDULED CONTENT CHANGES
async function setupRealtimeSubscription(): Promise<void> {
  try {
    workerState.realtimeSubscription = workerState.supabase
      .channel("scheduled_content_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scheduled_content",
        },
        (payload) => {
          console.log("📡 New scheduled content detected:", payload.new);
          // PROCESS IMMEDIATELY IF SCHEDULED TIME HAS PASSED
          processScheduledContent();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            "✅ Real-time subscription established for scheduled_content"
          );
        } else if (status === "CHANNEL_ERROR") {
          console.error(
            "❌ Real-time subscription failed for scheduled_content"
          );
        }
      });
  } catch (error) {
    console.error("❌ Failed to setup real-time subscription:", error);
    throw error;
  }
}

// START THE SCHEDULED CONTENT WORKER
export async function startScheduledContentWorker(
  supabase: SupabaseClient
): Promise<void> {
  if (workerState.isRunning) {
    console.log("⚠️ Scheduled content worker is already running");
    return;
  }

  console.log("🚀 Starting scheduled content worker...");
  workerState.supabase = supabase;
  workerState.isRunning = true;

  try {
    // SETUP REAL-TIME SUBSCRIPTION FOR NEW SCHEDULED CONTENT
    await setupRealtimeSubscription();

    // SETUP POLLING FALLBACK EVERY 30 SECONDS
    workerState.pollingInterval = setInterval(() => {
      processScheduledContent();
    }, 30000);

    // PROCESS ANY EXISTING SCHEDULED CONTENT ON STARTUP
    await processScheduledContent();

    console.log("✅ Scheduled content worker started successfully");
  } catch (error) {
    console.error("❌ Failed to start scheduled content worker:", error);
    workerState.isRunning = false;
    throw error;
  }
}

// STOP THE SCHEDULED CONTENT WORKER
export async function stopScheduledContentWorker(): Promise<void> {
  if (!workerState.isRunning) {
    console.log("⚠️ Scheduled content worker is not running");
    return;
  }

  console.log("🛑 Stopping scheduled content worker...");

  // CLEAR POLLING INTERVAL
  if (workerState.pollingInterval) {
    clearInterval(workerState.pollingInterval);
    workerState.pollingInterval = null;
  }

  // UNSUBSCRIBE FROM REAL-TIME UPDATES
  if (workerState.realtimeSubscription) {
    await workerState.supabase.removeChannel(workerState.realtimeSubscription);
    workerState.realtimeSubscription = null;
  }

  workerState.isRunning = false;
  console.log("✅ Scheduled content worker stopped");
}

// GET SCHEDULED CONTENT WORKER STATUS
export function getScheduledContentWorkerStatus(): {
  isRunning: boolean;
  hasRealtimeConnection: boolean;
} {
  return {
    isRunning: workerState.isRunning,
    hasRealtimeConnection: !!workerState.realtimeSubscription,
  };
}
