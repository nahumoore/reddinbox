import { refreshRedditToken } from "@/helpers/reddit/refresh-access-token";
import { SupabaseClient } from "@supabase/supabase-js";

interface RedditAccountData {
  id: string;
  name: string;
  access_token: string;
  token_expires_at: string | null;
  user_id: string;
  reddit_id: string;
  user_info: {
    auth_user_id: string;
    name: string;
    websites: {
      id: string;
      name: string;
      description: string | null;
      keywords: string[] | null;
    };
  };
}

interface FetchRedditAccountResult {
  success: boolean;
  data?: {
    redditAccount: RedditAccountData;
    userInfo: {
      auth_user_id: string;
      name: string;
      websites: {
        id: string;
        name: string;
        description: string | null;
        keywords: string[] | null;
      };
    };
    activeWebsite: {
      id: string;
      name: string;
      description: string | null;
      keywords: string[] | null;
    };
    accessToken: string;
  };
  error?: string;
}

export async function fetchRedditAccount(
  supabase: SupabaseClient,
  redditAccountId: string
): Promise<FetchRedditAccountResult> {
  // FETCH REDDIT ACCOUNT WITH USER AND ACTIVE WEBSITE
  const { data: redditAccount, error: accountError } = await supabase
    .from("reddit_accounts")
    .select(
      `
        id,
        name,
        reddit_id,
        access_token,
        token_expires_at,
        user_id,
        user_info!inner (
          auth_user_id,
          name,
          websites!inner (
            id,
            name,
            description,
            keywords
          )
        )
      `
    )
    .eq("id", redditAccountId)
    .eq("user_info.websites.is_active", true)
    .single();

  if (accountError || !redditAccount) {
    return {
      success: false,
      error: "Reddit account not found or no active website",
    };
  }

  const userInfo = Array.isArray(redditAccount.user_info)
    ? redditAccount.user_info[0]
    : redditAccount.user_info;

  const activeWebsite = Array.isArray(userInfo.websites)
    ? userInfo.websites[0]
    : userInfo.websites;

  if (!activeWebsite) {
    return {
      success: false,
      error: "No active website found",
    };
  }

  // CHECK TOKEN EXPIRATION AND REFRESH IF NEEDED
  let accessToken = redditAccount.access_token;
  const tokenExpiresAt = redditAccount.token_expires_at
    ? new Date(redditAccount.token_expires_at)
    : null;

  if (!tokenExpiresAt || tokenExpiresAt <= new Date()) {
    console.log("🔄 Access token expired, refreshing...");
    const refreshResult = await refreshRedditToken(supabase, redditAccountId);

    if (!refreshResult.success || !refreshResult.data) {
      return {
        success: false,
        error: refreshResult.error || "Failed to refresh access token",
      };
    }

    accessToken = refreshResult.data.access_token;
  }

  if (!accessToken) {
    return {
      success: false,
      error: "No access token available",
    };
  }

  return {
    success: true,
    data: {
      redditAccount: redditAccount as unknown as RedditAccountData,
      userInfo: userInfo as unknown as {
        auth_user_id: string;
        name: string;
        websites: {
          id: string;
          name: string;
          description: string | null;
          keywords: string[] | null;
        };
      },
      activeWebsite,
      accessToken,
    },
  };
}
