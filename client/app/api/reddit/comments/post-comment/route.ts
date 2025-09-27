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
    if (!thing_id || !text) {
      return NextResponse.json(
        { error: "Missing required fields: thing_id, text" },
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

    // Get user's active Reddit account ID
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

    // Query for the latest scheduled_at time for this user
    const { data: latestScheduled } = await supabase
      .from("scheduled_content")
      .select("scheduled_at")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Calculate next scheduled time with 3-7 minute random window
    const now = new Date();
    const baseTime = latestScheduled?.scheduled_at
      ? new Date(latestScheduled.scheduled_at)
      : now;

    // Ensure base time is not in the past
    const scheduleFromTime = baseTime > now ? baseTime : now;

    // Add random 3-7 minutes (180-420 seconds)
    const randomMinutes = Math.floor(Math.random() * 5) + 3; // 3-7 minutes
    const scheduledAt = new Date(scheduleFromTime.getTime() + randomMinutes * 60 * 1000);

    // Create new scheduled content row
    const { error: scheduleError } = await supabase
      .from("scheduled_content")
      .insert({
        scheduled_at: scheduledAt.toISOString(),
        source_user_interaction: interaction_id,
        reddit_account_id: redditAccount.id,
        user_id: user.id,
        is_posted: false,
      });

    if (scheduleError) {
      console.error("Error creating scheduled content:", scheduleError);
      return NextResponse.json(
        { error: "Failed to schedule comment" },
        { status: 500 }
      );
    }

    // Update interaction status to 'scheduled'
    const { error: updateError } = await supabase
      .from("reddit_user_interactions")
      .update({
        status: "scheduled",
        our_interaction_content: text,
      })
      .eq("id", interaction_id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error(
        `Error updating interaction (${interaction_id}) status:`,
        updateError
      );
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Comment scheduled successfully",
      scheduled_at: scheduledAt.toISOString(),
      data: {
        interaction_id,
        scheduled_time: scheduledAt.toISOString(),
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
