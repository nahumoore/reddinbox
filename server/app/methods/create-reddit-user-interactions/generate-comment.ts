import { cleanUpGeneratedComment } from "@/helpers/ai/clean-up-generated-comments";
import OpenAI from "openai";
import { redditGenerateCommentPrompt } from "../../defs/ai/reddit-generate-comment";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateCommentParams {
  userName: string;
  userProductName: string;
  userProductDescription: string;
  userProductKeywords: string[];
  postTitle: string;
  postContent: string;
  userProductType: "saas" | "agency";
}

export async function generateComment(
  params: GenerateCommentParams
): Promise<string | null> {
  const {
    userName,
    userProductName,
    userProductDescription,
    userProductKeywords,
    postTitle,
    postContent,
    userProductType,
  } = params;

  const prompt = redditGenerateCommentPrompt({
    userName,
    userProductName,
    userProductDescription,
    userProductKeywords,
    userProductType,
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
        content: JSON.stringify({
          post_title: postTitle,
          post_content: postContent,
        }),
      },
    ],
    store: true,
  });

  const generatedComment = response.choices[0]?.message?.content;
  if (!generatedComment) {
    return null;
  }

  return cleanUpGeneratedComment(generatedComment);
}
