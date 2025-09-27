import { SUBREDDIT_AUDIENCE_SUMMARY_SYSTEM_PROMPT } from "@/defs/system-instructions/generate-subreddit-audience-summary";
import { SubredditData } from "@/types/reddit";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SubredditAudienceSummary {
  id: string;
  ai_response: string;
}

export const generateSubreditAudience = async (
  subreddits: SubredditData[]
): Promise<SubredditAudienceSummary[]> => {
  try {
    const results = await Promise.all(
      subreddits.map(async (subreddit) => {
        const response = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: SUBREDDIT_AUDIENCE_SUMMARY_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: JSON.stringify({
                name: subreddit.display_name_prefixed,
                title: subreddit.title,
                description: subreddit.description,
              }),
            },
          ],
          response_format: {
            type: "text",
          },
          verbosity: "medium",
          reasoning_effort: "medium",
        });

        return {
          id: subreddit.id,
          ai_response: response.choices[0]?.message?.content || "",
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Error generating subreddit audience:", error);
    return [];
  }
};
