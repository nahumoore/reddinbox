import { redditCallout } from "@/helpers/reddit/reddit-callout";
import Bottleneck from "bottleneck";

export interface RedditPost {
  kind: string;
  data: {
    id: string;
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    subreddit_name_prefixed: string;
    created_utc: number;
    permalink: string;
    url: string;
    ups: number;
    downs: number;
    score: number;
    num_comments: number;
    is_self: boolean;
  };
}

export interface RedditResponse {
  kind: string;
  data: {
    after: string | null;
    dist: number;
    children: RedditPost[];
  };
}

const limiter = new Bottleneck({
  minTime: 2000,
  maxConcurrent: 1,
});

// BATCH FETCH POSTS FROM ALL SUBREDDITS WITH PARALLEL PROCESSING
export async function fetchAllSubredditPosts(
  subreddits: { id: string; display_name_prefixed: string }[]
): Promise<{
  allFetchedPosts: Array<{
    subredditId: string;
    subredditName: string;
    posts: RedditPost[];
    error?: string;
  }>;
  totalPostsDiscovered: number;
  fetchErrors: string[];
}> {
  console.log(
    `📡 Starting parallel fetch from ${subreddits.length} subreddits...`
  );

  // CREATE PROMISES FOR ALL SUBREDDIT FETCHES WITH RATE LIMITING
  const fetchPromises = subreddits.map(async (subreddit) => {
    try {
      console.log(
        `📡 Fetching posts from ${subreddit.display_name_prefixed}...`
      );

      // FETCH NEW POSTS FROM REDDIT API WITH RATE LIMITING
      const redditResponse = await limiter.schedule(() =>
        redditCallout<RedditResponse>(
          `https://www.reddit.com/${subreddit.display_name_prefixed}/new.json?limit=25`,
          {
            method: "GET",
            retryAttempts: 3,
            retryDelay: 1000,
          }
        )
      );

      if (!redditResponse.success || !redditResponse.data) {
        const errorMsg = `${subreddit.display_name_prefixed}: ${redditResponse.error}`;
        console.error(errorMsg);

        return {
          subredditId: subreddit.id,
          subredditName: subreddit.display_name_prefixed,
          posts: [],
          error: redditResponse.error,
        };
      }

      const posts = redditResponse.data.data.children;
      console.log(
        `📄 Found ${posts.length} posts in ${subreddit.display_name_prefixed}`
      );

      return {
        subredditId: subreddit.id,
        subredditName: subreddit.display_name_prefixed,
        posts,
      };
    } catch (error) {
      const errorMsg = `${subreddit.display_name_prefixed}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;

      console.error(errorMsg);
      return {
        subredditId: subreddit.id,
        subredditName: subreddit.display_name_prefixed,
        posts: [],
        error: errorMsg,
      };
    }
  });

  // WAIT FOR ALL FETCHES TO COMPLETE
  const results = await Promise.allSettled(fetchPromises);

  // PROCESS RESULTS AND COLLECT DATA
  const allFetchedPosts = [];
  let totalPostsDiscovered = 0;
  const fetchErrors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allFetchedPosts.push(result.value);
      totalPostsDiscovered += result.value.posts.length;
      if (result.value.error) {
        fetchErrors.push(result.value.error);
      }
    } else {
      console.error(`❌ Failed to fetch subreddit posts:`, result.reason);
      fetchErrors.push(`Unknown subreddit: ${result.reason}`);
    }
  }

  console.log(
    `📁 Batch fetch completed - ${totalPostsDiscovered} total posts discovered`
  );
  return { allFetchedPosts, totalPostsDiscovered, fetchErrors };
}
