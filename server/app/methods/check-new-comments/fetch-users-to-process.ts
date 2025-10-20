import { SupabaseClient } from "@supabase/supabase-js";

export interface ActiveUser {
  auth_user_id: string;
  name: string | null;
  email: string | null;
  websites:
    | {
        id: string;
        name: string;
        description: string | null;
        keywords: string[] | null;
        subreddit_reddit_ids: string[];
        authority_feed_options: unknown;
      }
    | {
        id: string;
        name: string;
        description: string | null;
        keywords: string[] | null;
        subreddit_reddit_ids: string[];
        authority_feed_options: unknown;
      }[];
  reddit_accounts:
    | {
        id: string;
        name: string;
        is_active: boolean;
      }
    | {
        id: string;
        name: string;
        is_active: boolean;
      }[];
}

export async function fetchUsersToProcess(
  supabase: SupabaseClient
): Promise<ActiveUser[]> {
  const { data: activeUsers, error: usersError } = await supabase
    .from("user_info")
    .select(
      `
      auth_user_id,
      name,
      email,
      websites!inner (
        id,
        name,
        description,
        keywords,
        subreddit_reddit_ids,
        authority_feed_options
      ),
      reddit_accounts!inner (
        id,
        name,
        reddit_id,
        is_active
      )
    `
    )
    .in("subscription_status", ["active", "free-trial"])
    .eq("websites.is_active", true)
    .eq("reddit_accounts.is_active", true);

  if (usersError) {
    console.error("❌ Error fetching active users:", usersError);
    throw usersError;
  }

  return activeUsers || [];
}
