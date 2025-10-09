import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin;

  // Get active subreddits
  const { data: subreddits, error: subredditsError } = await supabase
    .from("reddit_subreddits")
    .select("id, display_name_prefixed")
    .eq("is_active", true);

  if (subredditsError) {
    return NextResponse.json(
      { error: subredditsError.message },
      { status: 500 }
    );
  }

  if (!subreddits || subreddits.length === 0) {
    return NextResponse.json({ postsPerSubreddit: {} }, { status: 200 });
  }

  // Calculate timestamp for one hour ago
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Get count of discovered posts per subreddit in the last 24 hours
  const { data: posts, error: postsError } = await supabase
    .from("reddit_content_discovered")
    .select("subreddit_id")
    .gte("created_at", yesterday)
    .in(
      "subreddit_id",
      subreddits.map((s) => s.id)
    );

  if (postsError) {
    return NextResponse.json({ error: postsError.message }, { status: 500 });
  }

  // Count posts per subreddit
  const postsPerSubreddit: Record<string, number> = {};
  subreddits.forEach((subreddit) => {
    postsPerSubreddit[subreddit.id] = 0;
  });

  posts?.forEach((post) => {
    if (post.subreddit_id) {
      postsPerSubreddit[post.subreddit_id] =
        (postsPerSubreddit[post.subreddit_id] || 0) + 1;
    }
  });

  return NextResponse.json({ postsPerSubreddit }, { status: 200 });
};
