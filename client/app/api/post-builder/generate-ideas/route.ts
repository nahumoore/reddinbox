import { postIdeasInstructionGeneration } from "@/defs/system-instructions/generate-post-ideas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { cleanUpAgentJsonResponse } from "@/utils/llm/clean-up-agent-json-response";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const POST = async (req: NextRequest) => {
  try {
    const { subreddit, story } = await req.json();

    // VALIDATE INPUTS
    if (!subreddit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // CHECK USER
    const supabaseAuth = await supabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET USER DATA IN SINGLE QUERY
    const supabase = supabaseAdmin;
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select(
        `
        name,
        description,
        expertise,
        target_audience,
        type_of_service,
        user_info!websites_user_id_fkey(name)
      `
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (websiteError || !website) {
      return NextResponse.json(
        { error: "No active website found. Please create a website first." },
        { status: 404 }
      );
    }

    // PREPARE SYSTEM INSTRUCTION
    const systemInstruction = postIdeasInstructionGeneration({
      userName: (website.user_info as any)?.name || "User",
      userExpertise: website.expertise || [],
      productName: website.name || "your product",
      targetSubreddit: subreddit,
      targetAudience: website.target_audience ? [website.target_audience] : [],
    });

    console.log("System Instruction:", systemInstruction);
    console.log("User Input:", story);

    // GENERATE IDEAS WITH OPENROUTER
    const completion = await openRouter.chat.completions.create({
      model: "anthropic/claude-haiku-4.5",
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: story || `A random story while building ${website.name}`,
        },
      ],
      // NOTE: Claude models don't support response_format parameter
      // The JSON schema is now included in the system instructions instead
      // Keeping this commented for potential future use with other models
      // response_format: {
      //   type: "json_schema",
      //   json_schema: {
      //     name: "post_ideas",
      //     strict: true,
      //     schema: {
      //       type: "object",
      //       properties: {
      //         ideas: {
      //           type: "array",
      //           description:
      //             "List of 5 post ideas ordered by engagement score (highest first)",
      //           items: {
      //             type: "object",
      //             properties: {
      //               emotion: {
      //                 type: "string",
      //                 description: "The emotional trigger for this idea",
      //                 enum: [
      //                   "Curiosity",
      //                   "Validation",
      //                   "Surprise",
      //                   "Frustration",
      //                   "Hope",
      //                 ],
      //               },
      //               engagementScore: {
      //                 type: "number",
      //                 description:
      //                   "Engagement potential score from 1-10 for this specific context",
      //                 minimum: 1,
      //                 maximum: 10,
      //               },
      //               topic: {
      //                 type: "string",
      //                 description: "Catchy and authentic topic",
      //                 minLength: 1,
      //               },
      //               coreMessage: {
      //                 type: "string",
      //                 description:
      //                   "1-2 sentences explaining the key insight, story, or value",
      //                 minLength: 1,
      //               },
      //             },
      //             required: [
      //               "emotion",
      //               "engagementScore",
      //               "topic",
      //               "coreMessage",
      //             ],
      //             additionalProperties: false,
      //           },
      //           minItems: 5,
      //           maxItems: 5,
      //         },
      //       },
      //       required: ["ideas"],
      //       additionalProperties: false,
      //     },
      //   },
      // },
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log("Response Content:", responseContent);

    if (!responseContent) {
      throw new Error("No response from the model");
    }

    // Clean up and parse the response (handles markdown-wrapped JSON, etc.)
    const parsedResponse = cleanUpAgentJsonResponse<{
      ideas: Array<{
        emotion: string;
        engagementScore: number;
        topic: string;
        coreMessage: string;
      }>;
    }>(responseContent);

    if (!parsedResponse.ideas || !Array.isArray(parsedResponse.ideas)) {
      throw new Error("Invalid response structure from the model");
    }

    return NextResponse.json({ ideas: parsedResponse.ideas });
  } catch (error) {
    console.error("Error generating post ideas:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate post ideas",
      },
      { status: 500 }
    );
  }
};
