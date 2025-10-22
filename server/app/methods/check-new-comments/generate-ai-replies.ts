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
  shouldRespond: boolean;
  reasoning?: string;
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
    allResults: AIReplyResult[];
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

  // FILTER OUT INVALID CONTEXTS BEFORE AI PROCESSING TO SAVE API CALLS
  const processableContexts = validContexts.filter((item) => {
    const { comment, context } = item;

    // PARSE CONTEXT RESPONSE
    const originalPostListing = context[0];
    const threadListing = context[1];

    if (!originalPostListing || !threadListing) {
      console.error(
        `❌ Invalid context structure for comment ${comment.data.id}`
      );
      return false;
    }

    const originalPost = originalPostListing.data.children[0]?.data;
    if (!originalPost) {
      console.error(`❌ No original post found for comment ${comment.data.id}`);
      return false;
    }

    const threadComments = threadListing.data.children || [];

    // GET THE LATEST COMMENT IN THE ENTIRE THREAD
    const latestComment = findLatestComment(threadComments);

    // SKIP IF NO VALID COMMENTS FOUND
    if (!latestComment) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: no valid comments in thread`
      );
      return false;
    }

    // SKIP IF LATEST COMMENT IS FROM THE USER THEMSELVES
    if (latestComment.data?.author_fullname === userFullName) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from user`
      );
      return false;
    }

    // SKIP IF LATEST COMMENT IS FROM AUTOMODERATOR
    if (latestComment.data?.author_fullname === "t2_6l4z3") {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from AutoModerator`
      );
      return false;
    }

    return true;
  });

  console.log(
    `📋 Filtered to ${processableContexts.length} processable contexts (from ${validContexts.length} total)`
  );

  // GENERATE ALL AI REPLIES IN PARALLEL FOR PROCESSABLE CONTEXTS ONLY
  const aiPromises = processableContexts.map(async (item) => {
    const { comment, context } = item;

    // PARSE CONTEXT RESPONSE (ALREADY VALIDATED ABOVE)
    const originalPostListing = context[0];
    const threadListing = context[1];
    const originalPost = originalPostListing.data.children[0]?.data;
    const threadComments = threadListing.data.children || [];

    const conversationContext = buildThreadContext(
      originalPost,
      threadComments,
      userFullName
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

    // PROCESS REPLY IF AI DETERMINED IT'S WORTH RESPONDING
    const processedReply = parsedResponse.shouldRespond
      ? cleanUpGeneratedComment(parsedResponse.reply)
      : "";

    // LOG DECISION
    if (!parsedResponse.shouldRespond) {
      console.log(
        `⏭️ AI decided not to respond to comment ${comment.data.id}: ${parsedResponse.reasoning}`
      );
    }

    return {
      comment,
      originalPost,
      processedReply,
      shouldRespond: parsedResponse.shouldRespond,
      reasoning: parsedResponse.reasoning,
    };
  });

  const allResults = (await Promise.all(aiPromises)).filter(
    (result) => result !== null
  ) as AIReplyResult[];

  return {
    success: true,
    data: {
      allResults,
    },
  };
}

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
