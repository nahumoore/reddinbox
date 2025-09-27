import { SupabaseClient } from "@supabase/supabase-js";
import { redditCallout } from "../helpers/reddit-callout";

interface RedditAccount {
  id: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  name: string;
}

interface PostCommentResult {
  success: boolean;
  comment_id?: string;
  error?: string;
  should_retry?: boolean;
  is_rate_limited?: boolean;
  rate_limit_minutes?: number;
}

interface RefreshTokenResult {
  success: boolean;
  access_token?: string;
  expires_at?: string;
  error?: string;
}

// GET REDDIT ACCOUNT WITH VALID TOKEN
async function getRedditAccount(
  supabase: SupabaseClient,
  accountId: string
): Promise<RedditAccount | null> {
  try {
    const { data: account, error } = await supabase
      .from("reddit_accounts")
      .select("id, access_token, refresh_token, token_expires_at, name")
      .eq("id", accountId)
      .eq("is_active", true)
      .single();

    if (error || !account) {
      console.error(`❌ Reddit account ${accountId} not found:`, error);
      return null;
    }

    return account;
  } catch (error) {
    console.error(`❌ Error fetching Reddit account ${accountId}:`, error);
    return null;
  }
}

// REFRESH ACCESS TOKEN USING REFRESH TOKEN
async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResult> {
  try {
    if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
      return {
        success: false,
        error: "Reddit client configuration is missing",
      };
    }

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Reddinbox/1.0",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to refresh Reddit token`,
      };
    }

    const tokenData = (await response.json()) as {
      error: string;
      access_token: string;
      expires_in: number;
    };

    if (tokenData.error) {
      return {
        success: false,
        error: `Reddit API error: ${tokenData.error}`,
      };
    }

    const expiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000
    ).toISOString();

    return {
      success: true,
      access_token: tokenData.access_token,
      expires_at: expiresAt,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error during token refresh: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

// PARSE REDDIT RATE LIMITING ERROR MESSAGE TO EXTRACT MINUTES
function parseRedditRateLimitError(errorMessage: string): number | null {
  if (!errorMessage) return null;

  // LOOK FOR PATTERNS LIKE "Take a break for 4 minutes" OR "Take a break for 1 minute"
  const rateLimitPattern = /take a break for (\d+) minutes?/i;
  const match = errorMessage.match(rateLimitPattern);

  if (match && match[1]) {
    const minutes = parseInt(match[1], 10);
    return isNaN(minutes) ? null : minutes;
  }

  return null;
}

// CHECK IF TOKEN IS EXPIRED AND REFRESH IF NEEDED
async function ensureValidToken(
  supabase: SupabaseClient,
  account: RedditAccount
): Promise<string | null> {
  // CHECK IF TOKEN IS STILL VALID (WITH 5 MINUTE BUFFER)
  if (account.token_expires_at && account.access_token) {
    const expirationTime = new Date(account.token_expires_at).getTime();
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (now < expirationTime - bufferTime) {
      return account.access_token;
    }
  }

  // TOKEN IS EXPIRED OR MISSING, ATTEMPT REFRESH
  if (!account.refresh_token) {
    console.error(`❌ No refresh token available for account ${account.id}`);
    return null;
  }

  const refreshResult = await refreshAccessToken(account.refresh_token);

  if (!refreshResult.success) {
    console.error(
      `❌ Failed to refresh token for account ${account.id}:`,
      refreshResult.error
    );
    return null;
  }

  // UPDATE DATABASE WITH NEW TOKEN
  const { error: updateError } = await supabase
    .from("reddit_accounts")
    .update({
      access_token: refreshResult.access_token,
      token_expires_at: refreshResult.expires_at,
      last_api_call: new Date().toISOString(),
    })
    .eq("id", account.id);

  if (updateError) {
    console.error(
      `❌ Failed to update token in database for account ${account.id}:`,
      updateError
    );
    return null;
  }

  return refreshResult.access_token!;
}

// POST COMMENT TO REDDIT
export async function postRedditComment(
  supabase: SupabaseClient,
  redditAccountId: string,
  thingId: string,
  commentText: string
): Promise<PostCommentResult> {
  try {
    // GET REDDIT ACCOUNT DETAILS
    const account = await getRedditAccount(supabase, redditAccountId);
    if (!account) {
      return {
        success: false,
        error: "Reddit account not found or inactive",
        should_retry: false,
      };
    }

    // ENSURE VALID ACCESS TOKEN
    const accessToken = await ensureValidToken(supabase, account);
    if (!accessToken) {
      return {
        success: false,
        error: "Failed to obtain valid access token",
        should_retry: false,
      };
    }

    // PREPARE COMMENT DATA
    const formData = new URLSearchParams({
      api_type: "json",
      thing_id: thingId.startsWith("t3_") ? thingId : `t3_${thingId}`,
      text: commentText,
    });

    // POST COMMENT VIA REDDIT API
    const response = await redditCallout(
      "https://oauth.reddit.com/api/comment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Reddinbox/1.0",
        },
        body: formData.toString(),
        retryAttempts: 3,
        retryDelay: 2000,
      }
    );

    // UPDATE LAST API CALL TIMESTAMP
    await supabase
      .from("reddit_accounts")
      .update({ last_api_call: new Date().toISOString() })
      .eq("id", account.id);

    if (!response.success) {
      // CHECK FOR RATE LIMITING IN RESPONSE ERROR
      const rateLimitMinutes = parseRedditRateLimitError(response.error || "");

      if (rateLimitMinutes) {
        return {
          success: false,
          error: response.error || "Rate limited",
          should_retry: true,
          is_rate_limited: true,
          rate_limit_minutes: rateLimitMinutes,
        };
      }

      // DETERMINE IF ERROR IS RETRYABLE
      const shouldRetry = response.status === 429 || response.status >= 500;

      return {
        success: false,
        error: response.error || "Failed to post comment",
        should_retry: shouldRetry,
      };
    }

    // PARSE REDDIT API RESPONSE
    const resultData = response.data;

    if (resultData?.json?.errors && resultData.json.errors.length > 0) {
      const errorMessages = resultData.json.errors
        .map((err: any[]) => err[1])
        .join(", ");

      // CHECK FOR RATE LIMITING IN ERROR MESSAGES
      const rateLimitMinutes = parseRedditRateLimitError(errorMessages);

      if (rateLimitMinutes) {
        return {
          success: false,
          error: errorMessages,
          should_retry: true,
          is_rate_limited: true,
          rate_limit_minutes: rateLimitMinutes,
        };
      }

      // RATE LIMITING ERRORS ARE RETRYABLE
      const shouldRetry =
        errorMessages.includes("RATELIMIT") ||
        errorMessages.includes("TOO_FREQUENT");

      return {
        success: false,
        error: errorMessages,
        should_retry: shouldRetry,
      };
    }

    // EXTRACT COMMENT ID FROM SUCCESSFUL RESPONSE
    const commentData = resultData?.json?.data?.things?.[0]?.data;
    const commentId = commentData?.id;

    if (!commentId) {
      return {
        success: false,
        error: "Comment posted but no comment ID returned",
        should_retry: false,
      };
    }

    console.log(
      `✅ Successfully posted comment ${commentId} for account ${account.name}`
    );

    return {
      success: true,
      comment_id: commentId,
    };
  } catch (error) {
    console.error("❌ Error posting comment:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      should_retry: true,
    };
  }
}
