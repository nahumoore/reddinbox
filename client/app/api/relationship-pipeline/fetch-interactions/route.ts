import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const POST = async () => {
  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin;

  // Fetch all posted interactions for this user with only required fields
  const { data: interactions, error } = await supabase
    .from("reddit_user_interactions")
    .select(
      `
      id,
      created_at,
      interacted_with_reddit_username,
      interaction_type,
      status,
      our_interaction_content,
      similarity_score,
      thread_context,
      original_reddit_parent_id,
      reddit_content_discovered (
        reddit_url,
        title,
        content,
        summarized_content,
        content_category,
        ups,
        downs,
        reddit_created_at,
        subreddit:reddit_subreddits (
          id,
          display_name_prefixed
        )
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "posted")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch interactions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ interactions: interactions || [] }, { status: 200 });
};
