import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { getValidRedditToken } from "@/utils/reddit/reddit-access-token";
import { redditCallout } from "@/utils/reddit/reddit-callout";
import { NextRequest, NextResponse } from "next/server";

interface StartConversationRequest {
  to: string;
  subject: string;
  text: string;
  leadId: string;
}

export const POST = async (req: NextRequest) => {
  try {
    // Parse request body
    const { to, subject, text, leadId }: StartConversationRequest =
      await req.json();

    // Validate required fields
    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, text" },
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

    // Prepare form data for Reddit's compose API
    const formData = new URLSearchParams({
      api_type: "json",
      to: to,
      subject: subject,
      text: text,
    });

    // Send message via Reddit API
    const result = await redditCallout("https://oauth.reddit.com/api/compose", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redditToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to send message",
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

    // Update all reddit leads with the same reddit_author to contacted
    const supabase = supabaseAdmin;
    const { error: updateError } = await supabase
      .from("reddit_leads")
      .update({ status: "contacted", contacted_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("reddit_author", response.json.data.to);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: response.json?.data || null,
    });
  } catch (error) {
    console.error("Error in start-conversation route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to process message request",
      },
      { status: 500 }
    );
  }
};
