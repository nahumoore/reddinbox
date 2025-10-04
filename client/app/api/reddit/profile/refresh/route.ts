import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { getValidRedditToken } from "@/utils/reddit/reddit-access-token";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // CHECK USER
    const supabaseAuth = await supabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // GET VALID REDDIT TOKEN
    const tokenResult = await getValidRedditToken();

    if (!tokenResult.success || !tokenResult.redditToken) {
      return NextResponse.json(
        { error: "Failed to get Reddit token" },
        { status: 401 }
      );
    }

    // FETCH USER DATA FROM REDDIT
    const userResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenResult.redditToken}`,
        "User-Agent": "Reddinbox/1.0",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data from Reddit" },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();

    if (userData.error) {
      return NextResponse.json(
        { error: `Reddit API error: ${userData.error}` },
        { status: 400 }
      );
    }

    const { public_description, ...subredditInfo } = userData.subreddit;

    // UPDATE REDDIT ACCOUNT IN DATABASE
    const supabase = supabaseAdmin;
    const { data: updatedAccount, error: updateError } = await supabase
      .from("reddit_accounts")
      .update({
        created_utc: userData.created_utc || null,
        comment_karma: userData.comment_karma || null,
        link_karma: userData.link_karma || null,
        total_karma: userData.total_karma || null,
        is_gold: userData.is_gold || null,
        is_moderator: userData.is_moderator || null,
        is_employee: userData.is_employee || null,
        has_verified_email: userData.has_verified_email || null,
        icon_img: userData.icon_img || null,
        snoovatar_img: userData.snoovatar_img || null,
        verified: userData.verified || null,
        is_suspended: userData.is_suspended || null,
        coins: userData.coins || null,
        num_friends: userData.num_friends || null,
        subreddit: subredditInfo || null,
        public_description: public_description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("reddit_id", userData.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update Reddit account:", updateError);
      return NextResponse.json(
        { error: "Failed to update Reddit account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAccount });
  } catch (error) {
    console.error("Unexpected error in refresh profile:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
