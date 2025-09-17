import { SubredditData } from "@/stores/onboarding-form";

interface RedditSearchResponse {
  data: {
    children: Array<{
      kind: string;
      data: {
        display_name: string;
        display_name_prefixed: string;
        title: string;
        header_title: string;
        primary_color: string;
        subscribers: number;
        public_description: string;
        community_icon: string;
        url: string;
      };
    }>;
  };
}

class RedditSearchService {
  private userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0",
  ];

  private cache = new Map<
    string,
    { data: RedditSearchResponse; timestamp: number }
  >();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_DELAY = 1500; // 1.5 seconds between requests
  private lastRequestTime = 0;

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const waitTime = this.REQUEST_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  private isValidResponse(data: any): data is RedditSearchResponse {
    return (
      data &&
      data.data &&
      Array.isArray(data.data.children) &&
      data.data.children.length > 0
    );
  }

  private async searchWithRetry(
    keyword: string,
    maxRetries = 3
  ): Promise<RedditSearchResponse | null> {
    // Check cache first
    const cacheKey = keyword.toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached results for "${keyword}"`);
      return cached.data;
    }

    await this.enforceRateLimit();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Searching for "${keyword}" (attempt ${attempt}/${maxRetries})`
        );

        const searchUrl = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(
          keyword
        )}&limit=25`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(searchUrl, {
          headers: {
            "User-Agent": this.getRandomUserAgent(),
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            Referer: "https://www.reddit.com/",
            DNT: "1",
            Connection: "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: RedditSearchResponse = await response.json();

        if (!this.isValidResponse(data)) {
          throw new Error("Invalid response format from Reddit API");
        }

        // Cache successful response
        this.cache.set(cacheKey, { data, timestamp: Date.now() });

        console.log(
          `✅ Found ${data.data.children.length} subreddits for "${keyword}"`
        );
        return data;
      } catch (error) {
        console.warn(
          `❌ Attempt ${attempt} failed for "${keyword}":`,
          error instanceof Error ? error.message : "Unknown error"
        );

        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`❌ All attempts failed for keyword "${keyword}"`);
    return null;
  }

  async findRelevantSubreddits(keywords: string[]): Promise<SubredditData[]> {
    try {
      const selectedSubreddits: SubredditData[] = [];
      const existingNames = new Set<string>();

      console.log(
        `🔍 Starting search for ${keywords.length} keywords:`,
        keywords
      );

      for (const keyword of keywords) {
        try {
          const data = await this.searchWithRetry(keyword);

          if (!data?.data?.children) {
            console.warn(`⚠️ No results found for keyword "${keyword}"`);
            continue;
          }

          let count = 0;
          const targetCount = 3;

          for (const child of data.data.children) {
            if (child.kind === "t5" && count < targetCount) {
              const subredditName = child.data.display_name?.toLowerCase();

              if (!subredditName || existingNames.has(subredditName)) {
                continue;
              }

              // Basic quality filters
              const subscribers = child.data.subscribers || 0;
              const hasDescription = child.data.public_description?.length > 0;

              // Skip very small or very large subreddits for better targeting
              if (subscribers < 100 || subscribers > 10000000) {
                continue;
              }

              selectedSubreddits.push({
                display_name: child.data.display_name,
                display_name_prefixed: child.data.display_name_prefixed,
                title: child.data.title || child.data.display_name,
                header_title: child.data.header_title || "",
                primary_color: child.data.primary_color || "",
                subscribers: subscribers,
                public_description: child.data.public_description || "",
                community_icon: child.data.community_icon || "",
                url: child.data.url || `/r/${child.data.display_name}/`,
              });

              existingNames.add(subredditName);
              count++;
            }
          }

          console.log(`✅ Added ${count} subreddits from keyword "${keyword}"`);
        } catch (keywordError) {
          console.warn(
            `❌ Error processing keyword "${keyword}":`,
            keywordError
          );
          continue;
        }
      }

      // Sort by subscriber count for better relevance
      selectedSubreddits.sort(
        (a, b) => (b.subscribers || 0) - (a.subscribers || 0)
      );

      console.log(`🎯 Total subreddits found: ${selectedSubreddits.length}`);
      return selectedSubreddits;
    } catch (error) {
      console.error("❌ Reddit subreddit search error:", error);
      return [];
    }
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Method to get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
const redditSearchService = new RedditSearchService();

// Export the main function with the same signature
export async function findRelevantSubreddits(
  keywords: string[]
): Promise<SubredditData[]> {
  return redditSearchService.findRelevantSubreddits(keywords);
}

// Export service for advanced usage
export { redditSearchService };
