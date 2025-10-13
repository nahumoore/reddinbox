import { redditGenerateThreadCommentPrompt } from "@/defs/ai/reddit-generate-thread-comment";
import { cleanUpGeneratedComment } from "@/helpers/ai/clean-up-generated-comments";
import OpenAI from "openai";
import { buildThreadContext } from "./build-thread-context";
import { CommentWithContext } from "./fetch-comment-contexts";
import { InboxMessage } from "./fetch-inbox-comments";

export interface AIReplyResult {
  comment: InboxMessage;
  originalPost: any;
  processedReply: string;
}

interface GenerateAIRepliesInput {
  validContexts: CommentWithContext[];
  userFullName: string;
  userInfo: {
    name: string;
  };
  activeWebsite: {
    name: string;
    description: string | null;
    keywords: string[] | null;
  };
  openai: OpenAI;
}

interface GenerateAIRepliesResult {
  success: boolean;
  data?: {
    validResults: AIReplyResult[];
  };
}

export async function generateAIReplies({
  validContexts,
  userFullName,
  userInfo,
  activeWebsite,
  openai,
}: GenerateAIRepliesInput): Promise<GenerateAIRepliesResult> {
  console.log("🤖 Generating AI replies...");

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
      console.error(`❌ No original post found for comment ${comment.data.id}`);
      return null;
    }

    const threadComments = threadListing.data.children || [];

    // HELPER FUNCTION TO FIND THE LATEST COMMENT IN THE ENTIRE THREAD (RECURSIVE)
    const findLatestComment = (comments: any[]): any => {
      let latestComment = null;
      let latestTimestamp = 0;

      for (const comment of comments) {
        if (comment.kind !== "t1") continue;

        // CHECK CURRENT COMMENT TIMESTAMP
        const commentTimestamp = comment.data?.created_utc || 0;
        if (commentTimestamp > latestTimestamp) {
          latestTimestamp = commentTimestamp;
          latestComment = comment;
        }

        // RECURSIVELY CHECK REPLIES
        const replies = comment.data?.replies?.data?.children || [];
        if (replies.length > 0) {
          const latestReply = findLatestComment(replies);
          if (
            latestReply &&
            (latestReply.data?.created_utc || 0) > latestTimestamp
          ) {
            latestTimestamp = latestReply.data?.created_utc || 0;
            latestComment = latestReply;
          }
        }
      }

      return latestComment;
    };

    // GET THE LATEST COMMENT IN THE ENTIRE THREAD
    const latestComment = findLatestComment(threadComments);

    // SKIP IF NO VALID COMMENTS FOUND
    if (!latestComment) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: no valid comments in thread`
      );
      return null;
    }

    // SKIP IF LATEST COMMENT IS FROM THE USER THEMSELVES
    if (latestComment.data?.author_fullname === userFullName) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from user`
      );
      return null;
    }

    // SKIP IF LATEST COMMENT IS FROM AUTOMODERATOR
    if (latestComment.data?.author_fullname === "t2_6l4z3") {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from AutoModerator`
      );
      return null;
    }

    const conversationContext = buildThreadContext(
      originalPost,
      threadComments
    );

    const prompt = redditGenerateThreadCommentPrompt({
      userName: userInfo.name,
      userProductName: activeWebsite.name,
      userProductDescription: activeWebsite.description || "",
      userProductKeywords: activeWebsite.keywords || [],
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
          content: JSON.stringify(conversationContext),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "thread_comment_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              shouldRespond: {
                type: "boolean",
                description: "Whether this comment is worth responding to.",
              },
              reasoning: {
                type: "string",
                description: "Brief explanation of why/why not to respond.",
              },
              reply: {
                type: "string",
                description:
                  "The actual comment text (empty string if shouldRespond is false).",
              },
            },
            required: ["shouldRespond", "reasoning", "reply"],
            additionalProperties: false,
          },
        },
      },
      store: true,
    });

    const generatedReply = response.choices[0]?.message?.content;
    if (!generatedReply) {
      console.error(`❌ No reply generated for comment ${comment.data.id}`);
      return null;
    }

    // PARSE JSON RESPONSE
    let parsedResponse: {
      shouldRespond: boolean;
      reasoning: string;
      reply: string;
    };
    try {
      parsedResponse = JSON.parse(generatedReply);
    } catch (error) {
      console.error(
        `❌ Failed to parse JSON response for comment ${comment.data.id}:`,
        error
      );
      return null;
    }

    // SKIP IF AI DETERMINED NOT WORTH RESPONDING
    if (!parsedResponse.shouldRespond) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: ${parsedResponse.reasoning}`
      );
      return null;
    }

    const processedReply = cleanUpGeneratedComment(parsedResponse.reply);

    return {
      comment,
      originalPost,
      processedReply,
    };
  });

  const aiResults = await Promise.all(aiPromises);
  const validResults = aiResults.filter((r): r is AIReplyResult => r !== null);

  console.log(`✅ Generated ${validResults.length} AI replies`);

  return {
    success: true,
    data: {
      validResults,
    },
  };
}

// EXAMPLE OF THREAD
// [
//   {
//       "kind": "Listing",
//       "data": {
//           "after": null,
//           "dist": 1,
//           "modhash": null,
//           "geo_filter": "",
//           "children": [
//               {
//                   "kind": "t3",
//                   "data": {
//                       "approved_at_utc": null,
//                       "subreddit": "SaaS",
//                       "selftext": "My B2B SaaS is getting organic growth from referrals and LinkedIn. I'm not new to the tools. I know my way around building lists and setting up sequences.\n\nBut I'm at a point where I need to prioritize my time. **Is actively building an email marketing channel truly worth the effort?**\n\nI'm not looking for \"how-to,\" I'm looking for \"why-should-I.\"\n\n**If you've done it:**\n\n* What kind of results did you actually see? (Open rates, conversion lifts, reduced churn? **Stats would be incredibly helpful!**)\n* Did it effectively complement your organic channels?\n* What specific type of campaign delivered the biggest ROI for you?\n\nAny real-world data or experiences would be awesome. Thanks in advance!",
//                       "user_reports": [],
//                       "saved": false,
//                       "mod_reason_title": null,
//                       "gilded": 0,
//                       "clicked": false,
//                       "title": "Scaling my SaaS: Is email marketing worth the effort after organic traction?",
//                       "link_flair_richtext": [],
//                       "subreddit_name_prefixed": "r/SaaS",
//                       "hidden": false,
//                       "pwls": 6,
//                       "link_flair_css_class": "",
//                       "downs": 0,
//                       "thumbnail_height": null,
//                       "top_awarded_type": null,
//                       "hide_score": false,
//                       "name": "t3_1o5fy7y",
//                       "quarantine": false,
//                       "link_flair_text_color": "dark",
//                       "upvote_ratio": 1.0,
//                       "author_flair_background_color": null,
//                       "subreddit_type": "public",
//                       "ups": 2,
//                       "total_awards_received": 0,
//                       "media_embed": {},
//                       "thumbnail_width": null,
//                       "author_flair_template_id": null,
//                       "is_original_content": false,
//                       "author_fullname": "t2_cputwx7n",
//                       "secure_media": null,
//                       "is_reddit_media_domain": false,
//                       "is_meta": false,
//                       "category": null,
//                       "secure_media_embed": {},
//                       "link_flair_text": "B2B SaaS",
//                       "can_mod_post": false,
//                       "score": 2,
//                       "approved_by": null,
//                       "is_created_from_ads_ui": false,
//                       "author_premium": false,
//                       "thumbnail": "self",
//                       "edited": false,
//                       "author_flair_css_class": null,
//                       "author_flair_richtext": [],
//                       "gildings": {},
//                       "content_categories": null,
//                       "is_self": true,
//                       "mod_note": null,
//                       "created": 1760350961.0,
//                       "link_flair_type": "text",
//                       "wls": 6,
//                       "removed_by_category": null,
//                       "banned_by": null,
//                       "author_flair_type": "text",
//                       "domain": "self.SaaS",
//                       "allow_live_comments": false,
//                       "selftext_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;My B2B SaaS is getting organic growth from referrals and LinkedIn. I&amp;#39;m not new to the tools. I know my way around building lists and setting up sequences.&lt;/p&gt;\n\n&lt;p&gt;But I&amp;#39;m at a point where I need to prioritize my time. &lt;strong&gt;Is actively building an email marketing channel truly worth the effort?&lt;/strong&gt;&lt;/p&gt;\n\n&lt;p&gt;I&amp;#39;m not looking for &amp;quot;how-to,&amp;quot; I&amp;#39;m looking for &amp;quot;why-should-I.&amp;quot;&lt;/p&gt;\n\n&lt;p&gt;&lt;strong&gt;If you&amp;#39;ve done it:&lt;/strong&gt;&lt;/p&gt;\n\n&lt;ul&gt;\n&lt;li&gt;What kind of results did you actually see? (Open rates, conversion lifts, reduced churn? &lt;strong&gt;Stats would be incredibly helpful!&lt;/strong&gt;)&lt;/li&gt;\n&lt;li&gt;Did it effectively complement your organic channels?&lt;/li&gt;\n&lt;li&gt;What specific type of campaign delivered the biggest ROI for you?&lt;/li&gt;\n&lt;/ul&gt;\n\n&lt;p&gt;Any real-world data or experiences would be awesome. Thanks in advance!&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
//                       "likes": null,
//                       "suggested_sort": null,
//                       "banned_at_utc": null,
//                       "view_count": null,
//                       "archived": false,
//                       "no_follow": false,
//                       "is_crosspostable": true,
//                       "pinned": false,
//                       "over_18": false,
//                       "all_awardings": [],
//                       "awarders": [],
//                       "media_only": false,
//                       "link_flair_template_id": "0d828010-b6fa-11eb-aea6-0eea1032fba1",
//                       "can_gild": false,
//                       "spoiler": false,
//                       "locked": false,
//                       "author_flair_text": null,
//                       "treatment_tags": [],
//                       "visited": false,
//                       "removed_by": null,
//                       "num_reports": null,
//                       "distinguished": null,
//                       "subreddit_id": "t5_2qkq6",
//                       "author_is_blocked": false,
//                       "mod_reason_by": null,
//                       "removal_reason": null,
//                       "link_flair_background_color": "#dadada",
//                       "id": "1o5fy7y",
//                       "is_robot_indexable": true,
//                       "num_duplicates": 0,
//                       "report_reasons": null,
//                       "author": "Legal-Masterpiece275",
//                       "discussion_type": null,
//                       "num_comments": 5,
//                       "send_replies": true,
//                       "media": null,
//                       "contest_mode": false,
//                       "author_patreon_flair": false,
//                       "author_flair_text_color": null,
//                       "permalink": "/r/SaaS/comments/1o5fy7y/scaling_my_saas_is_email_marketing_worth_the/",
//                       "stickied": false,
//                       "url": "https://www.reddit.com/r/SaaS/comments/1o5fy7y/scaling_my_saas_is_email_marketing_worth_the/",
//                       "subreddit_subscribers": 421936,
//                       "created_utc": 1760350961.0,
//                       "num_crossposts": 0,
//                       "mod_reports": [],
//                       "is_video": false
//                   }
//               }
//           ],
//           "before": null
//       }
//   },
//   {
//       "kind": "Listing",
//       "data": {
//           "after": null,
//           "dist": null,
//           "modhash": null,
//           "geo_filter": "",
//           "children": [
//               {
//                   "kind": "t1",
//                   "data": {
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
//                       "likes": true,
//                       "replies": {
//                           "kind": "Listing",
//                           "data": {
//                               "after": null,
//                               "dist": null,
//                               "modhash": null,
//                               "geo_filter": "",
//                               "children": [
//                                   {
//                                       "kind": "t1",
//                                       "data": {
//                                           "subreddit_id": "t5_2qkq6",
//                                           "approved_at_utc": null,
//                                           "author_is_blocked": false,
//                                           "comment_type": null,
//                                           "awarders": [],
//                                           "mod_reason_by": null,
//                                           "banned_by": null,
//                                           "author_flair_type": "text",
//                                           "total_awards_received": 0,
//                                           "subreddit": "SaaS",
//                                           "author_flair_template_id": null,
//                                           "likes": null,
//                                           "replies": "",
//                                           "user_reports": [],
//                                           "saved": false,
//                                           "id": "nj9nhnh",
//                                           "banned_at_utc": null,
//                                           "mod_reason_title": null,
//                                           "gilded": 0,
//                                           "archived": false,
//                                           "collapsed_reason_code": null,
//                                           "no_follow": true,
//                                           "author": "Legal-Masterpiece275",
//                                           "can_mod_post": false,
//                                           "created_utc": 1760361514.0,
//                                           "send_replies": true,
//                                           "parent_id": "t1_nj9n6q9",
//                                           "score": 1,
//                                           "author_fullname": "t2_cputwx7n",
//                                           "removal_reason": null,
//                                           "approved_by": null,
//                                           "mod_note": null,
//                                           "all_awardings": [],
//                                           "body": "Thanks for the  feedback",
//                                           "edited": false,
//                                           "top_awarded_type": null,
//                                           "author_flair_css_class": null,
//                                           "name": "t1_nj9nhnh",
//                                           "is_submitter": true,
//                                           "downs": 0,
//                                           "author_flair_richtext": [],
//                                           "author_patreon_flair": false,
//                                           "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;Thanks for the  feedback&lt;/p&gt;\n&lt;/div&gt;",
//                                           "gildings": {},
//                                           "collapsed_reason": null,
//                                           "distinguished": null,
//                                           "associated_award": null,
//                                           "stickied": false,
//                                           "author_premium": false,
//                                           "can_gild": false,
//                                           "link_id": "t3_1o5fy7y",
//                                           "unrepliable_reason": null,
//                                           "author_flair_text_color": null,
//                                           "score_hidden": true,
//                                           "permalink": "/r/SaaS/comments/1o5fy7y/scaling_my_saas_is_email_marketing_worth_the/nj9nhnh/",
//                                           "subreddit_type": "public",
//                                           "locked": false,
//                                           "report_reasons": null,
//                                           "created": 1760361514.0,
//                                           "author_flair_text": null,
//                                           "treatment_tags": [],
//                                           "collapsed": false,
//                                           "subreddit_name_prefixed": "r/SaaS",
//                                           "controversiality": 0,
//                                           "depth": 1,
//                                           "author_flair_background_color": null,
//                                           "collapsed_because_crowd_control": null,
//                                           "mod_reports": [],
//                                           "num_reports": null,
//                                           "ups": 1
//                                       }
//                                   }
//                               ],
//                               "before": null
//                           }
//                       },
//                       "user_reports": [],
//                       "saved": false,
//                       "id": "nj9n6q9",
//                       "banned_at_utc": null,
//                       "mod_reason_title": null,
//                       "gilded": 0,
//                       "archived": false,
//                       "collapsed_reason_code": null,
//                       "no_follow": false,
//                       "author": "Odd_Current_3121",
//                       "can_mod_post": false,
//                       "created_utc": 1760361407.0,
//                       "send_replies": true,
//                       "parent_id": "t3_1o5fy7y",
//                       "score": 2,
//                       "author_fullname": "t2_1yu5nrmfy1",
//                       "approved_by": null,
//                       "mod_note": null,
//                       "all_awardings": [],
//                       "collapsed": false,
//                       "body": "in my experience email's worth it, we got 25–35% of new MQLs from email and raised trial-to-paid conversion 10–15% when sequences matched product activity, open rates 30–45% and reply rates 5–10% for warm lists, tbh\n\nit complemented referrals and LinkedIn by nudging prospects at key moments and reactivating dormant trials, biggest ROI came from onboarding behavioral drips then winback sequences for churned trials\n\nif you can spend 3–4 hours a week building targeted sequences you'll see returns within a month, honestly worth prioritizing :)",
//                       "edited": false,
//                       "top_awarded_type": null,
//                       "author_flair_css_class": null,
//                       "name": "t1_nj9n6q9",
//                       "is_submitter": false,
//                       "downs": 0,
//                       "author_flair_richtext": [],
//                       "author_patreon_flair": false,
//                       "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;in my experience email&amp;#39;s worth it, we got 25–35% of new MQLs from email and raised trial-to-paid conversion 10–15% when sequences matched product activity, open rates 30–45% and reply rates 5–10% for warm lists, tbh&lt;/p&gt;\n\n&lt;p&gt;it complemented referrals and LinkedIn by nudging prospects at key moments and reactivating dormant trials, biggest ROI came from onboarding behavioral drips then winback sequences for churned trials&lt;/p&gt;\n\n&lt;p&gt;if you can spend 3–4 hours a week building targeted sequences you&amp;#39;ll see returns within a month, honestly worth prioritizing :)&lt;/p&gt;\n&lt;/div&gt;",
//                       "removal_reason": null,
//                       "collapsed_reason": null,
//                       "distinguished": null,
//                       "associated_award": null,
//                       "stickied": false,
//                       "author_premium": false,
//                       "can_gild": false,
//                       "gildings": {},
//                       "unrepliable_reason": null,
//                       "author_flair_text_color": null,
//                       "score_hidden": false,
//                       "permalink": "/r/SaaS/comments/1o5fy7y/scaling_my_saas_is_email_marketing_worth_the/nj9n6q9/",
//                       "subreddit_type": "public",
//                       "locked": false,
//                       "report_reasons": null,
//                       "created": 1760361407.0,
//                       "author_flair_text": null,
//                       "treatment_tags": [],
//                       "rte_mode": "richtext",
//                       "link_id": "t3_1o5fy7y",
//                       "subreddit_name_prefixed": "r/SaaS",
//                       "controversiality": 0,
//                       "depth": 0,
//                       "author_flair_background_color": null,
//                       "collapsed_because_crowd_control": null,
//                       "mod_reports": [],
//                       "num_reports": null,
//                       "ups": 2
//                   }
//               }
//           ],
//           "before": null
//       }
//   }
// ]
