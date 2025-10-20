import { WEBSITE_ANALYSIS_PROMPT } from "@/defs/system-instructions/analysis-prompts";
import OpenAI from "openai";

interface AnalysisResult {
  websiteName: string;
  companyDescription: string;
  keywords: string[];
  targetAudience: string;
  expertise: string[];
  recommendedSubreddits: string[];
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWebsiteContent(
  content: string
): Promise<AnalysisResult> {
  try {
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: WEBSITE_ANALYSIS_PROMPT,
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
          name: "website_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              websiteName: {
                type: "string",
                description: "Company name only",
                minLength: 1,
              },
              companyDescription: {
                type: "string",
                description:
                  "What the business does and core value proposition",
                minLength: 1,
              },
              targetAudience: {
                type: "string",
                description: "Who the business serves",
                minLength: 1,
              },
              expertise: {
                type: "array",
                description:
                  "Keywords describing what the business is expert in",
                items: {
                  type: "string",
                  minLength: 1,
                },
                minItems: 1,
                maxItems: 10,
              },
              keywords: {
                type: "array",
                description:
                  "5 terms potential customers use when discussing their problems on Reddit",
                items: {
                  type: "string",
                  minLength: 1,
                },
                minItems: 1,
                maxItems: 10,
              },
              recommendedSubreddits: {
                type: "array",
                description:
                  "6 recommended subreddits where the target audience hangs out",
                items: {
                  type: "string",
                  minLength: 1,
                },
                minItems: 1,
                maxItems: 10,
              },
            },
            required: [
              "websiteName",
              "companyDescription",
              "targetAudience",
              "expertise",
              "keywords",
              "recommendedSubreddits",
            ],
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

    if (
      !analysisData.companyDescription ||
      !analysisData.keywords ||
      !Array.isArray(analysisData.keywords) ||
      !analysisData.recommendedSubreddits ||
      !Array.isArray(analysisData.recommendedSubreddits)
    ) {
      throw new Error("Invalid analysis response structure");
    }

    return {
      websiteName: analysisData.websiteName,
      companyDescription: analysisData.companyDescription,
      keywords: analysisData.keywords,
      targetAudience: analysisData.targetAudience,
      expertise: analysisData.expertise,
      recommendedSubreddits: analysisData.recommendedSubreddits,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return {
      websiteName: "",
      companyDescription: "",
      keywords: [],
      targetAudience: "",
      expertise: [],
      recommendedSubreddits: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze website content",
    };
  }
}
