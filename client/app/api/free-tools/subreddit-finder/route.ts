import { findRelevantSubreddits } from "@/utils/llm/openai-subreddit-finder";
import { scrapeWebsite } from "@/utils/website-scraper";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Subreddit {
  id: string;
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  activeUsers: number;
  createdAt: Date;
  relevanceScore: number;
  activityLevel: "low" | "medium" | "high" | "very-high";
  subredditUrl: string;
  category?: string;
}

interface FindSubredditsResponse {
  error?: string;
  subreddits?: Subreddit[];
}

const MAX_USES_PER_HOUR = 3;
const COOKIE_NAME = "subreddit_finder_usage";

export async function POST(
  request: NextRequest
): Promise<NextResponse<FindSubredditsResponse>> {
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

    // Step 2: Analyze content with OpenAI to find relevant subreddits
    const analysis = await findRelevantSubreddits(scrapedContent.content);
    if (analysis.error) {
      return NextResponse.json(
        { error: `Failed to analyze website: ${analysis.error}` },
        { status: 500 }
      );
    }

    // Step 3: Transform the data to match frontend expectations
    const subredditsWithIds: Subreddit[] = analysis.subreddits.map(
      (subreddit, index) => ({
        id: `${index + 1}`,
        name: subreddit.name,
        displayName: subreddit.displayName,
        description: subreddit.description,
        subscribers: subreddit.subscribers,
        activeUsers: subreddit.activeUsers,
        createdAt: new Date(subreddit.createdAt),
        relevanceScore: subreddit.relevanceScore,
        activityLevel: subreddit.activityLevel,
        subredditUrl: subreddit.subredditUrl,
        category: subreddit.category,
      })
    );

    // Step 4: Update cookies with usage tracking
    await updateUsageCookie(rateLimitCheck.recentUsages);

    // Return the subreddits
    return NextResponse.json({
      subreddits: subredditsWithIds,
    });
  } catch (error) {
    console.error("Find subreddits route error:", error);
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
