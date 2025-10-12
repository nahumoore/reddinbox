import { supabaseAdmin } from "@/lib/supabase/client";
import { Request, Response } from "express";
import { Resend } from "resend";
import { openaiLimiter } from "../../cron/authority-feedback/create-reddit-user-interactions";
import { newInteractionsEmailTemplate } from "../../defs/email-template/new-interactions";
import { createInteractionRecord } from "../../methods/create-reddit-user-interactions/create-interaction-record";
import { findRelevantPosts } from "../../methods/create-reddit-user-interactions/find-relevant-posts";
import { generateComment } from "../../methods/create-reddit-user-interactions/generate-comment";

export const generateFirstInteractions = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.body;

  const supabase = supabaseAdmin;

  try {
    // FETCH USER DATA WITH WEBSITES AND REDDIT ACCOUNTS
    const { data: userData, error: userError } = await supabase
      .from("user_info")
      .select(
        `
        auth_user_id,
        name,
        email,
        websites:websites!inner(
          id,
          name,
          description,
          keywords,
          authority_feed_options
        ),
        reddit_accounts:reddit_accounts!inner(
          id,
          name
        )
      `
      )
      .eq("auth_user_id", userId)
      .single();

    if (userError || !userData) {
      console.error("❌ Error fetching user data:", userError);
      return res.status(404).json({ error: "User or website not found" });
    }

    const websites = Array.isArray(userData.websites)
      ? userData.websites
      : [userData.websites];
    const redditAccounts = Array.isArray(userData.reddit_accounts)
      ? userData.reddit_accounts
      : [userData.reddit_accounts];

    if (redditAccounts.length === 0) {
      console.log(`⏭️ User ${userId} has no Reddit accounts`);
      return res
        .status(400)
        .json({ error: "User has no connected Reddit accounts" });
    }

    if (websites.length === 0) {
      console.log(`⏭️ Website not found`);
      return res.status(404).json({ error: "Website not found" });
    }

    const redditUsername = redditAccounts[0].name;
    const redditAccountId = redditAccounts[0].id;
    const website = websites[0];

    let totalCommentsGenerated = 0;
    let totalInteractionsCreated = 0;
    let totalPostsAnalyzed = 0;
    const errors: string[] = [];

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
      return res.status(500).json({
        error: "Failed to find relevant posts",
        details: rpcError instanceof Error ? rpcError.message : "Unknown error",
      });
    }

    if (filteredPosts.length === 0) {
      console.log(`ℹ️ No relevant posts found for website ${website.name}`);
      return res.status(200).json({
        success: true,
        message: "No relevant posts found",
        commentsGenerated: 0,
        interactionsCreated: 0,
        postsAnalyzed: 0,
      });
    }

    console.log(
      `🎯 Found ${filteredPosts.length} relevant posts for website ${website.name}`
    );

    totalPostsAnalyzed += filteredPosts.length;

    // PREPARE COMMENT GENERATION TASKS
    const commentTasks = [];

    for (const post of filteredPosts) {
      // CREATE COMMENT GENERATION TASK
      const task = openaiLimiter.schedule(async () => {
        try {
          const processedComment = await generateComment({
            userName: userData.name || redditUsername,
            userProductName: website.name,
            userProductDescription: website.description || "",
            userProductKeywords: website.keywords || [],
            postTitle: post.title,
            postContent: post.content,
          });

          if (!processedComment) {
            console.error(`❌ No comment generated for post ${post.reddit_id}`);
            return null;
          }

          // INSERT INTERACTION INTO DATABASE
          await createInteractionRecord(supabase, {
            userId: userId,
            websiteId: website.id,
            originalRedditParentId: post.reddit_id,
            interactedWithRedditUsername: post.author,
            ourInteractionContent: processedComment,
            redditContentDiscoveredId: post.id,
            redditAccountId: redditAccountId,
            similarityScore: post.similarity_score,
          });

          return { success: true, postId: post.reddit_id };
        } catch (error) {
          console.error(
            `❌ Error generating comment for post ${post.reddit_id}:`,
            error
          );
          errors.push(
            `Post ${post.reddit_id}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
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
      const successfulComments = results.filter((result) => result !== null);

      totalCommentsGenerated += commentTasks.length;
      totalInteractionsCreated += successfulComments.length;

      console.log(
        `✅ Completed ${successfulComments.length}/${commentTasks.length} comment generations for website ${website.name}`
      );
    }

    // RESPONSE SUMMARY
    const summary = {
      success: true,
      commentsGenerated: totalCommentsGenerated,
      interactionsCreated: totalInteractionsCreated,
      postsAnalyzed: totalPostsAnalyzed,
      errors: errors.length > 0 ? errors : null,
    };

    console.log("🏁 First interactions generation completed:");
    console.log(`   - Comments generated: ${summary.commentsGenerated}`);
    console.log(`   - Interactions created: ${summary.interactionsCreated}`);
    console.log(`   - Posts analyzed: ${summary.postsAnalyzed}`);
    if (errors.length > 0) {
      console.log(`   - Errors: ${errors.length}`);
    }

    // SEND EMAIL NOTIFICATION
    if (totalInteractionsCreated > 0 && userData.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const dashboardUrl = `${clientUrl}/dashboard/authority-feed`;

        const emailHtml = newInteractionsEmailTemplate({
          first_name: userData.name || "there",
          interaction_count: totalInteractionsCreated,
          dashboard_url: dashboardUrl,
        });

        await resend.emails.send({
          from: "Reddinbox <notifications@reddinbox.com>",
          to: userData.email,
          subject: `${totalInteractionsCreated} New Interaction${
            totalInteractionsCreated === 1 ? "" : "s"
          } Ready to Review`,
          html: emailHtml,
        });

        console.log(`📧 Email notification sent to ${userData.email}`);
      } catch (emailError) {
        console.error("❌ Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json(summary);
  } catch (error) {
    console.error("❌ First interactions generation failed:", error);
    return res.status(500).json({
      error: "Failed to generate first interactions",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
