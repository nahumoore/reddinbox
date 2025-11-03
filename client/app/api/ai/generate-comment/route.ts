import { redditGenerateCommentPrompt } from "@/defs/comments/generate-comment";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { cleanUpGeneratedContent } from "@/utils/llm/clean-up-generated-content";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_REGENERATIONS_PER_HOUR = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerationHistory {
  comment: string;
  instructions?: string;
  timestamp: string;
}

export const POST = async (req: NextRequest) => {
  const { interactionId, userName, customInstructions, generationHistory } =
    await req.json();

  // CHECK INTERACTION
  if (!interactionId) {
    return NextResponse.json(
      { error: "Interaction ID is required" },
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

  // CHECK RATE LIMIT
  const rateLimitCookie = req.cookies.get("regeneration-limit");
  const now = Date.now();
  const oneHourMs = 60 * 60 * 1000;

  let rateLimitData = {
    count: 0,
    windowStart: now,
  };

  if (rateLimitCookie) {
    try {
      const parsed = JSON.parse(rateLimitCookie.value);
      const timeSinceWindowStart = now - parsed.windowStart;

      // IF WE'RE STILL WITHIN THE SAME HOUR WINDOW
      if (timeSinceWindowStart < oneHourMs) {
        rateLimitData = parsed;

        // CHECK IF LIMIT IS EXCEEDED
        if (rateLimitData.count >= MAX_REGENERATIONS_PER_HOUR) {
          const timeUntilReset = oneHourMs - timeSinceWindowStart;
          const minutesUntilReset = Math.ceil(timeUntilReset / 60000);

          return NextResponse.json(
            {
              error: `Rate limit exceeded. You can generate ${MAX_REGENERATIONS_PER_HOUR} comments per hour. Try again in ${minutesUntilReset} minute${
                minutesUntilReset !== 1 ? "s" : ""
              }.`,
            },
            { status: 429 }
          );
        }
      } else {
        // RESET THE WINDOW IF MORE THAN AN HOUR HAS PASSED
        rateLimitData = {
          count: 0,
          windowStart: now,
        };
      }
    } catch (error) {
      // IF COOKIE IS CORRUPTED, RESET IT
      rateLimitData = {
        count: 0,
        windowStart: now,
      };
    }
  }

  // GET INTERACTION WITH RELATED DATA
  const supabase = supabaseAdmin;
  const { data: interaction, error: interactionError } = await supabase
    .from("reddit_user_interactions")
    .select(
      `
      id,
      website_id,
      reddit_content_discovered_id,
      reddit_content_discovered(
        title,
        content
      ),
      websites(
        name,
        description,
        keywords,
        type_of_service,
        user_info(name)
      )
    `
    )
    .eq("id", interactionId)
    .eq("user_id", user.id)
    .single();

  if (interactionError || !interaction) {
    return NextResponse.json(
      { error: "Interaction not found" },
      { status: 404 }
    );
  }

  if (!interaction.reddit_content_discovered) {
    return NextResponse.json(
      { error: "Reddit content not found" },
      { status: 404 }
    );
  }

  if (!interaction.websites) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  const website = interaction.websites;

  const prompt = redditGenerateCommentPrompt({
    userName: userName,
    userProductName: website.name,
    userProductDescription: website.description || "",
    userProductKeywords: website.keywords || [],
    userProductType: website.type_of_service || "saas",
  });

  // BUILD CONVERSATION HISTORY FROM CLIENT-SIDE GENERATION HISTORY
  const previousGenerations: GenerationHistory[] = generationHistory || [];

  const messages: Array<{
    role: "developer" | "user" | "assistant";
    content: string;
  }> = [
    {
      role: "developer",
      content: prompt,
    },
    {
      role: "user",
      content: `<post_title>${interaction.reddit_content_discovered.title}</post_title>\n\n<post_content>${interaction.reddit_content_discovered.content}</post_content>`,
    },
  ];

  // ADD PREVIOUS GENERATIONS TO THE CONVERSATION
  previousGenerations.forEach((generation) => {
    // IF THERE WERE INSTRUCTIONS, ADD THEM AS USER MESSAGE FIRST
    if (generation.instructions) {
      messages.push({
        role: "user",
        content: `Regenerate that comment with the following instructions:\n\n${generation.instructions}`,
      });
    }

    // THEN ADD ASSISTANT MESSAGE WITH THE GENERATED COMMENT (RESULT OF INSTRUCTIONS)
    messages.push({
      role: "assistant",
      content: generation.comment,
    });
  });

  // ADD CURRENT CUSTOM INSTRUCTIONS IF PROVIDED
  if (customInstructions) {
    messages.push({
      role: "user",
      content: `Regenerate that comment with the following instructions:\n\n${customInstructions}`,
    });
  }

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      reasoning_effort: "medium",
      messages,
      store: true,
    });
  } catch (error) {
    console.error("Error generating comment:", error);
    return NextResponse.json(
      { error: "Failed to generate comment" },
      { status: 500 }
    );
  }

  const cleanedComment = cleanUpGeneratedContent(
    response.choices[0].message.content || ""
  );

  // UPDATE RATE LIMIT COOKIE
  rateLimitData.count += 1;
  const updatedCookie = JSON.stringify(rateLimitData);

  const res = NextResponse.json({ comment: cleanedComment }, { status: 200 });
  res.cookies.set("regeneration-limit", updatedCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: oneHourMs / 1000, // COOKIE EXPIRES IN 1 HOUR
  });

  return res;
};
