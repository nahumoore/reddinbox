import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { subreddit } = await request.json();

    if (!subreddit || !subreddit.id || !subreddit.display_name_prefixed) {
      return NextResponse.json(
        { error: "Invalid subreddit data" },
        { status: 400 }
      );
    }

    // CHECK USER
    const supabaseAuth = await supabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if subreddit already exists
    const supabase = supabaseAdmin;
    const { data: existingSubreddit, error: fetchError } = await supabase
      .from("reddit_subreddits")
      .select("id, is_active")
      .eq("id", subreddit.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking existing subreddit:", fetchError);
      return NextResponse.json(
        { error: "Failed to check existing subreddit" },
        { status: 500 }
      );
    }

    // If subreddit exists
    if (existingSubreddit) {
      if (existingSubreddit.is_active === false) {
        return NextResponse.json({
          error:
            "This subreddit has already been submitted and is pending authorization.",
        });
      }
      // If already active
      return NextResponse.json({
        error: "This subreddit is already being tracked.",
      });
    }

    // Insert new subreddit with is_active = false
    const { error: insertError } = await supabase
      .from("reddit_subreddits")
      .insert({
        id: subreddit.id,
        display_name_prefixed: subreddit.display_name_prefixed,
        title: subreddit.title || null,
        primary_color: subreddit.primary_color || null,
        subscribers: subreddit.subscribers || null,
        public_description: subreddit.public_description || null,
        community_icon: subreddit.community_icon || null,
        banner_background_image: subreddit.banner_background_image || null,
        description: subreddit.description || null,
        lang: subreddit.lang || null,
        is_active: false,
      });

    if (insertError) {
      console.error("Error inserting subreddit:", insertError);
      return NextResponse.json(
        { error: "Failed to submit subreddit suggestion" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "We'll review it and notify you within approximately one hour.",
    });
  } catch (error) {
    console.error("Error in suggest-subreddit route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
