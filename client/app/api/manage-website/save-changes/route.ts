import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { Website } from "@/types/db-schema";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  // PARSE REQUEST BODY
  const body = await req.json();
  const { website_id, target_audience, keywords, expertise, description } =
    body;

  // VALIDATE INPUT
  if (!website_id) {
    return NextResponse.json(
      { error: "Website ID is required" },
      { status: 400 }
    );
  }

  if (keywords && !Array.isArray(keywords)) {
    return NextResponse.json(
      { error: "Keywords must be an array" },
      { status: 400 }
    );
  }

  if (expertise && !Array.isArray(expertise)) {
    return NextResponse.json(
      { error: "Expertise must be an array" },
      { status: 400 }
    );
  }

  // CHECK USER AUTHENTICATION
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CHECK CURRENT EXPERTISE
  const supabase = supabaseAdmin;
  const { data: currentExpertise, error: currentExpertiseError } =
    await supabase
      .from("websites")
      .select("expertise")
      .eq("id", website_id)
      .eq("user_id", user.id)
      .single();

  if (currentExpertiseError) {
    return NextResponse.json(
      { error: currentExpertiseError.message },
      { status: 500 }
    );
  }

  // GENERATE EMBEDDINGS (if expertise changed)
  const changes: Partial<Website> = {
    target_audience,
    keywords,
    expertise,
    description,
  };
  if (expertise && expertise !== currentExpertise.expertise) {
    const embedding = await generateWebsiteInfoEmbedding(expertise);
    changes.vector_ai_searcher = embedding as any;
  }

  // UPDATE WEBSITE
  const { data, error } = await supabase
    .from("websites")
    .update(changes)
    .eq("id", website_id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    message: "Website settings updated successfully",
  });
};

const generateWebsiteInfoEmbedding = async (
  expertise: string[]
): Promise<number[]> => {
  const prompt = expertise.join(", ");

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: prompt,
        encoding_format: "float",
      });

      // Validate response format
      if (
        !embedding?.data?.[0]?.embedding ||
        !Array.isArray(embedding.data[0].embedding)
      ) {
        throw new Error("Invalid embedding response format");
      }

      return embedding.data[0].embedding;
    } catch (error) {
      retryCount++;
      console.error(`Embedding API attempt ${retryCount} failed:`, error);

      if (retryCount >= maxRetries) {
        throw new Error(
          `Failed to generate embedding after ${maxRetries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Exponential backoff: wait 1s, 2s, 4s
      const waitTime = Math.pow(2, retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Unexpected error in embedding generation");
};
