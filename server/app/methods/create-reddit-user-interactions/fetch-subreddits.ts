import { SupabaseClient } from "@supabase/supabase-js";

export interface Subreddit {
  id: string;
  display_name_prefixed: string;
  audience_ai_prompt: string | null;
}

export async function fetchSubreddits(
  supabase: SupabaseClient,
  subredditIds: string[]
): Promise<Subreddit[]> {
  const { data: subreddits, error: subredditsError } = await supabase
    .from("reddit_subreddits")
    .select("id, display_name_prefixed, audience_ai_prompt")
    .in("id", subredditIds);

  if (subredditsError) {
    throw subredditsError;
  }

  return subreddits || [];
}
