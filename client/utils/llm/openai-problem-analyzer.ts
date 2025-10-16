import { PROBLEM_IDENTIFICATION_PROMPT } from "@/defs/system-instructions/analysis-prompts";
import OpenAI from "openai";

interface ProblemAnalysisResult {
  problemStatement: string;
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function identifyWebsiteProblem(
  content: string
): Promise<ProblemAnalysisResult> {
  try {
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: PROBLEM_IDENTIFICATION_PROMPT,
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
          name: "problem_identification",
          strict: true,
          schema: {
            type: "object",
            properties: {
              problemStatement: {
                type: "string",
                description:
                  "A single sentence describing the main problem this business solves",
                minLength: 1,
              },
            },
            required: ["problemStatement"],
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

    if (!analysisData.problemStatement) {
      throw new Error("Invalid analysis response structure");
    }

    return {
      problemStatement: analysisData.problemStatement,
    };
  } catch (error) {
    console.error("OpenAI problem analysis error:", error);
    return {
      problemStatement: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze website content",
    };
  }
}
