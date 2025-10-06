import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../lib/supabase/database.types";

interface RedditTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: string;
}

interface RefreshResult {
  success: boolean;
  data?: RedditTokenResponse;
  error?: string;
  code?: string;
}

export async function refreshRedditToken(
  supabase: SupabaseClient<Database>,
  redditAccountId: string
): Promise<RefreshResult> {
  try {
    // Fetch the Reddit account
    const { data: redditAccount, error: fetchError } = await supabase
      .from("reddit_accounts")
      .select("refresh_token, name")
      .eq("id", redditAccountId)
      .single();

    if (fetchError || !redditAccount) {
      return {
        success: false,
        error: "Reddit account not found",
        code: "ACCOUNT_NOT_FOUND",
      };
    }

    if (!redditAccount.refresh_token) {
      return {
        success: false,
        error: "No refresh token available",
        code: "NO_REFRESH_TOKEN",
      };
    }

    if (
      !process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ||
      !process.env.REDDIT_CLIENT_SECRET_ID
    ) {
      return {
        success: false,
        error: "Reddit client configuration is missing",
        code: "MISSING_CONFIG",
      };
    }

    // Call Reddit API to refresh the token
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET_ID}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": `Reddinbox/1.0 (by /u/${redditAccount.name})`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: redditAccount.refresh_token,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to refresh Reddit token`,
        code: "HTTP_ERROR",
      };
    }

    const tokenData = (await response.json()) as RedditTokenResponse;

    if (tokenData.error) {
      return {
        success: false,
        error: `Reddit API error: ${tokenData.error}`,
        code: "REDDIT_API_ERROR",
      };
    }

    // Update the database with new tokens
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    const { error: updateError } = await supabase
      .from("reddit_accounts")
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", redditAccountId);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update tokens in database: ${updateError.message}`,
        code: "DB_UPDATE_ERROR",
      };
    }

    return {
      success: true,
      data: tokenData,
    };
  } catch (error) {
    return {
      success: false,
      error: "Unexpected error occurred during token refresh",
      code: "UNEXPECTED_ERROR",
    };
  }
}
