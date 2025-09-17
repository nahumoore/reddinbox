import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import { filterSpamPosts, logSpamStats } from "../../defs/spam-filters";
import { scoreRedditContent } from "../../helpers/ai-content-scoring";
import { RedditContent, Website } from "../../types/database-schema";

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    created_utc: number;
    url: string;
    permalink: string;
    ups: number;
    downs: number;
    crosspost_parent_list?: {
      selftext: string;
    }[];
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

const limiter = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 1,
  reservoir: 60,
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000,
});

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
];

export const postsCollection = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  try {
    const websites = await fetchWebsitesData(supabase);
    if (websites.length === 0) {
      console.log("No websites configured, skipping posts collection");
      return;
    }

    // GET ALL UNIQUE KEYWORDS FROM ALL WEBSITES
    const uniqueKeywords = getUniqueKeywords(websites);
    if (uniqueKeywords.length === 0) {
      console.log("No keywords found, skipping posts collection");
      return;
    }

    console.log(
      `Processing ${uniqueKeywords.length} keywords from ${websites.length} websites`
    );

    // TRACK OVERALL JOB STATISTICS
    let totalProcessed = 0;

    for (const keyword of uniqueKeywords) {
      try {
        const postsProcessed = await processKeyword(
          supabase,
          keyword,
          websites
        );

        if (postsProcessed) {
          totalProcessed += postsProcessed;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing keyword "${keyword}":`, error);
      }
    }
  } catch (error) {
    console.error("Posts collection job failed:", error);
    throw error;
  }
};

async function fetchWebsitesData(
  supabase: SupabaseClient
): Promise<Partial<Website>[]> {
  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, keywords, name, url")
    .not("keywords", "is", null);

  if (error) {
    console.error("Error fetching websites:", error);
    throw error;
  }

  return websites?.filter((w) => w.keywords && w.keywords.length > 0) || [];
}

function getUniqueKeywords(websites: Partial<Website>[]): string[] {
  // GET ALL UNIQUE KEYWORDS FROM ALL WEBSITES
  const allKeywords = websites.flatMap((w) => w.keywords || []);
  return [...new Set(allKeywords)];
}

async function checkExistingPosts(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<string[]> {
  if (postIds.length === 0) {
    return [];
  }

  const { data: existingPosts, error } = await supabase
    .from("reddit_content_discovered")
    .select("reddit_id")
    .eq("content_type", "post")
    .in("reddit_id", postIds);

  if (error) {
    console.error("Error checking existing posts:", error);
    return []; // PROCEED AS IF NO DUPLICATES TO AVOID BLOCKING NEW POSTS
  }

  return existingPosts?.map(p => p.reddit_id) || [];
}

async function processKeyword(
  supabase: SupabaseClient,
  keyword: string,
  websites: Partial<Website>[]
): Promise<number | null> {
  console.log(`Processing keyword: "${keyword}"...`);

  const posts = await fetchRedditPostsByKeyword(keyword);

  if (!posts || posts.length === 0) {
    console.log(`No posts found for keyword: "${keyword}"`);
    return null;
  }

  console.log(`Found ${posts.length} posts for keyword "${keyword}"`);

  // CHECK FOR EXISTING POSTS TO AVOID DUPLICATES
  const postIds = posts.map(post => post.data.id);
  const existingPosts = await checkExistingPosts(supabase, postIds);
  const newPosts = posts.filter(post => !existingPosts.includes(post.data.id));

  if (newPosts.length === 0) {
    console.log(`All ${posts.length} posts for keyword "${keyword}" already exist in database`);
    return 0;
  }

  console.log(`${newPosts.length}/${posts.length} are new posts for keyword "${keyword}"`);

  if (newPosts.length === 0) {
    console.log(`No new posts found for keyword: "${keyword}"`);
    return 0;
  }

  // APPLY SPAM FILTERING TO NEW POSTS ONLY
  const { validPosts, spamStats } = filterSpamPosts(newPosts);

  // LOG SPAM FILTERING STATISTICS
  logSpamStats(spamStats);

  if (validPosts.length === 0) {
    console.log(
      `No valid posts after spam filtering for keyword: "${keyword}"`
    );
    return 0;
  }

  // GET WEBSITES THAT HAVE THIS KEYWORD
  const websiteIds = websites
    .filter((w) => w.keywords?.includes(keyword))
    .map((w) => w.id)
    .filter((id): id is string => id !== undefined);

  if (websiteIds.length === 0) {
    console.log(`No websites found for keyword: "${keyword}"`);
    return 0;
  }

  // CREATE SEPARATE RECORDS FOR EACH WEBSITE THAT MATCHES THE KEYWORD
  const filteredPosts: FilteredPost[] = [];
  for (const websiteId of websiteIds) {
    for (const post of validPosts) {
      filteredPosts.push({
        post: post,
        websiteId: websiteId,
        matchedKeywords: [keyword],
      });
    }
  }

  // CONVERT TO UNPROCESSED CONTENT FORMAT FOR AI SCORING
  const contentForScoring = filteredPosts.map(({ post, websiteId, matchedKeywords }) => ({
    reddit_id: post.data.id,
    website_id: websiteId,
    content_type: "post" as const,
    subreddit: post.data.subreddit,
    author: post.data.author,
    content: post.data.selftext ||
      (post.data.crosspost_parent_list &&
      post.data.crosspost_parent_list.length > 0
        ? post.data.crosspost_parent_list[0].selftext
        : "").trim(),
    matched_keywords: matchedKeywords,
    reddit_created_at: new Date(post.data.created_utc * 1000).toISOString(),
    reddit_url: `https://www.reddit.com${post.data.permalink}`,
    is_processed: false,
    ups: post.data.ups,
    downs: post.data.downs,
    lead_score: 0,
    title: post.data.title,
  }));

  // SCORE ALL CONTENT WITH AI (NO THRESHOLD FILTERING)
  console.log(`Scoring ${contentForScoring.length} posts with AI for keyword "${keyword}"`);
  const scoredContent = await scoreRedditContent(supabase, contentForScoring, 0);

  console.log(`AI scored ${scoredContent.length} posts for keyword "${keyword}"`);

  // STORE ALL SCORED POSTS REGARDLESS OF SCORE
  await storePreScoredPosts(supabase, scoredContent);

  return scoredContent.length;
}

async function fetchRedditPostsByKeyword(
  keyword: string,
  retries = 3
): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
    `"${keyword}"`
  )}&sort=new&limit=50`;
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  return limiter.schedule(async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": userAgent,
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            DNT: "1",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          method: "GET",
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          if (response.status === 429) {
            console.log(
              `Rate limited for keyword "${keyword}" (attempt ${attempt}/${retries}), waiting...`
            );
            const waitTime = Math.min(60000 * attempt, 300000);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            lastError = new Error(`Rate limited: ${response.status}`);
            continue;
          }

          if (response.status === 403) {
            console.log(`Search for keyword "${keyword}" is forbidden`);
            return [];
          }

          if (response.status === 404) {
            console.log(`Search endpoint not found for keyword "${keyword}"`);
            return [];
          }

          if (response.status >= 500) {
            console.log(
              `Server error for keyword "${keyword}" (attempt ${attempt}/${retries}): ${response.status}`
            );
            const waitTime = 2000 * attempt;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            lastError = new Error(`Server error: ${response.status}`);
            continue;
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: RedditResponse = (await response.json()) as RedditResponse;

        if (!data?.data?.children) {
          console.log(`Invalid response format for keyword "${keyword}"`);
          return [];
        }

        return data.data.children;
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries && (error as any).name !== "AbortError") {
          const waitTime = 1000 * attempt;
          console.log(
            `Error fetching keyword "${keyword}" (attempt ${attempt}/${retries}), retrying in ${waitTime}ms:`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(
      `Failed to fetch posts for keyword "${keyword}" after ${retries} attempts:`,
      lastError
    );
    return [];
  });
}

interface FilteredPost {
  post: RedditPost;
  websiteId: string;
  matchedKeywords: string[];
}

// STORE PRE-SCORED POSTS WITH AI SCORES AND EXPLANATIONS
async function storePreScoredPosts(
  supabase: SupabaseClient,
  scoredContent: any[]
) {
  if (scoredContent.length === 0) {
    return;
  }

  const postsToInsert: Partial<RedditContent>[] = scoredContent.map(
    (content) => ({
      reddit_id: content.reddit_id,
      website_id: content.website_id,
      content_type: content.content_type,
      subreddit: content.subreddit,
      author: content.author,
      title: content.title,
      content: content.content,
      matched_keywords: content.matched_keywords,
      reddit_created_at: content.reddit_created_at,
      reddit_url: content.reddit_url,
      is_processed: content.is_processed,
      ups: content.ups,
      downs: content.downs,
      lead_score: content.lead_score,
      ai_explanation: content.ai_explanation,
    })
  );

  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < postsToInsert.length; i += batchSize) {
    const batch = postsToInsert.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from("reddit_content_discovered")
        .upsert(batch, {
          onConflict: "reddit_id,website_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(
          `Error storing pre-scored batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        errorCount += batch.length;

        for (const post of batch) {
          try {
            const { error: singleError } = await supabase
              .from("reddit_content_discovered")
              .upsert([post], {
                onConflict: "reddit_id,website_id",
                ignoreDuplicates: false,
              });

            if (singleError) {
              console.error(
                `Error storing individual pre-scored post ${post.reddit_id}:`,
                singleError
              );
            } else {
              successCount++;
              errorCount--;
            }
          } catch (individualError) {
            console.error(
              `Failed to store pre-scored post ${post.reddit_id}:`,
              individualError
            );
          }
        }
      } else {
        successCount += batch.length;
      }
    } catch (batchError) {
      console.error(
        `Failed to process pre-scored batch ${Math.floor(i / batchSize) + 1}:`,
        batchError
      );
      errorCount += batch.length;
    }
  }

  console.log(
    `Pre-scored storage completed: ${successCount} posts stored successfully, ${errorCount} failed`
  );

  if (successCount === 0 && errorCount > 0) {
    throw new Error(`Failed to store any pre-scored posts (${errorCount} errors)`);
  }
}

async function storePosts(
  supabase: SupabaseClient,
  filteredPosts: FilteredPost[]
) {
  if (filteredPosts.length === 0) {
    return;
  }

  const postsToInsert: Partial<RedditContent>[] = filteredPosts.map(
    ({ post, websiteId, matchedKeywords }) => ({
      reddit_id: post.data.id,
      website_id: websiteId,
      content_type: "post",
      subreddit: post.data.subreddit,
      author: post.data.author,
      title: post.data.title,
      content:
        post.data.selftext ||
        (post.data.crosspost_parent_list &&
        post.data.crosspost_parent_list.length > 0
          ? post.data.crosspost_parent_list[0].selftext
          : ""
        ).trim(),
      matched_keywords: matchedKeywords,
      reddit_created_at: new Date(post.data.created_utc * 1000).toISOString(),
      reddit_url: `https://www.reddit.com${post.data.permalink}`,
      is_processed: false,
      ups: post.data.ups,
      downs: post.data.downs,
      lead_score: 0,
    })
  );

  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < postsToInsert.length; i += batchSize) {
    const batch = postsToInsert.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from("reddit_content_discovered")
        .upsert(batch, {
          onConflict: "reddit_id,website_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(
          `Error storing batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        errorCount += batch.length;

        for (const post of batch) {
          try {
            const { error: singleError } = await supabase
              .from("reddit_content_discovered")
              .upsert([post], {
                onConflict: "reddit_id,website_id",
                ignoreDuplicates: false,
              });

            if (singleError) {
              console.error(
                `Error storing individual post ${post.reddit_id}:`,
                singleError
              );
            } else {
              successCount++;
              errorCount--;
            }
          } catch (individualError) {
            console.error(
              `Failed to store post ${post.reddit_id}:`,
              individualError
            );
          }
        }
      } else {
        successCount += batch.length;
      }
    } catch (batchError) {
      console.error(
        `Failed to process batch ${Math.floor(i / batchSize) + 1}:`,
        batchError
      );
      errorCount += batch.length;
    }
  }

  console.log(
    `Storage completed: ${successCount} posts stored successfully, ${errorCount} failed`
  );

  if (successCount === 0 && errorCount > 0) {
    throw new Error(`Failed to store any posts (${errorCount} errors)`);
  }
}
