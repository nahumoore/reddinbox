import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import OpenAI from "openai";
import { redditGenerateCommentPrompt } from "../../defs/ai/reddit-generate-comment";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SETUP RATE LIMITER FOR OPENAI CALLS - 200 CONCURRENT REQUESTS
const openaiLimiter = new Bottleneck({
  maxConcurrent: 200,
});

// HELPER FUNCTION TO PROCESS GENERATED COMMENTS
function cleanUpGeneratedComment(content: string): string {
  // REPLACE EM-DASHES WITH COMMA AND SPACE
  let cleaned = content.replace(/—/g, ", ");

  // REPLACE SPACED HYPHENS WITH COMMA AND SPACE
  cleaned = cleaned.replace(/\s+-\s+/g, ", ");

  // CLEAN UP MULTIPLE CONSECUTIVE SPACES BUT PRESERVE NEWLINES
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // CLEAN UP COMMA FOLLOWED BY MULTIPLE SPACES
  cleaned = cleaned.replace(/,\s+/g, ", ");

  // REMOVE LEADING AND TRAILING WHITESPACE
  return cleaned;
}

export const createRedditUserInteractionsJob = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔍 Starting Reddit user interactions job...");

  try {
    // QUERY ACTIVE USERS WITH THEIR WEBSITES AND REDDIT ACCOUNTS
    const { data: activeUsers, error: usersError } = await supabase
      .from("user_info")
      .select(
        `
        auth_user_id,
        name,
        websites!inner (
          id,
          name,
          description,
          keywords,
          subreddit_reddit_ids
        ),
        reddit_accounts!inner (
          name
        )
      `
      )
      .eq("subscription_active", true)
      .eq("websites.is_active", true);

    if (usersError) {
      console.error("❌ Error fetching active users:", usersError);
      throw usersError;
    }

    if (!activeUsers || activeUsers.length === 0) {
      console.log("ℹ️ No active users with websites and Reddit accounts found");
      return { success: true, message: "No active users to process" };
    }

    console.log(`📋 Found ${activeUsers.length} active users to process`);

    let totalCommentsGenerated = 0;
    let totalInteractionsCreated = 0;
    let totalPostsAnalyzed = 0;
    let totalRelevantPosts = 0;
    const errors: string[] = [];

    // PROCESS EACH ACTIVE USER
    for (const user of activeUsers) {
      try {
        const websites = Array.isArray(user.websites)
          ? user.websites
          : [user.websites];
        const redditAccounts = Array.isArray(user.reddit_accounts)
          ? user.reddit_accounts
          : [user.reddit_accounts];

        if (redditAccounts.length === 0) {
          console.log(
            `⏭️ User ${user.auth_user_id} has no Reddit accounts, skipping...`
          );
          continue;
        }

        const redditUsername = redditAccounts[0].name;

        for (const website of websites) {
          if (
            !website.subreddit_reddit_ids ||
            website.subreddit_reddit_ids.length === 0
          ) {
            console.log(
              `⏭️ Website ${website.name} has no target subreddits, skipping...`
            );
            continue;
          }

          console.log(
            `📡 Processing website ${website.name} with ${website.subreddit_reddit_ids.length} target subreddits...`
          );

          // GET SUBREDDIT DATA FOR AI PROMPTS
          const { data: subreddits, error: subredditsError } = await supabase
            .from("reddit_subreddits")
            .select("id, display_name_prefixed, audience_ai_prompt")
            .in("id", website.subreddit_reddit_ids);

          if (subredditsError) {
            console.error(
              `❌ Error fetching subreddits for website ${website.name}:`,
              subredditsError
            );
            errors.push(`Website ${website.name}: ${subredditsError.message}`);
            continue;
          }

          if (!subreddits || subreddits.length === 0) {
            console.log(
              `⏭️ No matching subreddits found for website ${website.name}`
            );
            continue;
          }

          // USE RPC FUNCTION TO FIND RELEVANT REDDIT CONTENT WITH SIMILARITY THRESHOLD 4.5 AND LIMIT 50
          const { data: relevantPosts, error: rpcError } = await supabase.rpc(
            "find_relevant_reddit_content",
            {
              p_website_id: website.id,
              p_acceptance_score: 0.45,
              p_limit: 20,
            }
          );

          if (rpcError) {
            console.error(
              `❌ Error finding relevant content for website ${website.name}:`,
              rpcError
            );
            errors.push(`Website ${website.name}: ${rpcError.message}`);
            continue;
          }

          if (!relevantPosts || relevantPosts.length === 0) {
            console.log(
              `ℹ️ No relevant posts found for website ${website.name}`
            );
            continue;
          }

          console.log(
            `🎯 Found ${relevantPosts.length} relevant posts for website ${website.name} (similarity >= 4.5)`
          );

          // UPDATE GLOBAL TRACKING VARIABLES
          totalPostsAnalyzed += relevantPosts.length;
          totalRelevantPosts += relevantPosts.length;

          // PREPARE COMMENT GENERATION TASKS
          const commentTasks = [];

          for (const post of relevantPosts) {
            // FIND MATCHING SUBREDDIT FOR AI PROMPT
            const subreddit = subreddits.find(
              (s) => s.id === post.subreddit_id
            );
            if (!subreddit || !subreddit.audience_ai_prompt) {
              console.log(
                `⏭️ No audience prompt found for subreddit ${post.subreddit_id}, skipping post ${post.reddit_id}`
              );
              continue;
            }

            // CHECK IF USER ALREADY INTERACTED WITH THIS POST
            const { data: existingInteraction } = await supabase
              .from("reddit_user_interactions")
              .select("id")
              .eq("user_id", user.auth_user_id)
              .eq("original_reddit_post_id", post.reddit_id)
              .single();

            if (existingInteraction) {
              console.log(
                `⏭️ User already interacted with post ${post.reddit_id}, skipping...`
              );
              continue;
            }

            // CREATE COMMENT GENERATION TASK
            const task = openaiLimiter.schedule(async () => {
              try {
                const prompt = redditGenerateCommentPrompt({
                  userName: user.name || redditUsername,
                  userProductName: website.name,
                  userProductDescription: website.description || "",
                  userProductKeywords: website.keywords || [],
                  subredditName: subreddit.display_name_prefixed,
                  subredditAudiencePrompt: subreddit.audience_ai_prompt,
                });

                const response = await openai.chat.completions.create({
                  model: "gpt-5-mini",
                  reasoning_effort: "medium",
                  messages: [
                    {
                      role: "developer",
                      content: prompt,
                    },
                    {
                      role: "user",
                      content: `<post_title>${post.title}</post_title>\n\n<post_content>${post.content}</post_content>`,
                    },
                  ],
                  store: true,
                });

                const generatedComment = response.choices[0]?.message?.content;
                if (!generatedComment) {
                  console.error(
                    `❌ No comment generated for post ${post.reddit_id}`
                  );
                  return null;
                }

                // PROCESS GENERATED COMMENT
                const processedComment =
                  cleanUpGeneratedComment(generatedComment);

                // INSERT INTERACTION INTO DATABASE
                const { error: insertError } = await supabase
                  .from("reddit_user_interactions")
                  .insert({
                    user_id: user.auth_user_id,
                    website_id: website.id,
                    interaction_type: "post_reply",
                    original_reddit_post_id: post.reddit_id,
                    interacted_with_reddit_username: post.author,
                    our_interaction_content: processedComment,
                    our_interaction_reddit_id: null,
                    reddit_content_discovered_id: post.id,
                    status: "new",
                  });

                if (insertError) {
                  console.error(
                    `❌ Error inserting interaction for post ${post.reddit_id}:`,
                    insertError
                  );
                  return null;
                }
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

    // JOB COMPLETION SUMMARY
    const summary = {
      success: true,
      usersProcessed: activeUsers.length,
      totalCommentsGenerated,
      totalInteractionsCreated,
      totalPostsAnalyzed,
      totalRelevantPosts,
      similarityThreshold: 0.45,
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
    if (errors.length > 0) {
      console.log(`   - Errors: ${errors.length}`);
    }

    return summary;
  } catch (error) {
    console.error("❌ Reddit user interactions job failed:", error);
    throw error;
  }
};
