import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface RedditTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface RedditUserData {
  name: string;
  id: string;
  created_utc: number;
  comment_karma: number;
  link_karma: number;
  total_karma: number;
  is_gold: boolean;
  is_moderator: boolean;
  is_employee: boolean;
  has_verified_email: boolean;
  icon_img: string;
  snoovatar_img: string;
  verified: boolean;
  is_suspended: boolean;
  coins: number;
  num_friends: number;
  subreddit: string;
  public_description: string;
}

export interface TokenResult {
  success: boolean;
  redditToken?: string;
  error?: string;
  code?: string;
}

export interface ExchangeResult {
  success: boolean;
  data?: { tokenData: RedditTokenResponse; userData: RedditUserData };
  error?: string;
  code?: string;
}

export interface RefreshResult {
  success: boolean;
  data?: RedditTokenResponse;
  error?: string;
  code?: string;
}

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "reddit_access_token",
  REFRESH_TOKEN: "reddit_refresh_token",
  EXPIRES_AT: "reddit_expires_at",
  USERNAME: "reddit_username",
} as const;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

export async function getValidRedditToken(): Promise<TokenResult> {
  try {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    let refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
    let expiresAt = cookieStore.get(COOKIE_NAMES.EXPIRES_AT)?.value;

    // If no tokens in cookies, check Supabase for active Reddit account
    if (!accessToken || !refreshToken || !expiresAt) {
      const supabaseAuth = await supabaseServer();
      const {
        data: { user },
      } = await supabaseAuth.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "User not authenticated.",
          code: "USER_NOT_AUTHENTICATED",
        };
      }

      // Query for active Reddit account
      const supabase = supabaseAdmin;
      const { data: redditAccount, error } = await supabase
        .from("reddit_accounts")
        .select("access_token, refresh_token, token_expires_at")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (error || !redditAccount) {
        return {
          success: false,
          error: "No active Reddit account found. User needs to authenticate.",
          code: "NO_TOKENS",
        };
      }

      // Use tokens from database
      accessToken = redditAccount.access_token!;
      refreshToken = redditAccount.refresh_token!;
      expiresAt = redditAccount.token_expires_at
        ? new Date(redditAccount.token_expires_at).getTime().toString()
        : undefined;

      if (!accessToken || !refreshToken || !expiresAt) {
        return {
          success: false,
          error:
            "Incomplete Reddit tokens in database. User needs to re-authenticate.",
          code: "INCOMPLETE_TOKENS",
        };
      }
    }

    const expirationTime = parseInt(expiresAt);
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000;

    // If token is still valid with buffer time
    if (now < expirationTime - bufferTime) {
      return {
        success: true,
        redditToken: accessToken,
      };
    }

    // Token is expired or close to expiring, refresh it
    const refreshResult = await refreshRedditToken(refreshToken);

    if (!refreshResult.success) {
      await clearRedditTokens();
      return {
        success: false,
        error: refreshResult.error || "Failed to refresh Reddit token",
        code: refreshResult.code || "REFRESH_FAILED",
      };
    }

    await storeRedditTokens(refreshResult.data!);
    return {
      success: true,
      redditToken: refreshResult.data!.access_token,
    };
  } catch (error) {
    await clearRedditTokens();
    return {
      success: false,
      error: "Unexpected error occurred while getting Reddit token",
      code: "UNEXPECTED_ERROR",
    };
  }
}

export async function storeRedditTokens(
  tokenData: RedditTokenResponse,
  username?: string
): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + tokenData.expires_in * 1000;

  cookieStore.set(
    COOKIE_NAMES.ACCESS_TOKEN,
    tokenData.access_token,
    COOKIE_OPTIONS
  );
  cookieStore.set(
    COOKIE_NAMES.REFRESH_TOKEN,
    tokenData.refresh_token,
    COOKIE_OPTIONS
  );
  cookieStore.set(
    COOKIE_NAMES.EXPIRES_AT,
    expiresAt.toString(),
    COOKIE_OPTIONS
  );

  if (username) {
    cookieStore.set(COOKIE_NAMES.USERNAME, username, COOKIE_OPTIONS);
  }
}

export async function clearRedditTokens(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.EXPIRES_AT);
  cookieStore.delete(COOKIE_NAMES.USERNAME);
}

export async function isRedditAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  const expiresAt = cookieStore.get(COOKIE_NAMES.EXPIRES_AT)?.value;

  return !!(accessToken && refreshToken && expiresAt);
}

async function refreshRedditToken(
  refreshToken: string
): Promise<RefreshResult> {
  try {
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

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET_ID}`
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
        code: "HTTP_ERROR",
      };
    }

    const tokenData = await response.json();

    if (tokenData.error) {
      return {
        success: false,
        error: `Reddit API error: ${tokenData.error}`,
        code: "REDDIT_API_ERROR",
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

export async function exchangeCodeForTokens(
  code: string
): Promise<ExchangeResult> {
  try {
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

    // EXCHANGE CODE FOR ACCESS TOKEN
    const tokenResponse = await fetch(
      "https://www.reddit.com/api/v1/access_token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET_ID}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Reddinbox/1.0",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/reddit/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return {
        success: false,
        error: `HTTP ${tokenResponse.status}: Failed to exchange code for token`,
        code: "HTTP_ERROR",
      };
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        success: false,
        error: `Reddit API error: ${tokenData.error}`,
        code: "REDDIT_API_ERROR",
      };
    }

    // GET USER INFO
    const userResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "Reddinbox/1.0",
      },
    });

    if (!userResponse.ok) {
      return {
        success: false,
        error: `HTTP ${userResponse.status}: Failed to fetch user data`,
        code: "HTTP_ERROR",
      };
    }

    const userData = await userResponse.json();

    if (userData.error) {
      return {
        success: false,
        error: `Reddit API error: ${userData.error}`,
        code: "REDDIT_API_ERROR",
      };
    }

    return {
      success: true,
      data: { tokenData, userData },
    };
  } catch (error) {
    return {
      success: false,
      error: "Unexpected error occurred during code exchange",
      code: "UNEXPECTED_ERROR",
    };
  }
}
