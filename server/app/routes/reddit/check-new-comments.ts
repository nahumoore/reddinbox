import { redditGenerateCommentPrompt } from "@/defs/ai/reddit-generate-comment";
import { refreshRedditToken } from "@/helpers/reddit/refresh-access-token";
import { supabaseAdmin } from "@/lib/supabase/client";
import Bottleneck from "bottleneck";
import { Request, Response } from "express";
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

// HELPER FUNCTION TO CLEAN GENERATED COMMENTS
function cleanUpGeneratedComment(content: string): string {
  let cleaned = content.replace(/—/g, ", ");
  cleaned = cleaned.replace(/\s+-\s+/g, ", ");
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  cleaned = cleaned.replace(/,\s+/g, ", ");
  return cleaned.trim();
}

interface InboxMessage {
  kind: string;
  data: {
    id: string;
    subject: string;
    author: string;
    body: string;
    parent_id: string;
    context: string;
    link_title: string;
    subreddit: string;
    new: boolean;
  };
}

interface ContextResponse {
  kind: string;
  data: {
    children: Array<{
      kind: string;
      data: any;
    }>;
  };
}

export const checkNewComments = async (req: Request, res: Response) => {
  const { redditAccountId } = req.body;

  if (!redditAccountId || typeof redditAccountId !== "string") {
    return res.status(400).json({ error: "redditAccountId is required" });
  }

  const supabase = supabaseAdmin;

  try {
    // PHASE 1: FETCH REDDIT ACCOUNT WITH USER AND ACTIVE WEBSITE
    const { data: redditAccount, error: accountError } = await supabase
      .from("reddit_accounts")
      .select(
        `
        id,
        name,
        access_token,
        token_expires_at,
        user_id,
        user_info!inner (
          auth_user_id,
          name,
          websites!inner (
            id,
            name,
            description,
            keywords
          )
        )
      `
      )
      .eq("id", redditAccountId)
      .eq("user_info.websites.is_active", true)
      .single();

    if (accountError || !redditAccount) {
      return res
        .status(404)
        .json({ error: "Reddit account not found or no active website" });
    }

    const userInfo = Array.isArray(redditAccount.user_info)
      ? redditAccount.user_info[0]
      : redditAccount.user_info;

    const activeWebsite = Array.isArray(userInfo.websites)
      ? userInfo.websites[0]
      : userInfo.websites;

    if (!activeWebsite) {
      return res.status(404).json({ error: "No active website found" });
    }

    // CHECK TOKEN EXPIRATION AND REFRESH IF NEEDED
    let accessToken = redditAccount.access_token;
    const tokenExpiresAt = redditAccount.token_expires_at
      ? new Date(redditAccount.token_expires_at)
      : null;

    if (!tokenExpiresAt || tokenExpiresAt <= new Date()) {
      console.log("🔄 Access token expired, refreshing...");
      const refreshResult = await refreshRedditToken(supabase, redditAccountId);

      if (!refreshResult.success || !refreshResult.data) {
        return res.status(401).json({
          error: "Failed to refresh access token",
          details: refreshResult.error,
        });
      }

      accessToken = refreshResult.data.access_token;
    }

    if (!accessToken) {
      return res.status(401).json({ error: "No access token available" });
    }

    // PHASE 2: FETCH INBOX COMMENTS
    console.log("📬 Fetching inbox messages...");
    const inboxResponse = await fetch(
      "https://oauth.reddit.com/message/inbox?limit=25",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `Reddinbox/1.0 (by /u/${redditAccount.name})`,
        },
      }
    );

    if (!inboxResponse.ok) {
      return res.status(inboxResponse.status).json({
        error: "Failed to fetch inbox",
        status: inboxResponse.status,
      });
    }

    const inboxData = (await inboxResponse.json()) as {
      kind: string;
      data: { children: InboxMessage[] };
    };
    const messages: InboxMessage[] = inboxData.data?.children || [];

    // FILTER BY COMMENT REPLY
    const commentReplies = messages.filter(
      (msg) => msg.data.subject === "comment reply"
    );

    console.log(`💬 Found ${commentReplies.length} comment replies`);

    if (commentReplies.length === 0) {
      return res
        .status(200)
        .json({ newInteractionsCount: 0, interactions: [] });
    }

    // PHASE 3: IDENTIFY NEW COMMENTS
    const discoveredRedditIds = commentReplies.map((msg) => `t1_${msg.data.id}`);

    const { data: existingInteractions, error: interactionsError } =
      await supabase
        .from("reddit_user_interactions")
        .select("discovered_reddit_id")
        .eq("user_id", userInfo.auth_user_id)
        .in("discovered_reddit_id", discoveredRedditIds);

    if (interactionsError) {
      console.error(
        "❌ Error fetching existing interactions:",
        interactionsError
      );
      return res.status(500).json({ error: "Database error" });
    }

    const existingDiscoveredIds = new Set(
      existingInteractions?.map((i) => i.discovered_reddit_id) || []
    );

    const newComments = commentReplies.filter(
      (msg) => !existingDiscoveredIds.has(`t1_${msg.data.id}`)
    );

    console.log(`✨ Found ${newComments.length} new comments to process`);

    if (newComments.length === 0) {
      return res
        .status(200)
        .json({ newInteractionsCount: 0, interactions: [] });
    }

    // PHASE 4: FETCH CONTEXT FOR EACH NEW COMMENT WITH RATE LIMITING
    console.log("🔍 Fetching conversation contexts...");

    const contextTasks = newComments.map((comment) =>
      redditLimiter.schedule(async () => {
        try {
          const contextUrl = `https://oauth.reddit.com${comment.data.context}`;
          const contextResponse = await fetch(contextUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `Reddinbox/1.0 (by /u/${redditAccount.name})`,
            },
          });

          if (!contextResponse.ok) {
            console.error(
              `❌ Failed to fetch context for comment ${comment.data.id}`
            );
            return null;
          }

          const contextData =
            (await contextResponse.json()) as ContextResponse[];
          return {
            comment,
            context: contextData,
          };
        } catch (error) {
          console.error(
            `❌ Error fetching context for comment ${comment.data.id}:`,
            error
          );
          return null;
        }
      })
    );

    const contextResults = await Promise.all(contextTasks);
    const validContexts = contextResults.filter((r) => r !== null);

    console.log(`✅ Successfully fetched ${validContexts.length} contexts`);

    // PHASE 5: GENERATE AI REPLIES FOR EACH CONTEXT IN PARALLEL
    console.log("🤖 Generating AI replies...");

    // BUILD CONVERSATION THREAD XML HELPER
    const userFullName = `t2_${redditAccount.id}`;
    const buildThreadXML = (comments: any[], depth = 0): string => {
      let xml = "";
      for (const commentNode of comments) {
        if (commentNode.kind !== "t1") continue;

        const commentData = commentNode.data;
        const isYou = commentData.author_fullname === userFullName;
        const author = isYou ? "you" : commentData.author;

        xml += `    <comment author="${author}" depth="${depth}">\n      ${commentData.body}\n    </comment>\n\n`;

        // RECURSIVELY PROCESS REPLIES
        if (commentData.replies && typeof commentData.replies === "object") {
          const nestedComments = commentData.replies.data?.children || [];
          xml += buildThreadXML(nestedComments, depth + 1);
        }
      }
      return xml;
    };

    // GENERATE ALL AI REPLIES IN PARALLEL
    const aiPromises = validContexts.map(async (item) => {
      const { comment, context } = item;

      // PARSE CONTEXT RESPONSE
      const originalPostListing = context[0];
      const threadListing = context[1];

      if (!originalPostListing || !threadListing) {
        console.error(
          `❌ Invalid context structure for comment ${comment.data.id}`
        );
        return null;
      }

      const originalPost = originalPostListing.data.children[0]?.data;
      if (!originalPost) {
        console.error(
          `❌ No original post found for comment ${comment.data.id}`
        );
        return null;
      }

      const threadComments = threadListing.data.children || [];

      // CHECK IF THE LATEST COMMENT IN THE THREAD IS FROM THE USER
      const latestComment = threadComments[threadComments.length - 1];

      if (latestComment?.kind === "t1" && latestComment.data?.author_fullname === userFullName) {
        console.log(
          `⏭️ Skipping comment ${comment.data.id}: latest comment is from user`
        );
        return null;
      }

      const conversationThreadXML = buildThreadXML(threadComments);

      const conversationContext = `<conversation_context>
  <original_post>
    <title>${originalPost.title || ""}</title>
    <body>${originalPost.selftext || ""}</body>
  </original_post>

  <conversation_thread>
${conversationThreadXML}  </conversation_thread>
</conversation_context>`;

      // GET SUBREDDIT AUDIENCE PROMPT
      const { data: subreddit } = await supabase
        .from("reddit_subreddits")
        .select("audience_ai_prompt, display_name_prefixed")
        .eq("display_name_prefixed", `r/${comment.data.subreddit}`)
        .single();

      const prompt = redditGenerateCommentPrompt({
        userName: userInfo.name,
        userProductName: activeWebsite.name,
        userProductDescription: activeWebsite.description || "",
        userProductKeywords: activeWebsite.keywords || [],
        subreddit: {
          display_name_prefixed:
            subreddit?.display_name_prefixed || `r/${comment.data.subreddit}`,
          audience_ai_prompt: subreddit?.audience_ai_prompt || "",
        },
      });

      // GENERATE REPLY WITH OPENAI
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
            content: conversationContext,
          },
        ],
        store: true,
      });

      const generatedReply = response.choices[0]?.message?.content;
      if (!generatedReply) {
        console.error(`❌ No reply generated for comment ${comment.data.id}`);
        return null;
      }

      const processedReply = cleanUpGeneratedComment(generatedReply);

      return {
        comment,
        originalPost,
        processedReply,
      };
    });

    const aiResults = await Promise.all(aiPromises);
    const validResults = aiResults.filter((r) => r !== null);

    console.log(`✅ Generated ${validResults.length} AI replies`);

    // PHASE 6: BUILD THREAD CONTEXT AND INSERT INTERACTIONS
    const buildThreadContext = (
      originalPost: any,
      threadComments: any[]
    ): any => {
      const buildRepliesTree = (comments: any[]): any[] => {
        return comments.map((commentNode) => {
          if (commentNode.kind !== "t1") return null;

          const commentData = commentNode.data;
          const comment: any = {
            id: commentData.name,
            author: commentData.author,
            content: commentData.body,
            date: new Date(commentData.created_utc * 1000)
              .toISOString()
              .split("T")[0],
            replies: [],
          };

          // RECURSIVELY PROCESS REPLIES
          if (
            commentData.replies &&
            typeof commentData.replies === "object" &&
            commentData.replies.data?.children
          ) {
            const nestedReplies = buildRepliesTree(
              commentData.replies.data.children
            );
            comment.replies = nestedReplies.filter((r) => r !== null);
          }

          return comment;
        });
      };

      const comments = buildRepliesTree(threadComments).filter(
        (c) => c !== null
      );

      return {
        original_post: {
          id: originalPost.name,
          author: originalPost.author,
          title: originalPost.title || "",
          content: originalPost.selftext || "",
        },
        comments,
      };
    };

    const interactionsToInsert = validResults.map((result) => {
      // FETCH CONTEXT DATA FROM AI RESULTS TO BUILD THREAD CONTEXT
      const contextItem = validContexts.find(
        (ctx) => ctx.comment.data.id === result.comment.data.id
      );

      let threadContext = null;
      if (contextItem) {
        const threadListing = contextItem.context[1];
        const threadComments = threadListing?.data?.children || [];
        threadContext = buildThreadContext(result.originalPost, threadComments);
      }

      return {
        user_id: userInfo.auth_user_id,
        website_id: activeWebsite.id,
        interaction_type: "comment_reply",
        original_reddit_parent_id: result.originalPost.name, // t3_xxxxx format
        interacted_with_reddit_username: result.comment.data.author,
        our_interaction_content: result.processedReply,
        our_interaction_reddit_id: null,
        reddit_content_discovered_id: null,
        reddit_account_id: redditAccountId,
        status: "new",
        thread_context: threadContext,
        discovered_reddit_id: `t1_${result.comment.data.id}`, // t1_xxxxx format
      };
    });

    const { data: newInteractions, error: insertError } = await supabase
      .from("reddit_user_interactions")
      .insert(interactionsToInsert)
      .select();

    if (insertError) {
      console.error(`❌ Error inserting interactions:`, insertError);
      return res.status(500).json({ error: "Failed to save interactions" });
    }

    console.log(
      `🎉 Successfully created ${newInteractions?.length || 0} new interactions`
    );

    return res.status(200).json({
      newInteractionsCount: newInteractions?.length || 0,
      interactions: newInteractions || [],
    });
  } catch (error) {
    console.error("❌ Unexpected error in checkNewComments:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ## EXAMPLE OF https://oauth.reddit.com/message/inbox?limit=25
// {
//   "kind": "Listing",
//   "data": {
//     "after": null,
//     "dist": 10,
//     "modhash": null,
//     "geo_filter": "",
//     "children": [
//       {
//         "kind": "t1",
//         "data": {
//           "first_message": null,
//           "first_message_name": null,
//           "subreddit": "SaaS",
//           "likes": null,
//           "replies": "",
//           "author_fullname": "t2_zv6ggrrj4",
//           "id": "nhy70wb",
//           "subject": "comment reply",
//           "associated_awarding_id": null,
//           "score": 1,
//           "author": "lidiiaaooa",
//           "num_comments": 9,
//           "parent_id": "t1_nht1yjk",
//           "subreddit_name_prefixed": "r/SaaS",
//           "new": true,
//           "type": "comment_reply",
//           "body": "this is such a solid breakdown! love how you framed it as \"signal stacking: - that’s exactly the nuance I’ve been trying to describe. scoring accounts by momentum + fast outreach within that 72h window makes total sense.\n\nI’ve been experimenting with something similar lately (combining job changes + funding rounds) but it’s tough to keep the signal set clean over time. totally agree on re-evaluating quarterly. how you decide when a signal stops pulling its weight?",
//           "link_title": "In B2B growth, is timing the most underrated factor?",
//           "dest": "Odd_Current_3121",
//           "was_comment": true,
//           "body_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;this is such a solid breakdown! love how you framed it as &amp;quot;signal stacking: - that’s exactly the nuance I’ve been trying to describe. scoring accounts by momentum + fast outreach within that 72h window makes total sense.&lt;/p&gt;\n\n&lt;p&gt;I’ve been experimenting with something similar lately (combining job changes + funding rounds) but it’s tough to keep the signal set clean over time. totally agree on re-evaluating quarterly. how you decide when a signal stops pulling its weight?&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
//           "name": "t1_nhy70wb",
//           "created": 1759694492.0,
//           "created_utc": 1759694492.0,
//           "context": "/r/SaaS/comments/1nwcf64/in_b2b_growth_is_timing_the_most_underrated_factor/nhy70wb/?context=3",
//           "distinguished": null
//         }
//       },
//       {
//         "kind": "t1",
//         "data": {
//           "first_message": null,
//           "first_message_name": null,
//           "subreddit": "content_marketing",
//           "likes": null,
//           "replies": "",
//           "author_fullname": "t2_1vqfaohhhg",
//           "id": "nhqdg2y",
//           "subject": "comment reply",
//           "associated_awarding_id": null,
//           "score": 1,
//           "author": "Dazzling_Occasion102",
//           "num_comments": 63,
//           "parent_id": "t1_nhl3hu9",
//           "subreddit_name_prefixed": "r/content_marketing",
//           "new": true,
//           "type": "comment_reply",
//           "body": "Thanks. that’s a solid approach , I like the idea of showing clients before/after with notes, makes it super clear that the “human touch” isn’t just a quick polish but actual re-authoring. I’ve been leaning the same way, treat AI text like raw material, but the real value is in shaping it into something that sounds lived-in.",
//           "link_title": "How are you dealing with clients asking for “AI content” but still wanting it to sound human?",
//           "dest": "Odd_Current_3121",
//           "was_comment": true,
//           "body_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;Thanks. that’s a solid approach , I like the idea of showing clients before/after with notes, makes it super clear that the “human touch” isn’t just a quick polish but actual re-authoring. I’ve been leaning the same way, treat AI text like raw material, but the real value is in shaping it into something that sounds lived-in.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
//           "name": "t1_nhqdg2y",
//           "created": 1759591786.0,
//           "created_utc": 1759591786.0,
//           "context": "/r/content_marketing/comments/1nx47q8/how_are_you_dealing_with_clients_asking_for_ai/nhqdg2y/?context=3",
//           "distinguished": null
//         }
//       },
//       {
//         "kind": "t1",
//         "data": {
//           "first_message": null,
//           "first_message_name": null,
//           "subreddit": "content_marketing",
//           "likes": true,
//           "replies": "",
//           "author_fullname": "t2_6zi6jzln",
//           "id": "nhm3f9q",
//           "subject": "comment reply",
//           "associated_awarding_id": null,
//           "score": 3,
//           "author": "cihomessodueore",
//           "num_comments": 63,
//           "parent_id": "t1_nhl3hu9",
//           "subreddit_name_prefixed": "r/content_marketing",
//           "new": false,
//           "type": "comment_reply",
//           "body": "That's actually wonderful advice even outside of a content marketing perspective. Ty!",
//           "link_title": "How are you dealing with clients asking for “AI content” but still wanting it to sound human?",
//           "dest": "Odd_Current_3121",
//           "was_comment": true,
//           "body_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;That&amp;#39;s actually wonderful advice even outside of a content marketing perspective. Ty!&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
//           "name": "t1_nhm3f9q",
//           "created": 1759525265.0,
//           "created_utc": 1759525265.0,
//           "context": "/r/content_marketing/comments/1nx47q8/how_are_you_dealing_with_clients_asking_for_ai/nhm3f9q/?context=3",
//           "distinguished": null
//         }
//       },
//     ],
//     "before": null
//   }
// }

// ## EXAMPLE OF: https://oauth.reddit.com{context}
// [
//   {
//     "kind": "Listing",
//     "data": {
//       "after": null,
//       "dist": 1,
//       "modhash": null,
//       "geo_filter": "",
//       "children": [
//         {
//           "kind": "t3",
//           "data": {
//             "approved_at_utc": null,
//             "subreddit": "SaaS",
//             "selftext": "we often optimize ICPs, messaging, and outreach volume - but I keep seeing that **timing** makes the biggest difference.  \nsignals like:\n\n* funding rounds (new budgets)\n* job changes (new decision-makers)\n* product launches (urgent needs)\n* market shifts/partnerships\n\nindividually, they’re just noise. but when connected, they often point to a *warm window* where outreach is 10x more likely to land.\n\nI’m curious - how do your teams handle this? do you:  \ntrack signals manually?  \nuse tools / alerts?  \nor lean on instinct + relationships?\n\nfeels like the biggest leverage point in B2B growth is spotting the window before it closes.",
//             "user_reports": [],
//             "saved": false,
//             "mod_reason_title": null,
//             "gilded": 0,
//             "clicked": false,
//             "title": "In B2B growth, is timing the most underrated factor?",
//             "link_flair_richtext": [],
//             "subreddit_name_prefixed": "r/SaaS",
//             "hidden": false,
//             "pwls": 6,
//             "link_flair_css_class": null,
//             "downs": 0,
//             "thumbnail_height": null,
//             "top_awarded_type": null,
//             "hide_score": false,
//             "name": "t3_1nwcf64",
//             "quarantine": false,
//             "link_flair_text_color": "dark",
//             "upvote_ratio": 1.0,
//             "author_flair_background_color": null,
//             "subreddit_type": "public",
//             "ups": 6,
//             "total_awards_received": 0,
//             "media_embed": {},
//             "thumbnail_width": null,
//             "author_flair_template_id": null,
//             "is_original_content": false,
//             "author_fullname": "t2_zv6ggrrj4",
//             "secure_media": null,
//             "is_reddit_media_domain": false,
//             "is_meta": false,
//             "category": null,
//             "secure_media_embed": {},
//             "link_flair_text": null,
//             "can_mod_post": false,
//             "score": 6,
//             "approved_by": null,
//             "is_created_from_ads_ui": false,
//             "author_premium": false,
//             "thumbnail": "self",
//             "edited": false,
//             "author_flair_css_class": null,
//             "author_flair_richtext": [],
//             "gildings": {},
//             "content_categories": null,
//             "is_self": true,
//             "mod_note": null,
//             "created": 1759431094.0,
//             "link_flair_type": "text",
//             "wls": 6,
//             "removed_by_category": null,
//             "banned_by": null,
//             "author_flair_type": "text",
//             "domain": "self.SaaS",
//             "allow_live_comments": false,
//             "selftext_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;we often optimize ICPs, messaging, and outreach volume - but I keep seeing that &lt;strong&gt;timing&lt;/strong&gt; makes the biggest difference.&lt;br/&gt;\nsignals like:&lt;/p&gt;\n\n&lt;ul&gt;\n&lt;li&gt;funding rounds (new budgets)&lt;/li&gt;\n&lt;li&gt;job changes (new decision-makers)&lt;/li&gt;\n&lt;li&gt;product launches (urgent needs)&lt;/li&gt;\n&lt;li&gt;market shifts/partnerships&lt;/li&gt;\n&lt;/ul&gt;\n\n&lt;p&gt;individually, they’re just noise. but when connected, they often point to a &lt;em&gt;warm window&lt;/em&gt; where outreach is 10x more likely to land.&lt;/p&gt;\n\n&lt;p&gt;I’m curious - how do your teams handle this? do you:&lt;br/&gt;\ntrack signals manually?&lt;br/&gt;\nuse tools / alerts?&lt;br/&gt;\nor lean on instinct + relationships?&lt;/p&gt;\n\n&lt;p&gt;feels like the biggest leverage point in B2B growth is spotting the window before it closes.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
//             "likes": null,
//             "suggested_sort": null,
//             "banned_at_utc": null,
//             "view_count": null,
//             "archived": false,
//             "no_follow": false,
//             "is_crosspostable": true,
//             "pinned": false,
//             "over_18": false,
//             "all_awardings": [],
//             "awarders": [],
//             "media_only": false,
//             "can_gild": false,
//             "spoiler": false,
//             "locked": false,
//             "author_flair_text": null,
//             "treatment_tags": [],
//             "visited": false,
//             "removed_by": null,
//             "num_reports": null,
//             "distinguished": null,
//             "subreddit_id": "t5_2qkq6",
//             "author_is_blocked": false,
//             "mod_reason_by": null,
//             "removal_reason": null,
//             "link_flair_background_color": "",
//             "id": "1nwcf64",
//             "is_robot_indexable": true,
//             "num_duplicates": 1,
//             "report_reasons": null,
//             "author": "lidiiaaooa",
//             "discussion_type": null,
//             "num_comments": 9,
//             "send_replies": true,
//             "media": null,
//             "contest_mode": false,
//             "author_patreon_flair": false,
//             "author_flair_text_color": null,
//             "permalink": "/r/SaaS/comments/1nwcf64/in_b2b_growth_is_timing_the_most_underrated_factor/",
//             "stickied": false,
//             "url": "https://www.reddit.com/r/SaaS/comments/1nwcf64/in_b2b_growth_is_timing_the_most_underrated_factor/",
//             "subreddit_subscribers": 416480,
//             "created_utc": 1759431094.0,
//             "num_crossposts": 1,
//             "mod_reports": [],
//             "is_video": false
//           }
//         }
//       ],
//       "before": null
//     }
//   },
//   {
//     "kind": "Listing",
//     "data": {
//       "after": null,
//       "dist": null,
//       "modhash": null,
//       "geo_filter": "",
//       "children": [
//         {
//           "kind": "t1",
//           "data": {
//             "subreddit_id": "t5_2qkq6",
//             "approved_at_utc": null,
//             "author_is_blocked": false,
//             "comment_type": null,
//             "awarders": [],
//             "mod_reason_by": null,
//             "banned_by": null,
//             "author_flair_type": "text",
//             "total_awards_received": 0,
//             "subreddit": "SaaS",
//             "author_flair_template_id": null,
//             "likes": true,
//             "replies": {
//               "kind": "Listing",
//               "data": {
//                 "after": null,
//                 "dist": null,
//                 "modhash": null,
//                 "geo_filter": "",
//                 "children": [
//                   {
//                     "kind": "t1",
//                     "data": {
//                       "subreddit_id": "t5_2qkq6",
//                       "approved_at_utc": null,
//                       "author_is_blocked": false,
//                       "comment_type": null,
//                       "awarders": [],
//                       "mod_reason_by": null,
//                       "banned_by": null,
//                       "author_flair_type": "text",
//                       "total_awards_received": 0,
//                       "subreddit": "SaaS",
//                       "author_flair_template_id": null,
//                       "likes": null,
//                       "replies": "",
//                       "user_reports": [],
//                       "saved": false,
//                       "id": "nhy70wb",
//                       "banned_at_utc": null,
//                       "mod_reason_title": null,
//                       "gilded": 0,
//                       "archived": false,
//                       "collapsed_reason_code": null,
//                       "no_follow": true,
//                       "author": "lidiiaaooa",
//                       "can_mod_post": false,
//                       "created_utc": 1759694492.0,
//                       "send_replies": true,
//                       "parent_id": "t1_nht1yjk",
//                       "score": 1,
//                       "author_fullname": "t2_zv6ggrrj4",
//                       "removal_reason": null,
//                       "approved_by": null,
//                       "mod_note": null,
//                       "all_awardings": [],
//                       "body": "this is such a solid breakdown! love how you framed it as \"signal stacking: - that’s exactly the nuance I’ve been trying to describe. scoring accounts by momentum + fast outreach within that 72h window makes total sense.\n\nI’ve been experimenting with something similar lately (combining job changes + funding rounds) but it’s tough to keep the signal set clean over time. totally agree on re-evaluating quarterly. how you decide when a signal stops pulling its weight?",
//                       "edited": false,
//                       "top_awarded_type": null,
//                       "author_flair_css_class": null,
//                       "name": "t1_nhy70wb",
//                       "is_submitter": true,
//                       "downs": 0,
//                       "author_flair_richtext": [],
//                       "author_patreon_flair": false,
//                       "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;this is such a solid breakdown! love how you framed it as &amp;quot;signal stacking: - that’s exactly the nuance I’ve been trying to describe. scoring accounts by momentum + fast outreach within that 72h window makes total sense.&lt;/p&gt;\n\n&lt;p&gt;I’ve been experimenting with something similar lately (combining job changes + funding rounds) but it’s tough to keep the signal set clean over time. totally agree on re-evaluating quarterly. how you decide when a signal stops pulling its weight?&lt;/p&gt;\n&lt;/div&gt;",
//                       "gildings": {},
//                       "collapsed_reason": null,
//                       "distinguished": null,
//                       "associated_award": null,
//                       "stickied": false,
//                       "author_premium": false,
//                       "can_gild": false,
//                       "link_id": "t3_1nwcf64",
//                       "unrepliable_reason": null,
//                       "author_flair_text_color": null,
//                       "score_hidden": false,
//                       "permalink": "/r/SaaS/comments/1nwcf64/in_b2b_growth_is_timing_the_most_underrated_factor/nhy70wb/",
//                       "subreddit_type": "public",
//                       "locked": false,
//                       "report_reasons": null,
//                       "created": 1759694492.0,
//                       "author_flair_text": null,
//                       "treatment_tags": [],
//                       "collapsed": false,
//                       "subreddit_name_prefixed": "r/SaaS",
//                       "controversiality": 0,
//                       "depth": 1,
//                       "author_flair_background_color": null,
//                       "collapsed_because_crowd_control": null,
//                       "mod_reports": [],
//                       "num_reports": null,
//                       "ups": 1
//                     }
//                   }
//                 ],
//                 "before": null
//               }
//             },
//             "user_reports": [],
//             "saved": false,
//             "id": "nht1yjk",
//             "banned_at_utc": null,
//             "mod_reason_title": null,
//             "gilded": 0,
//             "archived": false,
//             "collapsed_reason_code": null,
//             "no_follow": false,
//             "author": "Odd_Current_3121",
//             "can_mod_post": false,
//             "created_utc": 1759621780.0,
//             "send_replies": true,
//             "parent_id": "t3_1nwcf64",
//             "score": 2,
//             "author_fullname": "t2_1yu5nrmfy1",
//             "approved_by": null,
//             "mod_note": null,
//             "all_awardings": [],
//             "collapsed": false,
//             "body": "100% , timing's massively underrated, tbh. We treat it like a signal stacking problem: ingest funding feeds, LinkedIn job changes, product launches and partnerships, score accounts by combined momentum, then push high-score ones into a fast outreach queue within 72 hours\n\nPlaybook that worked for us: pick the top 3 signals for your ICP, automate alerts + scoring, set a threshold for quick human triage, and use a short contextual template that references the trigger instead of a cold pitch. In A/B tests we saw \\~2–3x reply lifts when signals stacked, but it's noisy so keep maintenance light and re-evaluate signals quarterly :)",
//             "edited": false,
//             "top_awarded_type": null,
//             "author_flair_css_class": null,
//             "name": "t1_nht1yjk",
//             "is_submitter": false,
//             "downs": 0,
//             "author_flair_richtext": [],
//             "author_patreon_flair": false,
//             "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;100% , timing&amp;#39;s massively underrated, tbh. We treat it like a signal stacking problem: ingest funding feeds, LinkedIn job changes, product launches and partnerships, score accounts by combined momentum, then push high-score ones into a fast outreach queue within 72 hours&lt;/p&gt;\n\n&lt;p&gt;Playbook that worked for us: pick the top 3 signals for your ICP, automate alerts + scoring, set a threshold for quick human triage, and use a short contextual template that references the trigger instead of a cold pitch. In A/B tests we saw ~2–3x reply lifts when signals stacked, but it&amp;#39;s noisy so keep maintenance light and re-evaluate signals quarterly :)&lt;/p&gt;\n&lt;/div&gt;",
//             "removal_reason": null,
//             "collapsed_reason": null,
//             "distinguished": null,
//             "associated_award": null,
//             "stickied": false,
//             "author_premium": false,
//             "can_gild": false,
//             "gildings": {},
//             "unrepliable_reason": null,
//             "author_flair_text_color": null,
//             "score_hidden": false,
//             "permalink": "/r/SaaS/comments/1nwcf64/in_b2b_growth_is_timing_the_most_underrated_factor/nht1yjk/",
//             "subreddit_type": "public",
//             "locked": false,
//             "report_reasons": null,
//             "created": 1759621780.0,
//             "author_flair_text": null,
//             "treatment_tags": [],
//             "rte_mode": "richtext",
//             "link_id": "t3_1nwcf64",
//             "subreddit_name_prefixed": "r/SaaS",
//             "controversiality": 0,
//             "depth": 0,
//             "author_flair_background_color": null,
//             "collapsed_because_crowd_control": null,
//             "mod_reports": [],
//             "num_reports": null,
//             "ups": 2
//           }
//         }
//       ],
//       "before": null
//     }
//   }
// ]
