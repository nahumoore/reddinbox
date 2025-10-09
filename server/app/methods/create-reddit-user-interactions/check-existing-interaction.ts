import { SupabaseClient } from "@supabase/supabase-js";

export async function checkExistingInteraction(
  supabase: SupabaseClient,
  userId: string,
  redditId: string
): Promise<boolean> {
  const { data: existingInteraction } = await supabase
    .from("reddit_user_interactions")
    .select("id")
    .eq("user_id", userId)
    .eq("original_reddit_parent_id", redditId)
    .single();

  return !!existingInteraction;
}
