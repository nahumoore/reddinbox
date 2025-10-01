import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface PostCommentRequest {
  thing_id: string;
  text: string;
  interaction_id: string;
}

export const POST = async (req: NextRequest) => {
  try {
    // Parse request body
    const { thing_id, text, interaction_id }: PostCommentRequest =
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

    // Get user's active Reddit account with access token
    const supabase = supabaseAdmin;
    const { data: redditAccount, error: redditAccountError } = await supabase
      .from("reddit_accounts")
      .select("id, access_token")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (redditAccountError || !redditAccount) {
      return NextResponse.json(
        { error: "No active Reddit account found" },
        { status: 400 }
      );
    }

    if (!redditAccount.access_token) {
      return NextResponse.json(
        { error: "Reddit account not authenticated" },
        { status: 400 }
      );
    }

    // Post comment to Reddit
    const redditResponse = await fetch("https://oauth.reddit.com/api/comment", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${redditAccount.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Reddinbox/1.0",
      },
      body: new URLSearchParams({
        thing_id,
        text,
        api_type: "json",
      }),
    });

    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.error("Reddit API error:", errorText);
      return NextResponse.json(
        { error: "Failed to post comment to Reddit", details: errorText },
        { status: redditResponse.status }
      );
    }

    const redditData = await redditResponse.json();

    // Check for Reddit API errors
    if (redditData.json?.errors?.length > 0) {
      console.error("Reddit API returned errors:", redditData.json.errors);
      return NextResponse.json(
        { error: "Reddit API error", details: redditData.json.errors },
        { status: 400 }
      );
    }

    // Extract the comment ID from the response
    const commentId = redditData.json?.data?.things?.[0]?.data?.id || null;

    // Update interaction status to 'submitted'
    const { error: updateError } = await supabase
      .from("reddit_user_interactions")
      .update({
        status: "submitted",
        our_interaction_content: text,
        our_interaction_reddit_id: commentId,
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
      message: "Comment posted successfully",
      data: {
        interaction_id,
        comment_id: commentId,
      },
    });
  } catch (error) {
    console.error("Error in post-comment route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to post comment",
      },
      { status: 500 }
    );
  }
};
