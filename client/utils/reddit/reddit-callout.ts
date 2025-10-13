interface RedditCalloutOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  retryAttempts?: number;
  retryDelay?: number;
  useOAuth?: boolean; // Enable OAuth authentication
}

interface RedditCalloutResult<T = any> {
  data?: T;
  success: boolean;
  error?: string;
  status: number;
}

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const getRandomDelay = (baseDelay: number): number => {
  const jitter = Math.random() * 0.3;
  return baseDelay + (baseDelay * jitter);
};

export async function redditCallout<T = any>(
  url: string,
  options: RedditCalloutOptions = {}
): Promise<RedditCalloutResult<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    retryAttempts = 3,
    retryDelay = 1000,
    useOAuth = false,
  } = options;

  // If OAuth is enabled, get token and modify URL/headers
  let finalUrl = url;
  let oauthToken: string | null = null;

  if (useOAuth) {
    const { getRedditAppToken } = await import('./reddit-oauth');
    oauthToken = await getRedditAppToken();

    if (oauthToken) {
      // Convert www.reddit.com URLs to oauth.reddit.com
      finalUrl = url.replace('https://www.reddit.com/', 'https://oauth.reddit.com/');
    } else {
      console.warn('⚠️ OAuth requested but token unavailable, falling back to unauthenticated request');
    }
  }

  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
    // Add OAuth Bearer token if available
    ...(oauthToken && { 'Authorization': `Bearer ${oauthToken}` }),
  };

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      if (attempt > 1) {
        const delay = getRandomDelay(retryDelay * Math.pow(2, attempt - 2));
        await sleep(delay);
      }

      const response = await fetch(finalUrl, {
        method,
        headers: requestHeaders,
        body,
        signal: AbortSignal.timeout(30000),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * attempt;

        if (attempt < retryAttempts) {
          await sleep(getRandomDelay(delay));
          continue;
        }

        return {
          success: false,
          error: 'Rate limited by Reddit API',
          status: 429,
        };
      }

      if (response.status === 503 || response.status >= 500) {
        if (attempt < retryAttempts) {
          continue;
        }

        return {
          success: false,
          error: `Reddit API server error: ${response.status}`,
          status: response.status,
        };
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status,
        };
      }

      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as T;
      }

      return {
        data,
        success: true,
        status: response.status,
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        if (attempt < retryAttempts) {
          continue;
        }
        return {
          success: false,
          error: 'Request timeout',
          status: 408,
        };
      }

      if (attempt === retryAttempts) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        };
      }
    }
  }

  return {
    success: false,
    error: 'Max retry attempts exceeded',
    status: 500,
  };
}
