import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ScheduleCommentRequest {
  thing_id: string;
  text: string;
  interaction_id: string;
}

export const POST = async (req: NextRequest) => {
  try {
    // Parse request body
    const { thing_id, text, interaction_id }: ScheduleCommentRequest =
      await req.json();

    // Validate required fields
    if (!thing_id || !text || !interaction_id) {
      return NextResponse.json(
        { error: "Missing required fields: thing_id, text, interaction_id" },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabaseAuth = await supabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's active Reddit account
    const supabase = supabaseAdmin;
    const { data: redditAccount, error: redditAccountError } = await supabase
      .from("reddit_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (redditAccountError || !redditAccount) {
      return NextResponse.json(
        { error: "No active Reddit account found" },
        { status: 400 }
      );
    }

    // Get the last scheduled interaction for this reddit account with interaction_type 'comment_reply'
    const { data: lastScheduled } = await supabase
      .from("reddit_user_interactions")
      .select("scheduled_at")
      .eq("reddit_account_id", redditAccount.id)
      .eq("interaction_type", "comment_reply")
      .not("scheduled_at", "is", null)
      .order("scheduled_at", { ascending: false })
      .limit(1)
      .single();

    // Calculate scheduled_at: last scheduled time + 5 minutes, or now if no previous scheduled
    let scheduledAt: Date;
    if (lastScheduled?.scheduled_at) {
      scheduledAt = new Date(
        new Date(lastScheduled.scheduled_at).getTime() + 5 * 60 * 1000
      );
    } else {
      scheduledAt = new Date(Date.now() + 5 * 60 * 1000);
    }

    // Update interaction to 'scheduled' status with scheduled_at time
    const { error: updateError } = await supabase
      .from("reddit_user_interactions")
      .update({
        status: "scheduled",
        our_interaction_content: text,
        scheduled_at: scheduledAt.toISOString(),
      })
      .eq("id", interaction_id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(
        `Error scheduling interaction (${interaction_id}):`,
        updateError
      );
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Comment scheduled successfully",
      data: {
        interaction_id,
        scheduled_at: scheduledAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in schedule-comment route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to schedule comment",
      },
      { status: 500 }
    );
  }
};
