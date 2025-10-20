import { SUBREDDIT_FINDER_PROMPT } from "@/defs/system-instructions/analysis-prompts";
import OpenAI from "openai";

interface Subreddit {
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  activeUsers: number;
  createdAt: string;
  relevanceScore: number;
  activityLevel: "low" | "medium" | "high" | "very-high";
  subredditUrl: string;
  category: string;
}

interface SubredditFinderResult {
  subreddits: Subreddit[];
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function findRelevantSubreddits(
  content: string
): Promise<SubredditFinderResult> {
  try {
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: SUBREDDIT_FINDER_PROMPT,
        },
        {
          role: "user",
          content: content,
        },
      ],
      store: true,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "subreddit_finder",
          strict: true,
          schema: {
            type: "object",
            properties: {
              subreddits: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Subreddit name without r/ prefix",
                    },
                    displayName: {
                      type: "string",
                      description: "Subreddit name with r/ prefix",
                    },
                    description: {
                      type: "string",
                      description: "Description of the subreddit",
                    },
                    subscribers: {
                      type: "number",
                      description: "Number of subscribers",
                    },
                    activeUsers: {
                      type: "number",
                      description: "Number of currently active users",
                    },
                    createdAt: {
                      type: "string",
                      description: "Creation date in YYYY-MM-DD format",
                    },
                    relevanceScore: {
                      type: "number",
                      description: "Relevance score from 70-100",
                    },
                    activityLevel: {
                      type: "string",
                      enum: ["low", "medium", "high", "very-high"],
                      description: "Activity level of the subreddit",
                    },
                    subredditUrl: {
                      type: "string",
                      description: "Full Reddit URL",
                    },
                    category: {
                      type: "string",
                      description: "Category of the subreddit",
                    },
                  },
                  required: [
                    "name",
                    "displayName",
                    "description",
                    "subscribers",
                    "activeUsers",
                    "createdAt",
                    "relevanceScore",
                    "activityLevel",
                    "subredditUrl",
                    "category",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["subreddits"],
            additionalProperties: false,
          },
        },
      },
      verbosity: "medium",
      reasoning_effort: "medium",
    });

    const analysisContent = analysisResponse.choices[0]?.message?.content;
    if (!analysisContent) {
      throw new Error("No response from OpenAI analysis");
    }

    let analysisData;
    try {
      analysisData = JSON.parse(analysisContent);
    } catch (parseError) {
      throw new Error("Failed to parse OpenAI analysis response as JSON");
    }

    if (!analysisData.subreddits || !Array.isArray(analysisData.subreddits)) {
      throw new Error("Invalid analysis response structure");
    }

    return {
      subreddits: analysisData.subreddits,
    };
  } catch (error) {
    console.error("OpenAI subreddit finder error:", error);
    return {
      subreddits: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to find relevant subreddits",
    };
  }
}
