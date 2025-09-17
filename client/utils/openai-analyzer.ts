import { WEBSITE_ANALYSIS_PROMPT } from "@/defs/analysis-prompts";
import OpenAI from "openai";

interface AnalysisResult {
  websiteName: string;
  companyDescription: string;
  keywords: string[];
  idealCustomerProfile: string;
  competitors: string[];
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
      response_format: {
        type: "json_object",
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
      !Array.isArray(analysisData.keywords)
    ) {
      throw new Error("Invalid analysis response structure");
    }

    return {
      websiteName: analysisData.websiteName,
      companyDescription: analysisData.companyDescription,
      keywords: analysisData.keywords,
      idealCustomerProfile: analysisData.idealCustomerProfile,
      competitors: analysisData.competitors,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return {
      websiteName: "",
      companyDescription: "",
      keywords: [],
      idealCustomerProfile: "",
      competitors: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze website content",
    };
  }
}
