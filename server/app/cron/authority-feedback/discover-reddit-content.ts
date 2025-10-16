import {
  ClassificationInput,
  classifyRedditPosts,
} from "@/methods/discover-reddit-posts/classify-reddit-post";
import { fetchAllSubredditPosts } from "@/methods/discover-reddit-posts/fetch-all-subreddit-posts";
import {
  filterSpamPosts,
  SpamFilterInput,
} from "@/methods/discover-reddit-posts/filter-reddit-spam";
import { generateEmbeddingsForPosts } from "@/methods/discover-reddit-posts/reddit-post-embedding";
import { SupabaseClient } from "@supabase/supabase-js";
import { createRedditUserInteractionsJob } from "./create-reddit-user-interactions";

interface ProcessedPost {
  reddit_id: string;
  title: string | null;
  content: string;
  author: string;
  reddit_created_at: string;
  reddit_url: string;
  ups: number;
  downs: number;
  subreddit_id: string;
  subreddit_name: string;
  is_self: boolean;
  content_category?: string;
  summarized_content?: string;
  embedded_content?: number[] | null;
}

export const discoverRedditContentJob = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔍 Starting Reddit content discovery job...");

  try {
    // QUERY ACTIVE SUBREDDITS FROM DATABASE
    const { data: subreddits, error: subredditsError } = await supabase
      .from("reddit_subreddits")
      .select("id, display_name_prefixed")
      .eq("is_active", true);

    if (subredditsError) {
      console.error("❌ Error fetching subreddits:", subredditsError);
      throw subredditsError;
    }

    if (!subreddits || subreddits.length === 0) {
      console.log("ℹ️ No active subreddits found");
      return { success: true, message: "No active subreddits to process" };
    }

    console.log(`📋 Found ${subreddits.length} active subreddits to process`);

    // BATCH FETCH ALL SUBREDDIT POSTS IN PARALLEL
    const { allFetchedPosts, totalPostsDiscovered, fetchErrors } =
      await fetchAllSubredditPosts(subreddits);

    let totalPostsInserted = 0;
    let totalSpamFiltered = 0;
    let totalEmbeddingsGenerated = 0;
    let totalEmbeddingsFailed = 0;
    const errors: string[] = [...fetchErrors];

    // COLLECT ALL POSTS FROM ALL SUBREDDITS FOR STREAMLINED BATCH PROCESSING
    const allPostsToProcess: ProcessedPost[] = [];

    // PREPARE ALL POSTS FOR PROCESSING
    for (const fetchedData of allFetchedPosts) {
      if (fetchedData.posts.length === 0) {
        continue;
      }

      for (const post of fetchedData.posts) {
        const postData = post.data;

        // MAP REDDIT API RESPONSE TO DATABASE SCHEMA
        allPostsToProcess.push({
          reddit_id: `t3_${postData.id}`,
          title: postData.title || null,
          content: postData.selftext || "",
          author: postData.author,
          reddit_created_at: new Date(
            postData.created_utc * 1000
          ).toISOString(),
          reddit_url: `https://www.reddit.com${postData.permalink}`,
          ups: postData.ups || 0,
          downs: postData.downs || 0,
          subreddit_id: fetchedData.subredditId,
          subreddit_name: fetchedData.subredditName,
          is_self: postData.is_self,
        });
      }
    }

    console.log(
      `📁 Collected ${allPostsToProcess.length} posts from all subreddits for processing`
    );
    if (fetchErrors.length > 0) {
      console.error("❌ Errors encountered while fetching subreddit posts");
      fetchErrors.forEach((error) => console.error(`   - ${error}`));
    }

    if (allPostsToProcess.length === 0) {
      console.log("ℹ️ No posts to process");

      return {
        success: true,
        subredditsProcessed: subreddits.length,
        totalPostsDiscovered,
        totalPostsInserted: 0,
        totalSpamFiltered: 0,
        totalEmbeddingsGenerated: 0,
        totalEmbeddingsFailed: 0,
        errors: fetchErrors.length > 0 ? fetchErrors : null,
        message: "No posts to process",
      };
    }

    // BATCH CHECK FOR EXISTING POSTS TO PREVENT DUPLICATES
    const allRedditIds = allPostsToProcess.map((post) => post.reddit_id);
    console.log(
      `🔎 Checking ${allRedditIds.length} posts for existing entries...`
    );

    const { data: existingPosts, error: existingPostsError } = await supabase
      .from("reddit_content_discovered")
      .select("reddit_id")
      .in("reddit_id", allRedditIds);

    if (existingPostsError) {
      console.error("❌ Error checking existing posts:", existingPostsError);
      errors.push(`Existing posts check: ${existingPostsError.message}`);
    }

    // CREATE SET OF EXISTING POST IDS FOR FAST LOOKUP
    const existingPostIds = new Set(
      existingPosts ? existingPosts.map((p) => p.reddit_id) : []
    );

    // FILTER OUT EXISTING POSTS
    const newPosts = allPostsToProcess.filter(
      (post) => !existingPostIds.has(post.reddit_id)
    );
    console.log(
      `🆕 Filtered out ${
        allPostsToProcess.length - newPosts.length
      } existing posts, ${newPosts.length} new posts to process`
    );

    // APPLY PRE-FILTER TO ALL NEW POSTS BEFORE AI SPAM FILTERING
    const preFilteredPosts = [];
    let emptyContentCount = 0;
    let nonSelfPostCount = 0;

    for (const post of newPosts) {
      // CHECK IF POST CONTENT IS EMPTY
      if (!post.content || post.content.trim() === "") {
        emptyContentCount++;
        continue;
      }

      // CHECK IF POST IS SELF POST
      if (!post.is_self) {
        nonSelfPostCount++;
        continue;
      }

      preFilteredPosts.push(post);
    }

    console.log(
      `🔍 Pre-filter results: ${preFilteredPosts.length}/${newPosts.length} posts passed`
    );
    if (emptyContentCount > 0) {
      console.log(
        `   - Filtered out ${emptyContentCount} posts with empty content`
      );
    }
    if (nonSelfPostCount > 0) {
      console.log(`   - Filtered out ${nonSelfPostCount} non-self posts`);
    }

    let approvedPosts = preFilteredPosts;
    if (preFilteredPosts.length > 0) {
      // PREPARE ALL POSTS FOR AI SPAM FILTERING
      const postsForFiltering: SpamFilterInput[] = preFilteredPosts.map(
        (post) => ({
          id: post.reddit_id,
          title: post.title || "",
          content: post.content,
        })
      );

      // RUN AI SPAM FILTER ON ALL PRE-FILTERED POSTS
      console.log(
        `🤖 Running AI spam filter on ${postsForFiltering.length} posts...`
      );
      const spamResults = await filterSpamPosts(postsForFiltering);

      // FILTER OUT SPAM POSTS FROM PRE-FILTERED POSTS
      const approvedPostIds = new Set(
        spamResults
          .filter((result) => result.approved)
          .map((result) => result.id)
      );

      approvedPosts = preFilteredPosts.filter((post) =>
        approvedPostIds.has(post.reddit_id)
      );

      const totalFilteredCount = newPosts.length - approvedPosts.length;
      const aiSpamCount = preFilteredPosts.length - approvedPosts.length;
      totalSpamFiltered = totalFilteredCount;

      if (totalFilteredCount > 0) {
        console.log(`🛡️ Total filtered posts: ${totalFilteredCount}`);
        if (aiSpamCount > 0) {
          console.log(`   - AI spam filter removed: ${aiSpamCount} posts`);
        }
      }
    }

    // CLASSIFY ALL APPROVED POSTS INTO CATEGORIES
    if (approvedPosts.length > 0) {
      try {
        console.log(
          `🏷️ Starting post classification for ${approvedPosts.length} approved posts...`
        );

        // PREPARE POSTS FOR CLASSIFICATION
        const postsForClassification: ClassificationInput[] = approvedPosts.map(
          (post) => ({
            id: post.reddit_id,
            title: post.title || "",
            content: post.content,
          })
        );

        // RUN AI CLASSIFICATION ON ALL APPROVED POSTS
        const classificationResults = await classifyRedditPosts(
          postsForClassification
        );

        // CREATE MAP OF POST ID TO CATEGORY AND SUMMARY FOR FAST LOOKUP
        const categoryMap = new Map(
          classificationResults.map((result) => [result.id, result.category])
        );
        const summaryMap = new Map(
          classificationResults.map((result) => [result.id, result.summary])
        );

        // ASSIGN CATEGORIES AND SUMMARIES TO APPROVED POSTS
        approvedPosts = approvedPosts.map((post) => ({
          ...post,
          content_category: categoryMap.get(post.reddit_id) || "other",
          summarized_content: summaryMap.get(post.reddit_id) || "",
        }));

        console.log(
          `✅ Successfully classified ${classificationResults.length} posts`
        );
      } catch (error) {
        console.error(`❌ Error classifying posts:`, error);
        // CONTINUE WITHOUT CATEGORIES AND SUMMARIES IF CLASSIFICATION FAILS
        approvedPosts = approvedPosts.map((post) => ({
          ...post,
          content_category: "other",
          summarized_content: "",
        }));
      }
    }

    // GENERATE EMBEDDINGS FOR ALL APPROVED POSTS
    let postsWithEmbeddings = approvedPosts;
    if (approvedPosts.length > 0) {
      try {
        console.log(
          `📊 Starting embedding generation for ${approvedPosts.length} approved posts...`
        );
        const embeddingResult = await generateEmbeddingsForPosts(approvedPosts);
        postsWithEmbeddings = embeddingResult.postsWithEmbeddings;
        totalEmbeddingsGenerated = embeddingResult.successCount;
        totalEmbeddingsFailed = embeddingResult.failureCount;
      } catch (error) {
        console.error(`❌ Error generating embeddings:`, error);
        // CONTINUE WITH POSTS WITHOUT EMBEDDINGS IF EMBEDDING GENERATION FAILS
        postsWithEmbeddings = approvedPosts.map((post) => ({
          ...post,
          embedded_content: null,
        }));
        totalEmbeddingsFailed = approvedPosts.length;
      }
    }

    // BATCH INSERT ALL APPROVED POSTS WITH EMBEDDINGS INTO DATABASE
    if (postsWithEmbeddings.length > 0) {
      console.log(
        `💾 Batch inserting ${postsWithEmbeddings.length} posts into database...`
      );

      // TRANSFORM POSTS TO DATABASE SCHEMA (REMOVE HELPER FIELDS)
      const postsForInsertion = postsWithEmbeddings.map((post) => {
        const { subreddit_name, is_self, ...postForDb } = post;
        return postForDb;
      });

      const { error: insertError } = await supabase
        .from("reddit_content_discovered")
        .insert(postsForInsertion);

      if (insertError) {
        console.error(`❌ Error batch inserting posts:`, insertError);
        errors.push(`Batch insert error: ${insertError.message}`);
      } else {
        console.log(
          `✅ Successfully batch inserted ${postsWithEmbeddings.length} new posts`
        );
        totalPostsInserted = postsWithEmbeddings.length;
      }
    } else {
      console.log(`ℹ️ No new posts to insert`);
    }

    // JOB COMPLETION SUMMARY WITH ENHANCED ERROR REPORTING
    const summary = {
      success: true,
      subredditsProcessed: subreddits.length,
      totalPostsDiscovered,
      totalPostsInserted,
      totalSpamFiltered,
      totalEmbeddingsGenerated,
      totalEmbeddingsFailed,
      errors: errors.length > 0 ? errors : null,
      performance: {
        processingEfficiency:
          totalPostsInserted > 0
            ? ((totalPostsInserted / totalPostsDiscovered) * 100).toFixed(1) +
              "%"
            : "0%",
      },
    };

    console.log("🏁 Optimized Reddit content discovery job completed:");
    console.log(`   - Subreddits processed: ${summary.subredditsProcessed}`);
    console.log(`   - Posts discovered: ${summary.totalPostsDiscovered}`);
    console.log(`   - Spam posts filtered: ${summary.totalSpamFiltered}`);
    console.log(`   - Posts inserted: ${summary.totalPostsInserted}`);
    console.log(
      `   - Processing efficiency: ${summary.performance.processingEfficiency}`
    );
    console.log(
      `   - Embeddings generated: ${summary.totalEmbeddingsGenerated}`
    );
    if (totalEmbeddingsFailed > 0) {
      console.log(`   - Embedding failures: ${summary.totalEmbeddingsFailed}`);
    }
    if (errors.length > 0) {
      console.log(`   - Errors encountered: ${errors.length}`);
      errors.forEach((error) => console.log(`     • ${error}`));
    }

    console.log(
      `🚀 Optimization benefits: Parallel processing, batch operations, eliminated N+1 queries`
    );

    // CREATE REDDIT USER INTERACTIONS
    await createRedditUserInteractionsJob({ supabase });

    return summary;
  } catch (error) {
    console.error("❌ Optimized Reddit content discovery job failed:", error);

    // ENHANCED ERROR HANDLING WITH DETAILED REPORTING
    const errorSummary = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      jobType: "reddit-content-discovery",
      version: "optimized",
    };

    console.error("📊 Error details:", JSON.stringify(errorSummary, null, 2));
    throw error;
  }
};
