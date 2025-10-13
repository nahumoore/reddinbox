import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { WebsiteAnalysis } from "@/stores/onboarding-form";
import { SubredditData } from "@/types/reddit";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const { websiteAnalysis, targetSubreddits, websiteUrl, userName } =
    await req.json();

  // VALIDATE PARAMS
  if (!websiteAnalysis || !targetSubreddits || !websiteUrl || !userName) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CHECK USER INFO
  const supabase = supabaseAdmin;
  const { data: userInfo, error: userInfoError } = await supabase
    .from("user_info")
    .select("onboarding_completed")
    .eq("auth_user_id", user.id)
    .single();

  if (userInfoError || userInfo?.onboarding_completed) {
    return NextResponse.json(
      { error: userInfoError?.message || "Failed to update user info" },
      { status: 500 }
    );
  }

  // UPDATE WEBSITE ANALYSIS
  let websiteInfoEmbedding: number[];
  try {
    websiteInfoEmbedding = await generateWebsiteInfoEmbedding(websiteAnalysis);
  } catch (error) {
    console.error("Failed to generate website embedding:", error);
    return NextResponse.json(
      {
        error: "Failed to generate website embedding. Please try again later.",
      },
      { status: 500 }
    );
  }

  // CHECK IF WEBSITE EXISTS FOR USER
  const { data: existingWebsite, error: checkError } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user.id)
    .eq("url", websiteUrl)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing website:", checkError);
    return NextResponse.json(
      {
        error: checkError.message || "Failed to check existing website",
      },
      { status: 500 }
    );
  }

  const websiteData = {
    name: websiteAnalysis.websiteName,
    description: websiteAnalysis.companyDescription,
    keywords: websiteAnalysis.keywordsToMonitor,
    target_audience: websiteAnalysis.targetAudience,
    expertise: websiteAnalysis.expertise,
    vector_ai_searcher: websiteInfoEmbedding as any,
    url: websiteUrl,
    subreddit_reddit_ids: targetSubreddits.map(
      (subreddit: SubredditData) => subreddit.id
    ),
    user_id: user.id,
  };

  // UPDATE OR INSERT WEBSITE
  let websiteAnalysisError;
  if (existingWebsite) {
    // Update existing website
    const { error } = await supabase
      .from("websites")
      .update(websiteData)
      .eq("id", existingWebsite.id);
    websiteAnalysisError = error;
  } else {
    // Insert new website
    const { error } = await supabase.from("websites").insert(websiteData);
    websiteAnalysisError = error;
  }

  if (websiteAnalysisError) {
    console.log("Error upserting website analysis");
    console.log(JSON.stringify(websiteAnalysisError));

    return NextResponse.json(
      {
        error:
          websiteAnalysisError.message || "Failed to update website analysis",
      },
      { status: 500 }
    );
  }

  // GET DUP SUBREDDITS
  const { data: dupSubreddits, error: dupSubredditsError } = await supabase
    .from("reddit_subreddits")
    .select("id")
    .in(
      "id",
      targetSubreddits.map((subreddit: SubredditData) => subreddit.id)
    );
  if (dupSubredditsError) {
    return NextResponse.json(
      { error: dupSubredditsError.message || "Failed to get dup subreddits" },
      { status: 500 }
    );
  }

  // GET NEW SUBREDDITS
  const newSubreddits = targetSubreddits.filter(
    (subreddit: SubredditData) =>
      !dupSubreddits.some((dupSubreddit) => dupSubreddit.id === subreddit.id)
  );

  if (newSubreddits.length === 0) {
    return NextResponse.json(
      { message: "Onboarding completed" },
      { status: 200 }
    );
  }

  // INSERT NEW SUBREDDITS
  const { error: insertError } = await supabase
    .from("reddit_subreddits")
    .insert(
      newSubreddits.map((subreddit: SubredditData) => ({
        ...subreddit,
      }))
    );

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message || "Failed to insert new subreddits" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Onboarding completed" },
    { status: 200 }
  );
};

const generateWebsiteInfoEmbedding = async (
  websiteAnalysis: WebsiteAnalysis
): Promise<number[]> => {
  const prompt = websiteAnalysis.expertise.join(", ");

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
