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

    // GET THE USER'S COMMENT (FIRST/ONLY ITEM IN THREAD)
    const userComment = threadComments[0];

    // SKIP IF THE COMMENT ITSELF IS FROM THE USER (replying to themselves)
    if (
      userComment?.kind === "t1" &&
      userComment.data?.author_fullname === userFullName
    ) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: comment is from user themselves`
      );
      return null;
    }

    // CHECK IF THERE ARE REPLIES TO THE USER'S COMMENT
    const replies = userComment?.data?.replies?.data?.children || [];

    // IF THERE ARE REPLIES, CHECK THE LATEST ONE
    if (replies.length > 0) {
      const latestReply = replies[replies.length - 1];

      console.log("----");
      console.log(latestReply.data?.author_fullname);
      console.log(userFullName);
      console.log("----");

      // SKIP IF LATEST REPLY IS FROM THE USER THEMSELVES
      if (
        latestReply?.kind === "t1" &&
        latestReply.data?.author_fullname === userFullName
      ) {
        console.log(
          `⏭️ Skipping comment ${comment.data.id}: latest reply is from user`
        );
        return null;
      }

      // SKIP IF LATEST REPLY IS FROM AUTOMODERATOR
      if (latestReply?.data?.author_fullname === "t2_6l4z3") {
        console.log(
          `⏭️ Skipping comment ${comment.data.id}: latest reply is from AutoModerator`
        );
        return null;
      }
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

// EXAMPLE LATESTCOMMENT
// {
//   "kind": "t1",
//   "data": {
//     "subreddit_id": "t5_2rh2i",
//     "approved_at_utc": null,
//     "author_is_blocked": false,
//     "comment_type": null,
//     "awarders": [],
//     "mod_reason_by": null,
//     "banned_by": null,
//     "author_flair_type": "text",
//     "total_awards_received": 0,
//     "subreddit": "LeadGeneration",
//     "author_flair_template_id": null,
//     "likes": true,
//     "replies": {
//       "kind": "Listing",
//       "data": {
//         "after": null,
//         "dist": null,
//         "modhash": null,
//         "geo_filter": "",
//         "children": [
//           {
//             "kind": "t1",
//             "data": {
//               "subreddit_id": "t5_2rh2i",
//               "approved_at_utc": null,
//               "author_is_blocked": false,
//               "comment_type": null,
//               "awarders": [],
//               "mod_reason_by": null,
//               "banned_by": null,
//               "author_flair_type": "text",
//               "total_awards_received": 0,
//               "subreddit": "LeadGeneration",
//               "author_flair_template_id": null,
//               "likes": null,
//               "replies": "",
//               "user_reports": [],
//               "saved": false,
//               "id": "ninhgl4",
//               "banned_at_utc": null,
//               "mod_reason_title": null,
//               "gilded": 0,
//               "archived": false,
//               "collapsed_reason_code": null,
//               "no_follow": true,
//               "author": "AutoModerator",
//               "can_mod_post": false,
//               "created_utc": 1760039504,
//               "send_replies": false,
//               "parent_id": "t1_ninhgj2",
//               "score": 1,
//               "author_fullname": "t2_6l4z3",
//               "removal_reason": null,
//               "approved_by": null,
//               "mod_note": null,
//               "all_awardings": [],
//               "body": "Your account must be 30+ days old and it must have 30+ karma to post.\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/LeadGeneration) if you have any questions or concerns.*",
//               "edited": false,
//               "top_awarded_type": null,
//               "author_flair_css_class": null,
//               "name": "t1_ninhgl4",
//               "is_submitter": false,
//               "downs": 0,
//               "author_flair_richtext": [],
//               "author_patreon_flair": false,
//               "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;Your account must be 30+ days old and it must have 30+ karma to post.&lt;/p&gt;\n\n&lt;p&gt;&lt;em&gt;I am a bot, and this action was performed automatically. Please &lt;a href=\"/message/compose/?to=/r/LeadGeneration\"&gt;contact the moderators of this subreddit&lt;/a&gt; if you have any questions or concerns.&lt;/em&gt;&lt;/p&gt;\n&lt;/div&gt;",
//               "gildings": {},
//               "collapsed_reason": null,
//               "distinguished": "moderator",
//               "associated_award": null,
//               "stickied": false,
//               "author_premium": true,
//               "can_gild": false,
//               "link_id": "t3_1o1xpiu",
//               "unrepliable_reason": null,
//               "author_flair_text_color": null,
//               "score_hidden": false,
//               "permalink": "/r/LeadGeneration/comments/1o1xpiu/is_lead_nurturing_undervalued_in_the_rush_for_new/ninhgl4/",
//               "subreddit_type": "public",
//               "locked": false,
//               "report_reasons": null,
//               "created": 1760039504,
//               "author_flair_text": null,
//               "treatment_tags": [],
//               "collapsed": false,
//               "subreddit_name_prefixed": "r/LeadGeneration",
//               "controversiality": 0,
//               "depth": 1,
//               "author_flair_background_color": null,
//               "collapsed_because_crowd_control": null,
//               "mod_reports": [],
//               "num_reports": null,
//               "ups": 1
//             }
//           }
//         ],
//         "before": null
//       }
//     },
//     "user_reports": [],
//     "saved": false,
//     "id": "ninhgj2",
//     "banned_at_utc": null,
//     "mod_reason_title": null,
//     "gilded": 0,
//     "archived": false,
//     "collapsed_reason_code": null,
//     "no_follow": false,
//     "author": "Odd_Current_3121",
//     "can_mod_post": false,
//     "created_utc": 1760039503,
//     "send_replies": true,
//     "parent_id": "t3_1o1xpiu",
//     "score": 1,
//     "author_fullname": "t2_1yu5nrmfy1",
//     "approved_by": null,
//     "mod_note": null,
//     "all_awardings": [],
//     "collapsed": false,
//     "body": "Yep, totally underrated, tbh. Most teams chase new contacts while ignoring a far easier win: segmented, behavior-driven nurture that actually converts better than cold outreach\n\nI always prioritized granular scoring, behavior triggers, and value-first cadences, and we saw \\~2x conversion lifts in nurtured cohorts ngl. Quick playbook: audit touchpoints, run a 90-day educate -&gt; proof -&gt; micro-ask sequence, add a win-back flow, surface sales alerts for high-intent actions, and report conversion + LTV so you can prove ROI :)",
//     "edited": false,
//     "top_awarded_type": null,
//     "author_flair_css_class": null,
//     "name": "t1_ninhgj2",
//     "is_submitter": false,
//     "downs": 0,
//     "author_flair_richtext": [],
//     "author_patreon_flair": false,
//     "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;Yep, totally underrated, tbh. Most teams chase new contacts while ignoring a far easier win: segmented, behavior-driven nurture that actually converts better than cold outreach&lt;/p&gt;\n\n&lt;p&gt;I always prioritized granular scoring, behavior triggers, and value-first cadences, and we saw ~2x conversion lifts in nurtured cohorts ngl. Quick playbook: audit touchpoints, run a 90-day educate -&amp;gt; proof -&amp;gt; micro-ask sequence, add a win-back flow, surface sales alerts for high-intent actions, and report conversion + LTV so you can prove ROI :)&lt;/p&gt;\n&lt;/div&gt;",
//     "removal_reason": null,
//     "collapsed_reason": null,
//     "distinguished": null,
//     "associated_award": null,
//     "stickied": false,
//     "author_premium": false,
//     "can_gild": false,
//     "gildings": {},
//     "unrepliable_reason": null,
//     "author_flair_text_color": null,
//     "score_hidden": false,
//     "permalink": "/r/LeadGeneration/comments/1o1xpiu/is_lead_nurturing_undervalued_in_the_rush_for_new/ninhgj2/",
//     "subreddit_type": "public",
//     "locked": false,
//     "report_reasons": null,
//     "created": 1760039503,
//     "author_flair_text": null,
//     "treatment_tags": [],
//     "rte_mode": "richtext",
//     "link_id": "t3_1o1xpiu",
//     "subreddit_name_prefixed": "r/LeadGeneration",
//     "controversiality": 0,
//     "depth": 0,
//     "author_flair_background_color": null,
//     "collapsed_because_crowd_control": null,
//     "mod_reports": [],
//     "num_reports": null,
//     "ups": 1
//   }
// }
