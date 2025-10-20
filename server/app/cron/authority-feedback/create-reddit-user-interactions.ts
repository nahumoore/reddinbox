import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import { checkExistingInteraction } from "../../methods/create-reddit-user-interactions/check-existing-interaction";
import { createInteractionRecord } from "../../methods/create-reddit-user-interactions/create-interaction-record";
import { fetchActiveUsers } from "../../methods/create-reddit-user-interactions/fetch-active-users";
import { findRelevantPosts } from "../../methods/create-reddit-user-interactions/find-relevant-posts";
import { generateComment } from "../../methods/create-reddit-user-interactions/generate-comment";
import { sendReviewReminderEmails } from "../../methods/create-reddit-user-interactions/send-review-reminder-emails";

// MAXIMUM NUMBER OF NEW INTERACTIONS ALLOWED BEFORE REQUIRING USER REVIEW
const MAX_INTERACTIONS = 20;

// SETUP RATE LIMITER FOR OPENAI CALLS - 200 CONCURRENT REQUESTS
export const openaiLimiter = new Bottleneck({
  maxConcurrent: 200,
});

export const createRedditUserInteractionsJob = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔍 Starting Reddit user interactions job...");

  try {
    // QUERY ACTIVE USERS WITH THEIR WEBSITES AND REDDIT ACCOUNTS
    const activeUsers = await fetchActiveUsers(supabase);

    if (activeUsers.length === 0) {
      console.log("ℹ️ No active users found");
      return { success: true, message: "No active users to process" };
    }

    console.log(`📋 Found ${activeUsers.length} active users to process`);

    // FETCH NEW INTERACTION COUNTS FOR ALL USERS IN ONE QUERY
    const userIds = activeUsers.map((u) => u.auth_user_id);
    const { data: interactionCounts } = await supabase
      .from("reddit_user_interactions")
      .select("user_id")
      .in("user_id", userIds)
      .eq("status", "new");

    const newInteractionCountMap = new Map<string, number>();
    if (interactionCounts) {
      for (const interaction of interactionCounts) {
        const currentCount =
          newInteractionCountMap.get(interaction.user_id) || 0;
        newInteractionCountMap.set(interaction.user_id, currentCount + 1);
      }
    }

    let totalCommentsGenerated = 0;
    let totalInteractionsCreated = 0;
    let totalPostsAnalyzed = 0;
    let totalRelevantPosts = 0;
    const errors: string[] = [];

    // PROCESS EACH ACTIVE USER
    for (const user of activeUsers) {
      try {
        // CHECK IF USER ALREADY HAS MAX_INTERACTIONS+ NEW INTERACTIONS
        const newCount = newInteractionCountMap.get(user.auth_user_id) || 0;
        if (newCount >= MAX_INTERACTIONS) {
          console.log(
            `⏭️ User ${user.auth_user_id} already has ${newCount} new interactions, skipping...`
          );
          continue;
        }

        const websites = Array.isArray(user.websites)
          ? user.websites
          : [user.websites];

        // EXTRACT REDDIT ACCOUNT INFO (OPTIONAL)
        let redditUsername: string | null = null;
        let redditAccountId: string | null = null;

        if (user.reddit_accounts) {
          const redditAccounts = Array.isArray(user.reddit_accounts)
            ? user.reddit_accounts
            : [user.reddit_accounts];

          if (redditAccounts.length > 0) {
            redditUsername = redditAccounts[0].name;
            redditAccountId = redditAccounts[0].id;
          }
        }

        for (const website of websites) {
          // EXTRACT AUTHORITY FEED OPTIONS
          const authorityFeedOptions = website.authority_feed_options as {
            posts_per_hour?: number;
            post_categories_active?: string[];
          } | null;

          const postsPerHour = authorityFeedOptions?.posts_per_hour || 20;
          const postCategoriesActive =
            authorityFeedOptions?.post_categories_active || [];

          console.log(
            `⚙️ Authority feed settings: ${postsPerHour} posts/hour, ${postCategoriesActive.length} active categories`
          );

          // FIND RELEVANT REDDIT POSTS (WITH FILTERING BY CATEGORY)
          let filteredPosts;
          try {
            filteredPosts = await findRelevantPosts(
              supabase,
              website.id,
              postsPerHour,
              postCategoriesActive
            );
          } catch (rpcError) {
            console.error(
              `❌ Error finding relevant content for website ${website.name}:`,
              rpcError
            );
            errors.push(
              `Website ${website.name}: ${
                rpcError instanceof Error ? rpcError.message : "Unknown error"
              }`
            );
            continue;
          }

          if (filteredPosts.length === 0) {
            console.log(
              `ℹ️ No relevant posts found for website ${website.name}`
            );
            continue;
          }

          console.log(
            `🎯 Found ${filteredPosts.length} relevant posts for website ${website.name}`
          );

          // UPDATE GLOBAL TRACKING VARIABLES
          totalPostsAnalyzed += filteredPosts.length;
          totalRelevantPosts += filteredPosts.length;

          // PREPARE COMMENT GENERATION TASKS
          const commentTasks = [];

          for (const post of filteredPosts) {
            // CHECK IF USER ALREADY INTERACTED WITH THIS POST
            const alreadyInteracted = await checkExistingInteraction(
              supabase,
              user.auth_user_id,
              post.reddit_id
            );

            if (alreadyInteracted) {
              console.log(
                `⏭️ User already interacted with post ${post.reddit_id}, skipping...`
              );
              continue;
            }

            // CREATE COMMENT GENERATION TASK
            const task = openaiLimiter.schedule(async () => {
              try {
                const processedComment = await generateComment({
                  userName: user.name || redditUsername || "Anonymous",
                  userProductName: website.name,
                  userProductDescription: website.description || "",
                  userProductKeywords: website.keywords || [],
                  postTitle: post.title,
                  postContent: post.content,
                });

                if (!processedComment) {
                  console.error(
                    `❌ No comment generated for post ${post.reddit_id}`
                  );
                  return null;
                }

                // INSERT INTERACTION INTO DATABASE
                await createInteractionRecord(supabase, {
                  userId: user.auth_user_id,
                  websiteId: website.id,
                  originalRedditParentId: post.reddit_id,
                  interactedWithRedditUsername: post.author,
                  ourInteractionContent: processedComment,
                  redditContentDiscoveredId: post.id,
                  redditAccountId: redditAccountId || undefined,
                  similarityScore: post.similarity_score,
                });

                return { success: true, postId: post.reddit_id };
              } catch (error) {
                console.error(
                  `❌ Error generating comment for post ${post.reddit_id}:`,
                  error
                );
                return null;
              }
            });

            commentTasks.push(task);
          }

          // EXECUTE ALL COMMENT GENERATION TASKS
          if (commentTasks.length > 0) {
            console.log(
              `🔄 Executing ${commentTasks.length} comment generation tasks for website ${website.name}...`
            );

            const results = await Promise.all(commentTasks);
            const successfulComments = results.filter(
              (result) => result !== null
            );

            totalCommentsGenerated += commentTasks.length;
            totalInteractionsCreated += successfulComments.length;

            console.log(
              `✅ Completed ${successfulComments.length}/${commentTasks.length} comment generations for website ${website.name}`
            );
          }
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.auth_user_id}:`, error);
        errors.push(
          `User ${user.auth_user_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // SEND REVIEW REMINDER EMAILS TO USERS WHO REACHED MAX_INTERACTIONS
    const emailsSent = await sendReviewReminderEmails(
      supabase,
      activeUsers,
      newInteractionCountMap,
      MAX_INTERACTIONS
    );

    // JOB COMPLETION SUMMARY
    const summary = {
      success: true,
      usersProcessed: activeUsers.length,
      totalCommentsGenerated,
      totalInteractionsCreated,
      totalPostsAnalyzed,
      totalRelevantPosts,
      similarityThreshold: 0.45,
      emailsSent,
      errors: errors.length > 0 ? errors : null,
    };

    console.log("🏁 Reddit user interactions job completed:");
    console.log(`   - Users processed: ${summary.usersProcessed}`);
    console.log(`   - Comments generated: ${summary.totalCommentsGenerated}`);
    console.log(
      `   - Interactions created: ${summary.totalInteractionsCreated}`
    );
    console.log(`   - Posts analyzed: ${summary.totalPostsAnalyzed}`);
    console.log(`   - Relevant posts found: ${summary.totalRelevantPosts}`);
    console.log(`   - Similarity threshold: ${summary.similarityThreshold}`);
    console.log(`   - Review reminder emails sent: ${summary.emailsSent}`);
    if (errors.length > 0) {
      console.log(`   - Errors: ${errors.length}`);
    }

    return summary;
  } catch (error) {
    console.error("❌ Reddit user interactions job failed:", error);
    throw error;
  }
};
