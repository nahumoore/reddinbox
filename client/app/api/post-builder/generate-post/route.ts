import { postGenerationInstructions } from "@/defs/system-instructions/generate-post";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { cleanUpAgentJsonResponse } from "@/utils/llm/clean-up-agent-json-response";
import { cleanUpGeneratedContent } from "@/utils/llm/clean-up-generated-content";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export interface PostInfo {
  topic: string;
  emotion: string;
  coreMessage: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { topic, emotion, coreMessage, userStory } = await req.json();

    // VALIDATE INPUTS
    if (!emotion || !topic || !coreMessage) {
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
    const systemInstruction = postGenerationInstructions({
      userName: (website.user_info as any)?.name || "User",
      productName: website.name || "your product",
      productDescription: website.description || "",
    });

    console.log(
      "User Input:",
      `
      ---
      **Emotion:** ${emotion}
      **Topic:** ${topic}
      **Core Message:** ${coreMessage}
      ${userStory ? `**User Story:** ${userStory}` : ""}
      ---
    `
    );

    // GENERATE POST WITH OPENROUTER
    const completion = await openRouter.chat.completions.create({
      model: "anthropic/claude-haiku-4.5",
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: `
          ---
          **Emotion:** ${emotion}
          **Topic:** ${topic}
          **Core Message:** ${coreMessage}
          ---`,
        },
      ],
      reasoning_effort: "low",
      // NOTE: Claude models don't support response_format parameter
      // The JSON schema is now included in the system instructions instead
      // Keeping this commented for potential future use with other models
      // response_format: {
      //   type: "json_schema",
      //   json_schema: {
      //     name: "reddit_post",
      //     strict: true,
      //     schema: {
      //       type: "object",
      //       properties: {
      //         title: {
      //           type: "string",
      //           description: "Post title (50-60 characters)",
      //           minLength: 1,
      //         },
      //         content: {
      //           type: "string",
      //           description: "Post content in markdown format (max 200 words)",
      //           minLength: 1,
      //         },
      //       },
      //       required: ["title", "content"],
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
      title: string;
      content: string;
    }>(responseContent);

    if (!parsedResponse.title || !parsedResponse.content) {
      throw new Error("Invalid response structure from the model");
    }

    return NextResponse.json({
      title: cleanUpGeneratedContent(parsedResponse.title),
      content: cleanUpGeneratedContent(parsedResponse.content),
    });
  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate post",
      },
      { status: 500 }
    );
  }
};
