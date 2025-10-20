import { SubredditData } from "@/types/reddit";
import { analyzeWebsiteContent } from "@/utils/llm/openai-analyzer";
import { fetchMultipleSubreddits } from "@/utils/reddit/fetch-subreddit";
import { scrapeWebsite } from "@/utils/website-scraper";
import { NextRequest, NextResponse } from "next/server";

interface AnalyzeSiteResponse {
  error?: string;
  subreddits?: SubredditData[];
  keywordsToMonitor?: string[];
  companyDescription?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeSiteResponse>> {
  try {
    const { websiteUrl } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    // Step 1: Scrape the website content
    const scrapedContent = await scrapeWebsite(websiteUrl);
    if (scrapedContent.error) {
      return NextResponse.json(
        { error: `Failed to scrape website: ${scrapedContent.error}` },
        { status: 400 }
      );
    }

    // Step 2: Analyze content with OpenAI to get description and keywords
    const analysis = await analyzeWebsiteContent(scrapedContent.content);
    if (analysis.error) {
      return NextResponse.json(
        { error: `Failed to analyze website: ${analysis.error}` },
        { status: 500 }
      );
    }

    // Step 3: Fetch all recommended subreddits in parallel
    const subreddits = await fetchMultipleSubreddits(
      analysis.recommendedSubreddits
    );

    // Return the complete analysis with subreddit data
    return NextResponse.json({
      websiteName: analysis.websiteName,
      keywordsToMonitor: analysis.keywords,
      companyDescription: analysis.companyDescription,
      targetAudience: analysis.targetAudience,
      expertise: analysis.expertise,
      subreddits: subreddits,
    });
  } catch (error) {
    console.error("Website analysis route error:", error);
    return NextResponse.json(
      { error: "Internal server error during website analysis" },
      { status: 500 }
    );
  }
}
