import type { RedditUserProfile } from "@/types/reddit";
import { getValidRedditToken } from "@/utils/reddit/reddit-access-token";
import { redditCallout } from "@/utils/reddit/reddit-callout";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  // GET REDDIT TOKEN
  const { redditToken, success, error } = await getValidRedditToken();
  if (!success) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  // GET USERNAME FROM QUERY PARAMS
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username parameter is required" },
      { status: 400 }
    );
  }

  try {
    // FETCH USER PROFILE FROM REDDIT API
    const result = await redditCallout<any>(
      `https://www.reddit.com/user/${username}/about.json`
    );

    if (!result.success) {
      if (result.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: result.error || "Failed to fetch user profile" },
        { status: result.status }
      );
    }

    const rawResponse = result.data;

    // Extract required fields from Reddit response
    const userData = rawResponse.data;
    const userProfile: RedditUserProfile = {
      name: userData.name,
      icon_img: userData.icon_img || userData.snoovatar_img || "",
      total_karma: userData.total_karma || 0,
      created_utc: userData.created_utc,
      verified: userData.verified || false,
      has_verified_email: userData.has_verified_email || false,
      public_description: userData.subreddit.public_description || "",
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching Reddit user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
};
