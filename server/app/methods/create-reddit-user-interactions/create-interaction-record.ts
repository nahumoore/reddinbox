import { SupabaseClient } from "@supabase/supabase-js";

export interface CreateInteractionParams {
  userId: string;
  websiteId: string;
  originalRedditParentId: string;
  interactedWithRedditUsername: string;
  ourInteractionContent: string;
  redditContentDiscoveredId: string;
  similarityScore: number;
  redditAccountId?: string;
}

export async function createInteractionRecord(
  supabase: SupabaseClient,
  params: CreateInteractionParams
): Promise<void> {
  const {
    userId,
    websiteId,
    originalRedditParentId,
    interactedWithRedditUsername,
    ourInteractionContent,
    redditContentDiscoveredId,
    redditAccountId,
    similarityScore,
  } = params;

  const { error: insertError } = await supabase
    .from("reddit_user_interactions")
    .insert({
      user_id: userId,
      website_id: websiteId,
      interaction_type: "post_reply",
      original_reddit_parent_id: originalRedditParentId,
      interacted_with_reddit_username: interactedWithRedditUsername,
      our_interaction_content: ourInteractionContent,
      our_interaction_reddit_id: null,
      reddit_content_discovered_id: redditContentDiscoveredId,
      reddit_account_id: redditAccountId,
      status: "new",
      similarity_score: similarityScore,
    });

  if (insertError) {
    throw insertError;
  }
}
