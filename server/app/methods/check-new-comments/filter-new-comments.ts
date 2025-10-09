import { SupabaseClient } from "@supabase/supabase-js";
import { InboxMessage } from "./fetch-inbox-comments";

interface FilterNewCommentsResult {
  success: boolean;
  data?: {
    newComments: InboxMessage[];
  };
  error?: string;
}

export async function filterNewComments(
  supabase: SupabaseClient,
  userId: string,
  commentReplies: InboxMessage[]
): Promise<FilterNewCommentsResult> {
  // IDENTIFY NEW COMMENTS
  const discoveredRedditIds = commentReplies.map(
    (msg) => `t1_${msg.data.id}`
  );

  const { data: existingInteractions, error: interactionsError } =
    await supabase
      .from("reddit_user_interactions")
      .select("discovered_reddit_id")
      .eq("user_id", userId)
      .in("discovered_reddit_id", discoveredRedditIds);

  if (interactionsError) {
    console.error(
      "❌ Error fetching existing interactions:",
      interactionsError
    );
    return {
      success: false,
      error: "Database error",
    };
  }

  const existingDiscoveredIds = new Set(
    existingInteractions?.map((i) => i.discovered_reddit_id) || []
  );

  const newComments = commentReplies.filter(
    (msg) => !existingDiscoveredIds.has(`t1_${msg.data.id}`)
  );

  console.log(`✨ Found ${newComments.length} new comments to process`);

  return {
    success: true,
    data: {
      newComments,
    },
  };
}
