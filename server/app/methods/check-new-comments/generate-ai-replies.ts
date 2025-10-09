import { redditGenerateCommentPrompt } from "@/defs/ai/reddit-generate-comment";
import { cleanUpGeneratedComment } from "@/helpers/ai/clean-up-generated-comments";
import { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { CommentWithContext } from "./fetch-comment-contexts";
import { InboxMessage } from "./fetch-inbox-comments";

export interface AIReplyResult {
  comment: InboxMessage;
  originalPost: any;
  processedReply: string;
}

interface GenerateAIRepliesInput {
  validContexts: CommentWithContext[];
  supabase: SupabaseClient;
  redditAccountId: string;
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
  supabase,
  redditAccountId,
  userFullName,
  userInfo,
  activeWebsite,
  openai,
}: GenerateAIRepliesInput): Promise<GenerateAIRepliesResult> {
  console.log("🤖 Generating AI replies...");

  // BUILD CONVERSATION THREAD XML HELPER
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
      console.error(`❌ No original post found for comment ${comment.data.id}`);
      return null;
    }

    const threadComments = threadListing.data.children || [];

    // CHECK IF THE LATEST COMMENT IN THE THREAD IS FROM THE USER
    const latestComment = threadComments[threadComments.length - 1];

    if (
      latestComment?.kind === "t1" &&
      latestComment.data?.author_fullname === userFullName
    ) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from user`
      );
      return null;
    }

    // CHECK IF THE LATEST COMMENT IS FROM AUTOMODERATOR
    if (
      latestComment?.kind === "t1" &&
      latestComment.data?.author === "AutoModerator"
    ) {
      console.log(
        `⏭️ Skipping comment ${comment.data.id}: latest comment is from AutoModerator`
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
  const validResults = aiResults.filter((r): r is AIReplyResult => r !== null);

  console.log(`✅ Generated ${validResults.length} AI replies`);

  return {
    success: true,
    data: {
      validResults,
    },
  };
}
