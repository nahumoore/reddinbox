import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateProblemEmbedding } from "@/utils/llm/openai-embedding";
import { identifyWebsiteProblem } from "@/utils/llm/openai-problem-analyzer";
import { scrapeWebsite } from "@/utils/website-scraper";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RedditMatch {
  id: string;
  title: string;
  content: string;
  author: string;
  ups: number;
  reddit_created_at: string;
  reddit_url: string;
  subreddit_name: string;
  similarity: number;
}

interface FindCustomersResponse {
  error?: string;
  redditPosts?: RedditMatch[];
}

const MAX_USES_PER_HOUR = 3;
const COOKIE_NAME = "reddit_customer_finder_usage";

export async function POST(
  request: NextRequest
): Promise<NextResponse<FindCustomersResponse>> {
  try {
    const { websiteUrl } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    // Step 0: Check if user has reached the maximum number of uses per hour
    const rateLimitCheck = await checkRateLimit();
    console.log("rateLimitCheck", rateLimitCheck);
    if (rateLimitCheck.exceeded) {
      return NextResponse.json(
        {
          error: `You have reached the maximum of ${MAX_USES_PER_HOUR} uses per hour. Please try again later.`,
        },
        { status: 429 }
      );
    }

    // Step 1: Scrape the website content
    const scrapedContent = await scrapeWebsite(websiteUrl);

    // Return early if scraping failed or no content was extracted
    if (scrapedContent.error || !scrapedContent.content) {
      return NextResponse.json(
        { error: "Unable to scrape website content" },
        { status: 400 }
      );
    }

    // Step 2: Analyze content with OpenAI to identify the problem
    const analysis = await identifyWebsiteProblem(scrapedContent.content);
    if (analysis.error) {
      return NextResponse.json(
        { error: `Failed to analyze website: ${analysis.error}` },
        { status: 500 }
      );
    }

    // Step 3: Embedding the problem statement
    let problemEmbedding: number[];
    try {
      problemEmbedding = await generateProblemEmbedding(
        analysis.problemStatement
      );
    } catch (error) {
      console.error("Failed to generate problem embedding:", error);
      return NextResponse.json(
        { error: "Failed to generate problem embedding" },
        { status: 500 }
      );
    }

    // Step 4: Find Reddit customers using vector similarity search
    const supabase = supabaseAdmin;
    const { data: redditMatches, error: matchError } = await supabase.rpc(
      "match_reddit_content",
      {
        query_embedding: `[${problemEmbedding.join(",")}]`,
        match_count: 10,
      }
    );

    if (matchError) {
      console.error("Failed to find matching Reddit posts:", matchError);
      return NextResponse.json(
        { error: "Failed to find matching Reddit posts" },
        { status: 500 }
      );
    }

    // Step 5: Update cookies with usage tracking
    await updateUsageCookie(rateLimitCheck.recentUsages);

    // Return the problem statement and matching Reddit posts
    return NextResponse.json({
      redditPosts: redditMatches || [],
    });
  } catch (error) {
    console.error("Find Reddit customers route error:", error);
    return NextResponse.json(
      { error: "Internal server error during website analysis" },
      { status: 500 }
    );
  }
}

async function checkRateLimit(): Promise<{
  exceeded: boolean;
  recentUsages: number[];
}> {
  const cookieStore = await cookies();
  const usageCookie = cookieStore.get(COOKIE_NAME);
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000; // 1 hour in milliseconds

  let recentUsages: number[] = [];
  if (usageCookie?.value) {
    try {
      const allUsages = JSON.parse(usageCookie.value) as number[];
      // Filter out timestamps older than 1 hour
      recentUsages = allUsages.filter((timestamp) => timestamp > oneHourAgo);
    } catch (error) {
      console.error("Failed to parse usage cookie:", error);
      // If parsing fails, start fresh
      recentUsages = [];
    }
  }

  return {
    exceeded: recentUsages.length >= MAX_USES_PER_HOUR,
    recentUsages,
  };
}

async function updateUsageCookie(recentUsages: number[]): Promise<void> {
  const cookieStore = await cookies();
  const now = Date.now();

  recentUsages.push(now);
  cookieStore.set(COOKIE_NAME, JSON.stringify(recentUsages), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
}
