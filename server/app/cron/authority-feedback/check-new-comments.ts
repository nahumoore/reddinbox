import { fetchCommentContexts } from "@/methods/check-new-comments/fetch-comment-contexts";
import { fetchInboxComments } from "@/methods/check-new-comments/fetch-inbox-comments";
import { fetchRedditAccount } from "@/methods/check-new-comments/fetch-reddit-account";
import { filterNewComments } from "@/methods/check-new-comments/filter-new-comments";
import { generateAIReplies } from "@/methods/check-new-comments/generate-ai-replies";
import { saveInteractions } from "@/methods/check-new-comments/save-interactions";
import { fetchActiveUsers } from "@/methods/create-reddit-user-interactions/fetch-active-users";
import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SETUP RATE LIMITER FOR REDDIT API CALLS - 30 PER MINUTE, 2 SECONDS GAP
const redditLimiter = new Bottleneck({
  minTime: 2000, // 2 seconds between requests
  maxConcurrent: 1,
  reservoir: 30, // 30 requests
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 1000, // per minute
});

export const checkNewComments = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔄 Starting check new comments cron job...");

  try {
    // Fetch all active users with their websites and reddit accounts
    const activeUsers = await fetchActiveUsers(supabase);

    if (!activeUsers || activeUsers.length === 0) {
      console.log("✅ No active users found");
      return { success: true, processedUsers: 0, totalInteractions: 0 };
    }

    console.log(`📊 Found ${activeUsers.length} active users to process`);

    let totalProcessedUsers = 0;
    let totalNewInteractions = 0;

    // Process each user
    for (const user of activeUsers) {
      try {
        console.log(`\n👤 Processing user: ${user.name || user.auth_user_id}`);

        // Normalize user data structure
        const websites = Array.isArray(user.websites)
          ? user.websites
          : [user.websites];
        const redditAccounts = Array.isArray(user.reddit_accounts)
          ? user.reddit_accounts
          : [user.reddit_accounts];

        // Get the active website (first one, since query filters for is_active)
        const activeWebsite = websites[0];

        if (!activeWebsite) {
          console.log(
            `⚠️  No active website found for user ${user.auth_user_id}`
          );
          continue;
        }

        // Process each reddit account
        for (const redditAccountInfo of redditAccounts) {
          if (!redditAccountInfo.is_active) {
            continue;
          }

          try {
            console.log(
              `  📱 Processing Reddit account: ${redditAccountInfo.name}`
            );

            // PHASE 1: FETCH REDDIT ACCOUNT WITH USER AND ACTIVE WEBSITE
            const accountResult = await fetchRedditAccount(
              supabase,
              redditAccountInfo.id
            );

            if (!accountResult.success || !accountResult.data) {
              console.log(
                `  ⚠️  Failed to fetch Reddit account details: ${accountResult.error}`
              );
              continue;
            }

            const {
              redditAccount,
              userInfo,
              activeWebsite: fetchedWebsite,
              accessToken,
            } = accountResult.data;

            // PHASE 2: FETCH INBOX COMMENTS
            const inboxResult = await fetchInboxComments(
              accessToken,
              redditAccount.name
            );

            if (!inboxResult.success || !inboxResult.data) {
              console.log(
                `  ⚠️  Failed to fetch inbox comments: ${inboxResult.error}`
              );
              continue;
            }

            const { commentReplies } = inboxResult.data;

            if (commentReplies.length === 0) {
              console.log(`  ✅ No new comments in inbox`);
              continue;
            }

            console.log(
              `  📬 Found ${commentReplies.length} comments in inbox`
            );

            // PHASE 3: IDENTIFY NEW COMMENTS
            const filterResult = await filterNewComments(
              supabase,
              userInfo.auth_user_id,
              commentReplies
            );

            if (!filterResult.success || !filterResult.data) {
              console.log(
                `  ⚠️  Failed to filter comments: ${filterResult.error}`
              );
              continue;
            }

            const { newComments } = filterResult.data;

            if (newComments.length === 0) {
              console.log(`  ✅ No new comments to process`);
              continue;
            }

            console.log(
              `  🆕 Found ${newComments.length} new comments to process`
            );

            // PHASE 4: FETCH CONTEXT FOR EACH NEW COMMENT WITH RATE LIMITING
            const contextResult = await fetchCommentContexts(
              newComments,
              accessToken,
              redditAccount.name,
              redditLimiter
            );

            if (!contextResult.success || !contextResult.data) {
              console.log(`  ⚠️  Failed to fetch contexts`);
              continue;
            }

            const { validContexts } = contextResult.data;

            if (validContexts.length === 0) {
              console.log(`  ⚠️  No valid contexts found`);
              continue;
            }

            console.log(`  📝 Fetched ${validContexts.length} valid contexts`);

            // PHASE 5: GENERATE AI REPLIES FOR EACH CONTEXT IN PARALLEL
            const userFullName = `t2_${redditAccount.reddit_id}`;
            const aiResult = await generateAIReplies({
              validContexts,
              userFullName,
              userInfo,
              activeWebsite: fetchedWebsite,
              openai,
            });

            if (!aiResult.success || !aiResult.data) {
              console.log(`  ⚠️  Failed to generate AI replies`);
              continue;
            }

            const { validResults } = aiResult.data;

            if (validResults.length === 0) {
              console.log(`  ⚠️  No valid AI results generated`);
              continue;
            }

            console.log(`  🤖 Generated ${validResults.length} AI replies`);

            // PHASE 6: BUILD THREAD CONTEXT AND INSERT INTERACTIONS
            const saveResult = await saveInteractions({
              validResults,
              validContexts,
              userId: userInfo.auth_user_id,
              websiteId: fetchedWebsite.id,
              redditAccountId: redditAccountInfo.id,
              supabase,
            });

            if (!saveResult.success || !saveResult.data) {
              console.log(
                `  ⚠️  Failed to save interactions: ${saveResult.error}`
              );
              continue;
            }

            const { newInteractions } = saveResult.data;

            console.log(
              `  ✅ Saved ${newInteractions.length} new interactions`
            );
            totalNewInteractions += newInteractions.length;
          } catch (accountError) {
            console.error(
              `  ❌ Error processing Reddit account ${redditAccountInfo.name}:`,
              accountError
            );
            continue;
          }
        }

        totalProcessedUsers++;
      } catch (userError) {
        console.error(
          `❌ Error processing user ${user.auth_user_id}:`,
          userError
        );
        continue;
      }
    }

    console.log(
      `\n✅ Cron job completed: Processed ${totalProcessedUsers} users, created ${totalNewInteractions} new interactions`
    );

    return {
      success: true,
      processedUsers: totalProcessedUsers,
      totalInteractions: totalNewInteractions,
    };
  } catch (error) {
    console.error("❌ Unexpected error in checkNewComments cron:", error);
    throw error;
  }
};
