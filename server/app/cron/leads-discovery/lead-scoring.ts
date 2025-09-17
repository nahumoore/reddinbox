import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import Fuse from "fuse.js";
import { scoreRedditContent } from "../../helpers/ai-content-scoring";
import { RedditContent, Website } from "../../types/database-schema";

interface RedditComment {
  data: {
    id: string;
    body: string;
    author: string;
    created_utc: number;
    ups: number;
    downs: number;
    replies?: {
      data: {
        children: RedditComment[];
      };
    };
  };
}

interface RedditPostWithComments {
  data: {
    children: [
      {
        data: {
          id: string;
          subreddit: string;
          title: string;
          selftext: string;
        };
      },
      {
        data: {
          children: RedditComment[];
        };
      }
    ];
  };
}

interface PostNeedingComments {
  reddit_id: string;
  subreddit: string;
  website_ids: string[]; // KEEP ARRAY TO TRACK ALL WEBSITES FOR THIS POST
  comments_last_fetched_at: string | null;
  reddit_created_at: string;
}

interface FilteredComment {
  comment: RedditComment;
  post: PostNeedingComments;
  websiteId: string; // SINGLE WEBSITE PER COMMENT RECORD
  matchedKeywords: string[];
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

export const commentsCollection = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  try {
    console.log("Starting comments collection job...");

    // GET POSTS THAT NEED COMMENT UPDATES
    const postsNeedingComments = await fetchPostsNeedingComments(supabase);
    if (postsNeedingComments.length === 0) {
      console.log(
        "No posts need comment updates, skipping comments collection"
      );
      return;
    }

    console.log(`Processing comments for ${postsNeedingComments.length} posts`);

    // GET WEBSITES DATA FOR KEYWORD FILTERING
    const websites = await fetchWebsitesData(supabase);
    if (websites.length === 0) {
      console.log("No websites configured, skipping comments collection");
      return;
    }

    let totalCommentsProcessed = 0;
    let totalCommentsStored = 0;

    for (const post of postsNeedingComments) {
      try {
        const comments = await fetchRedditComments(
          post.subreddit,
          post.reddit_id
        );

        if (comments.length > 0) {
          const filteredComments = filterCommentsByKeywords(
            comments,
            websites,
            post
          );

          if (filteredComments.length > 0) {
            // CONVERT TO UNPROCESSED CONTENT FORMAT FOR AI SCORING
            const contentForScoring = filteredComments.map(
              ({ comment, post, websiteId, matchedKeywords }) => ({
                reddit_id: comment.data.id,
                website_id: websiteId,
                content_type: "comment" as const,
                parent_post_id: post.reddit_id,
                subreddit: post.subreddit,
                author: comment.data.author,
                content: comment.data.body,
                matched_keywords: matchedKeywords,
                reddit_created_at: new Date(
                  comment.data.created_utc * 1000
                ).toISOString(),
                reddit_url: `https://www.reddit.com/r/${post.subreddit}/comments/${post.reddit_id}/_/${comment.data.id}`,
                is_processed: false,
                ups: comment.data.ups,
                downs: comment.data.downs,
                lead_score: 0,
              })
            );

            // SCORE CONTENT WITH AI AND FILTER BY 60+ THRESHOLD
            console.log(
              `Scoring ${contentForScoring.length} comments with AI for post ${post.reddit_id}`
            );
            const scoredContent = await scoreRedditContent(
              supabase,
              contentForScoring,
              60
            );

            if (scoredContent.length > 0) {
              console.log(
                `${scoredContent.length}/${contentForScoring.length} comments passed 60+ score threshold for post ${post.reddit_id}`
              );
              await storePreScoredComments(supabase, scoredContent);
              totalCommentsStored += scoredContent.length;
            } else {
              console.log(
                `No comments passed 60+ score threshold for post ${post.reddit_id}`
              );
            }
          }

          totalCommentsProcessed += comments.length;
        }

        // UPDATE POST TIMESTAMP REGARDLESS OF COMMENTS FOUND
        await updatePostCommentsTimestamp(supabase, post.reddit_id);

        // DELAY BETWEEN POSTS TO RESPECT RATE LIMITS
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(
          `Error processing comments for post ${post.reddit_id}:`,
          error
        );
      }
    }

    console.log(
      `Comments collection completed: ${totalCommentsProcessed} comments processed, ${totalCommentsStored} stored`
    );
  } catch (error) {
    console.error("Comments collection job failed:", error);
    throw error;
  }
};

async function fetchPostsNeedingComments(
  supabase: SupabaseClient
): Promise<PostNeedingComments[]> {
  // GET POSTS THAT NEED COMMENT UPDATES - PRIORITIZE NEWER POSTS
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const oneWeekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // GET ALL POST RECORDS THAT NEED COMMENT UPDATES
  const { data: postRecords, error } = await supabase
    .from("reddit_content_discovered")
    .select(
      "reddit_id, subreddit, website_id, comments_last_fetched_at, reddit_created_at"
    )
    .eq("content_type", "post")
    .or(
      `comments_last_fetched_at.is.null,and(reddit_created_at.gte.${oneWeekAgo},comments_last_fetched_at.lt.${sixHoursAgo})`
    )
    .order("reddit_created_at", { ascending: false })
    .limit(200); // INCREASE LIMIT SINCE WE NOW HAVE DUPLICATES

  if (error) {
    console.error("Error fetching posts needing comments:", error);
    throw error;
  }

  if (!postRecords || postRecords.length === 0) {
    return [];
  }

  // GROUP BY REDDIT_ID TO AVOID DUPLICATE COMMENT EXTRACTION
  const postsMap = new Map<string, PostNeedingComments>();

  for (const record of postRecords) {
    const existingPost = postsMap.get(record.reddit_id);

    if (existingPost) {
      // ADD WEBSITE_ID TO EXISTING POST
      if (
        record.website_id &&
        !existingPost.website_ids.includes(record.website_id)
      ) {
        existingPost.website_ids.push(record.website_id);
      }
    } else {
      // CREATE NEW POST ENTRY
      postsMap.set(record.reddit_id, {
        reddit_id: record.reddit_id,
        subreddit: record.subreddit,
        website_ids: record.website_id ? [record.website_id] : [],
        comments_last_fetched_at: record.comments_last_fetched_at,
        reddit_created_at: record.reddit_created_at,
      });
    }
  }

  const uniquePosts = Array.from(postsMap.values());
  console.log(
    `Found ${uniquePosts.length} unique posts from ${postRecords.length} records`
  );
  console.log(uniquePosts.map((p) => p.reddit_id));

  return uniquePosts;
}

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

async function fetchRedditComments(
  subredditName: string,
  postId: string,
  retries = 3
): Promise<RedditComment[]> {
  const url = `https://www.reddit.com/r/${subredditName}/comments/${postId}.json`;
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
              `Rate limited for r/${subredditName}/comments/${postId} (attempt ${attempt}/${retries}), waiting...`
            );
            const waitTime = Math.min(60000 * attempt, 300000);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            lastError = new Error(`Rate limited: ${response.status}`);
            continue;
          }

          if (response.status === 403) {
            console.log(
              `Post r/${subredditName}/comments/${postId} is private or banned`
            );
            return [];
          }

          if (response.status === 404) {
            console.log(`Post r/${subredditName}/comments/${postId} not found`);
            return [];
          }

          if (response.status >= 500) {
            console.log(
              `Server error for r/${subredditName}/comments/${postId} (attempt ${attempt}/${retries}): ${response.status}`
            );
            const waitTime = 2000 * attempt;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            lastError = new Error(`Server error: ${response.status}`);
            continue;
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: RedditPostWithComments[] =
          (await response.json()) as RedditPostWithComments[];

        if (!data || data.length < 2 || !data[1]?.data?.children) {
          console.log(
            `No comments found for r/${subredditName}/comments/${postId}`
          );
          return [];
        }

        // FLATTEN ALL COMMENTS INCLUDING NESTED REPLIES
        const allComments = flattenComments(
          data[1].data.children as unknown as RedditComment[]
        );
        return allComments;
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries && (error as any).name !== "AbortError") {
          const waitTime = 1000 * attempt;
          console.log(
            `Error fetching r/${subredditName}/comments/${postId} (attempt ${attempt}/${retries}), retrying in ${waitTime}ms:`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(
      `Failed to fetch comments from r/${subredditName}/comments/${postId} after ${retries} attempts:`,
      lastError
    );
    return [];
  });
}

function flattenComments(comments: RedditComment[]): RedditComment[] {
  const flattened: RedditComment[] = [];

  for (const comment of comments) {
    // SKIP DELETED/REMOVED COMMENTS AND "MORE" OBJECTS
    if (
      !comment?.data?.body ||
      comment.data.body === "[deleted]" ||
      comment.data.body === "[removed]" ||
      !comment.data.author ||
      comment.data.author === "[deleted]"
    ) {
      continue;
    }

    flattened.push(comment);

    // RECURSIVELY PROCESS REPLIES
    if (comment.data.replies?.data?.children) {
      const nestedComments = flattenComments(
        comment.data.replies.data.children
      );
      flattened.push(...nestedComments);
    }
  }

  return flattened;
}

function filterCommentsByKeywords(
  comments: RedditComment[],
  websites: Partial<Website>[],
  post: PostNeedingComments
): FilteredComment[] {
  const filteredComments: FilteredComment[] = [];

  for (const comment of comments) {
    const content = comment.data.body;

    for (const website of websites) {
      if (!website.keywords || !website.id) continue;

      // CHECK IF THIS WEBSITE IS MONITORING THIS POST
      const subredditIds = Array.isArray(post.website_ids)
        ? post.website_ids
        : [];
      if (!subredditIds.includes(website.id)) continue;

      const fuse = new Fuse([content], {
        includeScore: true,
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 3,
      });

      const matchedKeywords: string[] = [];

      for (const keyword of website.keywords) {
        const results = fuse.search(keyword);
        if (results.length > 0 && results[0].score! < 0.5) {
          matchedKeywords.push(keyword);
        }
      }

      // CREATE SEPARATE FILTERED COMMENT FOR EACH WEBSITE MATCH
      if (matchedKeywords.length > 0) {
        filteredComments.push({
          comment,
          post,
          websiteId: website.id,
          matchedKeywords,
        });
      }
    }
  }

  return filteredComments;
}

// STORE PRE-SCORED COMMENTS WITH AI SCORES AND EXPLANATIONS
async function storePreScoredComments(
  supabase: SupabaseClient,
  scoredContent: any[]
) {
  if (scoredContent.length === 0) {
    return;
  }

  const commentsToInsert: Partial<RedditContent>[] = scoredContent.map(
    (content) => ({
      reddit_id: content.reddit_id,
      website_id: content.website_id,
      content_type: content.content_type,
      parent_post_id: content.parent_post_id,
      subreddit: content.subreddit,
      author: content.author,
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

  for (let i = 0; i < commentsToInsert.length; i += batchSize) {
    const batch = commentsToInsert.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from("reddit_content_discovered")
        .upsert(batch, {
          onConflict: "reddit_id,website_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(
          `Error storing pre-scored comment batch ${
            Math.floor(i / batchSize) + 1
          }:`,
          error
        );
        errorCount += batch.length;

        // TRY INDIVIDUAL INSERTS FOR FAILED BATCH
        for (const comment of batch) {
          try {
            const { error: singleError } = await supabase
              .from("reddit_content_discovered")
              .upsert([comment], {
                onConflict: "reddit_id,website_id",
                ignoreDuplicates: false,
              });

            if (singleError) {
              console.error(
                `Error storing individual pre-scored comment ${comment.reddit_id}:`,
                singleError
              );
            } else {
              successCount++;
              errorCount--;
            }
          } catch (individualError) {
            console.error(
              `Failed to store pre-scored comment ${comment.reddit_id}:`,
              individualError
            );
          }
        }
      } else {
        successCount += batch.length;
      }
    } catch (batchError) {
      console.error(
        `Failed to process pre-scored comment batch ${
          Math.floor(i / batchSize) + 1
        }:`,
        batchError
      );
      errorCount += batch.length;
    }
  }

  console.log(
    `Pre-scored comment storage completed: ${successCount} comments stored successfully, ${errorCount} failed`
  );

  if (successCount === 0 && errorCount > 0) {
    throw new Error(
      `Failed to store any pre-scored comments (${errorCount} errors)`
    );
  }
}

async function storeComments(
  supabase: SupabaseClient,
  filteredComments: FilteredComment[]
) {
  if (filteredComments.length === 0) {
    return;
  }

  const commentsToInsert: Partial<RedditContent>[] = filteredComments.map(
    ({ comment, post, websiteId, matchedKeywords }) => ({
      reddit_id: comment.data.id,
      website_id: websiteId,
      content_type: "comment",
      parent_post_id: post.reddit_id,
      subreddit: post.subreddit,
      author: comment.data.author,
      content: comment.data.body,
      matched_keywords: matchedKeywords,
      reddit_created_at: new Date(
        comment.data.created_utc * 1000
      ).toISOString(),
      reddit_url: `https://www.reddit.com/r/${post.subreddit}/comments/${post.reddit_id}/_/${comment.data.id}`,
      is_processed: false,
      ups: comment.data.ups,
      downs: comment.data.downs,
      lead_score: 0,
    })
  );

  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < commentsToInsert.length; i += batchSize) {
    const batch = commentsToInsert.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from("reddit_content_discovered")
        .upsert(batch, {
          onConflict: "reddit_id,website_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(
          `Error storing comment batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        errorCount += batch.length;

        // TRY INDIVIDUAL INSERTS FOR FAILED BATCH
        for (const comment of batch) {
          try {
            const { error: singleError } = await supabase
              .from("reddit_content_discovered")
              .upsert([comment], {
                onConflict: "reddit_id,website_id",
                ignoreDuplicates: false,
              });

            if (singleError) {
              console.error(
                `Error storing individual comment ${comment.reddit_id}:`,
                singleError
              );
            } else {
              successCount++;
              errorCount--;
            }
          } catch (individualError) {
            console.error(
              `Failed to store comment ${comment.reddit_id}:`,
              individualError
            );
          }
        }
      } else {
        successCount += batch.length;
      }
    } catch (batchError) {
      console.error(
        `Failed to process comment batch ${Math.floor(i / batchSize) + 1}:`,
        batchError
      );
      errorCount += batch.length;
    }
  }

  console.log(
    `Comment storage completed: ${successCount} comments stored successfully, ${errorCount} failed`
  );

  if (successCount === 0 && errorCount > 0) {
    throw new Error(`Failed to store any comments (${errorCount} errors)`);
  }
}

async function updatePostCommentsTimestamp(
  supabase: SupabaseClient,
  postId: string
) {
  const { error } = await supabase
    .from("reddit_content_discovered")
    .update({ comments_last_fetched_at: new Date().toISOString() })
    .eq("reddit_id", postId)
    .eq("content_type", "post");

  if (error) {
    console.error(`Error updating post ${postId} comments timestamp:`, error);
    throw error;
  }
}
