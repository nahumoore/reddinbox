import { SupabaseClient } from "@supabase/supabase-js";
import { refreshRedditToken } from "../../helpers/reddit/refresh-access-token";
import { Database } from "../../lib/supabase/database.types";

type RedditInteraction =
  Database["public"]["Tables"]["reddit_user_interactions"]["Row"];
type RedditAccount = Database["public"]["Tables"]["reddit_accounts"]["Row"];

export const postComments = async ({
  supabase,
}: {
  supabase: SupabaseClient<Database>;
}) => {
  console.log("🔍 Starting post comments job...");

  // Fetch scheduled comments with type = comment_reply or post_reply
  const { data: scheduledInteractions, error: fetchError } = await supabase
    .from("reddit_user_interactions")
    .select(
      `
      id,
      our_interaction_content,
      original_reddit_parent_id,
      retry_count,
      reddit_accounts!inner (
        id,
        access_token,
        refresh_token,
        token_expires_at,
        name
      )
    `
    )
    .eq("status", "scheduled")
    .in("interaction_type", ["comment_reply", "post_reply"])
    .lte("scheduled_at", new Date().toISOString())
    .lt("retry_count", 3);

  if (fetchError) {
    console.error("❌ Error fetching scheduled interactions:", fetchError);
    return;
  }

  if (!scheduledInteractions || scheduledInteractions.length === 0) {
    console.log("✅ No scheduled comments to post");
    return;
  }

  console.log(
    `📝 Found ${scheduledInteractions.length} scheduled comment(s) to post`
  );

  for (const interaction of scheduledInteractions) {
    // Add random delay (5-20 seconds) to make posting pattern more human-like
    const randomDelay = Math.floor(Math.random() * 15000) + 5000; // 5-20 seconds
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
    console.log(
      `⏱️  Waiting ${(randomDelay / 1000).toFixed(
        1
      )}s before processing next comment...`
    );

    const redditAccount = interaction.reddit_accounts as RedditAccount;

    if (!redditAccount || !redditAccount.access_token) {
      console.error(
        `❌ No valid Reddit account for interaction ${interaction.id}`
      );
      await supabase
        .from("reddit_user_interactions")
        .update({
          error_message: "No valid Reddit account or access token",
          retry_count: (interaction.retry_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", interaction.id);
      continue;
    }

    if (!interaction.our_interaction_content) {
      console.error(`❌ No content for interaction ${interaction.id}`);
      await supabase
        .from("reddit_user_interactions")
        .update({
          error_message: "No interaction content provided",
          retry_count: (interaction.retry_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", interaction.id);
      continue;
    }

    // Check if token is expired or about to expire
    let accessToken = redditAccount.access_token;
    if (redditAccount.token_expires_at) {
      const expirationTime = new Date(redditAccount.token_expires_at).getTime();
      const now = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

      // If token is expired or close to expiring, refresh it
      if (now >= expirationTime - bufferTime) {
        console.log(
          `🔄 Refreshing token for Reddit account ${redditAccount.id}`
        );
        const refreshResult = await refreshRedditToken(
          supabase,
          redditAccount.id
        );

        if (!refreshResult.success) {
          console.error(
            `❌ Failed to refresh token for interaction ${interaction.id}:`,
            refreshResult.error
          );
          await supabase
            .from("reddit_user_interactions")
            .update({
              error_message: `Token refresh failed: ${refreshResult.error}`,
              retry_count: (interaction.retry_count || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", interaction.id);
          continue;
        }

        accessToken = refreshResult.data!.access_token;
        console.log(
          `✅ Successfully refreshed token for Reddit account ${redditAccount.id}`
        );
      }
    }

    try {
      // Post comment to Reddit
      const redditResponse = await fetch(
        "https://oauth.reddit.com/api/comment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": `Reddinbox/1.0 (by /u/${redditAccount.name})`,
          },
          body: new URLSearchParams({
            thing_id: interaction.original_reddit_parent_id,
            text: interaction.our_interaction_content,
            api_type: "json",
          }),
        }
      );

      const responseData = (await redditResponse.json()) as any;

      // Check for rate limiting error
      if (
        responseData.json?.errors &&
        responseData.json.errors.length > 0 &&
        responseData.json.errors[0][0] === "RATELIMIT"
      ) {
        const errorMessage = responseData.json.errors[0][1] as string;
        console.log(`⏳ Rate limited for interaction ${interaction.id}`);

        // Parse "you are doing that too much. try again in X minutes/seconds"
        const minutesMatch = errorMessage.match(/try again in (\d+)\s+minute/i);
        const secondsMatch = errorMessage.match(/try again in (\d+)\s+second/i);

        let retryMinutes = 10; // Default retry time
        if (minutesMatch) {
          retryMinutes = parseInt(minutesMatch[1], 10);
        } else if (secondsMatch) {
          retryMinutes = Math.ceil(parseInt(secondsMatch[1], 10) / 60);
        }

        const newScheduledAt = new Date(
          Date.now() + retryMinutes * 60 * 1000
        ).toISOString();

        await supabase
          .from("reddit_user_interactions")
          .update({
            scheduled_at: newScheduledAt,
            error_message: errorMessage,
            retry_count: (interaction.retry_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", interaction.id);

        console.log(
          `📅 Rescheduled interaction ${interaction.id} to ${newScheduledAt}`
        );
        continue;
      }

      // Check for other errors
      if (
        !redditResponse.ok ||
        (responseData.json?.errors && responseData.json.errors.length > 0)
      ) {
        const errorMsg = responseData.json?.errors?.[0]?.[1] ?? "Unknown error";
        console.error(
          `❌ Error posting comment for interaction ${interaction.id}:`,
          errorMsg
        );

        await supabase
          .from("reddit_user_interactions")
          .update({
            error_message: errorMsg,
            retry_count: (interaction.retry_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", interaction.id);
        continue;
      }

      // Success - extract the comment ID
      const postedCommentId =
        responseData.json?.data?.things?.[0]?.data?.id ?? null;

      await supabase
        .from("reddit_user_interactions")
        .update({
          status: "posted",
          our_interaction_reddit_id: postedCommentId,
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", interaction.id);

      console.log(
        `✅ Successfully posted comment for interaction ${interaction.id}`
      );
    } catch (error) {
      console.error(
        `❌ Exception posting comment for interaction ${interaction.id}:`,
        error
      );

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await supabase
        .from("reddit_user_interactions")
        .update({
          error_message: errorMessage,
          retry_count: (interaction.retry_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", interaction.id);
    }
  }

  console.log("✅ Post comments job completed");
};
