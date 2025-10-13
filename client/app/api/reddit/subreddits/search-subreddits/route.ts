import { SubredditData } from "@/types/reddit";
import { redditCallout } from "@/utils/reddit/reddit-callout";
import { NextRequest, NextResponse } from "next/server";

interface RedditSubreddit {
  id: string;
  display_name: string;
  display_name_prefixed: string;
  title: string;
  header_title?: string;
  primary_color?: string;
  subscribers: number;
  public_description: string;
  community_icon?: string;
  icon_img?: string;
  url: string;
  banner_background_image: string;
  description: string;
  lang: string;
}

interface RedditSearchResponse {
  data: {
    children: Array<{
      data: RedditSubreddit;
    }>;
  };
}

export const runtime = "edge";
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ subreddits: [] });
    }

    const searchUrl = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(
      query.trim()
    )}&limit=20&sort=relevance`;

    const result = await redditCallout<RedditSearchResponse>(searchUrl, {
      useOAuth: true, // Use OAuth to bypass IP blocking
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch from Reddit API");
    }

    const data = result.data!;

    const subreddits = data.data.children
      .map((child) => {
        const subreddit = child.data;
        return {
          id: subreddit.id,
          display_name_prefixed: subreddit.display_name_prefixed,
          title: subreddit.title,
          primary_color: subreddit.primary_color,
          subscribers: subreddit.subscribers,
          public_description: subreddit.public_description,
          community_icon: subreddit.community_icon,
          banner_background_image: subreddit.banner_background_image,
          description: subreddit.description,
          lang: subreddit.lang,
        } as SubredditData;
      })
      .slice(0, 6);

    return NextResponse.json({ subreddits });
  } catch (error) {
    console.error("Error searching subreddits:", error);
    return NextResponse.json(
      { error: "Failed to search subreddits" },
      { status: 500 }
    );
  }
}
