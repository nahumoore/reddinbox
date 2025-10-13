interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

// In-memory token cache (survives for the lifetime of the server)
let tokenCache: CachedToken | null = null;

/**
 * Get Reddit application-only OAuth token using Client Credentials flow
 * No user login required - this authenticates YOUR APP with Reddit
 *
 * This token allows access to public data (subreddits, posts, comments)
 * without requiring user authentication.
 */
export async function getRedditAppToken(): Promise<string | null> {
  // Check if we have a valid cached token
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET_ID;

  if (!clientId || !clientSecret) {
    console.error(
      "❌ Reddit OAuth credentials not found. Please set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables."
    );
    return null;
  }

  try {
    // Create Basic Auth header (base64 encode "clientId:clientSecret")
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Reddinbox/1.0",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Failed to get Reddit token: ${response.status}`,
        errorText
      );
      return null;
    }

    const data = (await response.json()) as RedditTokenResponse;

    // Cache the token (expire 5 minutes early to be safe)
    const expiresIn = (data.expires_in - 300) * 1000; // Convert to ms and subtract 5 min
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + expiresIn,
    };

    console.log("✅ Reddit OAuth token obtained successfully");
    return data.access_token;
  } catch (error) {
    console.error("❌ Error getting Reddit OAuth token:", error);
    return null;
  }
}

/**
 * Check if OAuth credentials are configured
 */
export function hasRedditOAuthCredentials(): boolean {
  return !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
}
