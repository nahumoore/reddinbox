import { SupabaseClient } from "@supabase/supabase-js";

export interface RelevantPost {
  id: string;
  reddit_id: string;
  subreddit_id: string;
  title: string;
  content: string;
  author: string;
  similarity_score: number;
}

export async function findRelevantPosts(
  supabase: SupabaseClient,
  websiteId: string,
  postsPerHour: number,
  postCategoriesActive: string[]
): Promise<RelevantPost[]> {
  // USE RPC FUNCTION TO FIND RELEVANT REDDIT CONTENT WITH SIMILARITY THRESHOLD 4.5
  const { data: relevantPosts, error: rpcError } = await supabase.rpc(
    "find_relevant_reddit_content",
    {
      p_website_id: websiteId,
      p_limit: postsPerHour,
    }
  );

  if (rpcError) {
    throw rpcError;
  }

  if (!relevantPosts || relevantPosts.length === 0) {
    return [];
  }

  // FILTER POSTS BY CONTENT CATEGORY IF CATEGORIES ARE SPECIFIED
  if (postCategoriesActive.length > 0) {
    // FETCH FULL CONTENT DETAILS TO GET CONTENT_CATEGORY
    const { data: contentDetails, error: contentError } = await supabase
      .from("reddit_content_discovered")
      .select("id, content_category")
      .in(
        "id",
        relevantPosts.map((p: { id: string }) => p.id)
      );

    if (contentError) {
      throw contentError;
    }

    if (contentDetails) {
      const allowedPostIds = contentDetails
        .filter(
          (c) =>
            c.content_category &&
            postCategoriesActive.includes(c.content_category)
        )
        .map((c) => c.id);

      return relevantPosts.filter((p: { id: string }) =>
        allowedPostIds.includes(p.id)
      );
    }
  }

  return relevantPosts;
}
