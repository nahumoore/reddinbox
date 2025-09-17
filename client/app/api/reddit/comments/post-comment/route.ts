import { supabaseServer } from "@/lib/supabase/server";
import { getValidRedditToken } from "@/utils/reddit/reddit-access-token";
import { redditCallout } from "@/utils/reddit/reddit-callout";
import { NextRequest, NextResponse } from "next/server";

interface PostCommentRequest {
  thing_id: string;
  text: string;
}

export const POST = async (req: NextRequest) => {
  try {
    // Parse request body
    const { thing_id, text }: PostCommentRequest = await req.json();

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

    // Get Reddit authentication token
    const { redditToken, success, error } = await getValidRedditToken();
    if (!success) {
      return NextResponse.json({ error: error }, { status: 401 });
    }

    // Prepare form data for Reddit's comment API
    const formData = new URLSearchParams({
      api_type: "json",
      thing_id: thing_id,
      text: text,
    });

    // Post comment via Reddit API
    const result = await redditCallout("https://oauth.reddit.com/api/comment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redditToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("result", result);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to post comment",
          details: "Reddit API request failed",
        },
        { status: result.status }
      );
    }

    // Check Reddit API response for errors
    const response = result.data;
    if (response.json?.errors && response.json.errors.length > 0) {
      const errorMessages = response.json.errors
        .map((err: any[]) => err[1])
        .join(", ");
      return NextResponse.json(
        {
          error: "Reddit API error",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Comment posted successfully",
      data: response.json?.data || null,
    });
  } catch (error) {
    console.error("Error in post-comment route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to process comment request",
      },
      { status: 500 }
    );
  }
};
