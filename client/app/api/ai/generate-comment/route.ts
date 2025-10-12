import { redditGenerateCommentPrompt } from "@/defs/comments/generate-comment";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const { interactionId, userName } = await req.json();

  console.log("userName", userName);
  console.log("interactionId", interactionId);

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
  });

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "developer",
          content: prompt,
        },
        {
          role: "user",
          content: `<post_title>${interaction.reddit_content_discovered.title}</post_title>\n\n<post_content>${interaction.reddit_content_discovered.content}</post_content>`,
        },
      ],
      store: true,
    });
  } catch (error) {
    console.error("Error generating comment:", error);
    return NextResponse.json(
      { error: "Failed to generate comment" },
      { status: 500 }
    );
  }

  const cleanedComment = cleanUpGeneratedComment(
    response.choices[0].message.content || ""
  );

  return NextResponse.json({ comment: cleanedComment }, { status: 200 });
};

// HELPER FUNCTION TO PROCESS GENERATED COMMENTS
function cleanUpGeneratedComment(content: string): string {
  // REPLACE EM-DASHES WITH COMMA AND SPACE
  let cleaned = content.replace(/—/g, ", ");

  // REPLACE SPACED HYPHENS WITH COMMA AND SPACE
  cleaned = cleaned.replace(/\s+-\s+/g, ", ");

  // CLEAN UP MULTIPLE CONSECUTIVE SPACES BUT PRESERVE NEWLINES
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // CLEAN UP COMMA FOLLOWED BY MULTIPLE SPACES
  cleaned = cleaned.replace(/,\s+/g, ", ");

  // REMOVE LEADING AND TRAILING WHITESPACE
  return cleaned;
}
