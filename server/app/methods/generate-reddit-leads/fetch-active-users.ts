import { SupabaseClient } from "@supabase/supabase-js";

export interface ActiveUser {
  auth_user_id: string;
  name: string | null;
  email: string | null;
  websites: {
    id: string;
    name: string;
    description: string | null;
    keywords: string[] | null;
    type_of_service: "saas" | "agency";
    subreddit_reddit_ids: string[];
    authority_feed_options: unknown;
  }[];
  reddit_accounts: {
    id: string;
    name: string;
    is_active: boolean;
  }[];
}

const devEmailTest = "nahuelmoreno2904@gmail.com";
export async function fetchActiveUsers(
  supabase: SupabaseClient
): Promise<ActiveUser[]> {
  // BUILD BASE QUERY
  let query = supabase
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
        type_of_service,
        authority_feed_options
      ),
      reddit_accounts (
        id,
        name,
        reddit_id,
        is_active
      )
    `
    )
    .in("subscription_status", ["active", "free-trial"])
    .eq("websites.is_active", true);

  // APPLY DEV EMAIL FILTER ONLY IN DEVELOPMENT
  // if (process.env.NODE_ENV === "dev") query = query.eq("email", devEmailTest);
  query = query.eq("email", devEmailTest);

  // APPLY REMAINING FILTERS
  const { data: activeUsers, error: usersError } = await query;

  if (usersError) {
    console.error("❌ Error fetching active users:", usersError);
    throw usersError;
  }

  return activeUsers || [];
}
