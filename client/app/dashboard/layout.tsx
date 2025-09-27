import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import {
  RedditAccount,
  RedditSubreddit,
  RedditUserInteraction,
  UserInfo,
  Website,
} from "@/types/db-schema";
import { redirect } from "next/navigation";

export default async function DashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const supabase = supabaseAdmin;
  const [{ data: userInfo }, { data: redditAccounts }, { data: websites }] =
    await Promise.all([
      supabase
        .from("user_info")
        .select("id, auth_user_id, onboarding_completed, name, email")
        .eq("auth_user_id", user.id)
        .single(),
      supabase
        .from("reddit_accounts")
        .select(
          `
        id,
        name,
        icon_img,
        snoovatar_img,
        created_utc,
        is_active,
        verified,
        total_karma,
        link_karma,
        comment_karma,
        coins,
        num_friends,
        has_verified_email,
        is_employee,
        is_moderator,
        is_gold,
        is_suspended,
        oauth_scopes,
        last_api_call,
        reddit_id
      `
        )
        .eq("user_id", user.id),
      supabase
        .from("websites")
        .select(
          "id, name, url, description, keywords, is_active, subreddit_reddit_ids"
        )
        .eq("user_id", user.id),
    ]);

  // COMPLETED ONBOARDING CHECK
  if (!userInfo?.onboarding_completed) {
    redirect("/onboarding");
  }

  // QUERY FROM ACTIVE WEBSITE
  const activeWebsite = websites?.find(
    (website) => website.is_active
  ) as Website;
  if (!activeWebsite) {
    redirect("/");
  }

  const [{ data: redditUserInteractions }, { data: subreddits }] =
    await Promise.all([
      supabase
        .from("reddit_user_interactions")
        .select(
          `
      id,
      interaction_type,
      interacted_with_reddit_username,
      original_reddit_post_id,
      our_interaction_content,
      our_interaction_reddit_id,
      status,
      created_at,
      updated_at,
      user_id,
      website_id,
      reddit_content_discovered:reddit_content_discovered_id (
        id,
        author,
        reddit_id,
        content,
        content_type,
        title,
        reddit_url,
        ups,
        downs,
        reddit_created_at,
        subreddit:subreddit_id (
          id,
          display_name_prefixed,
          title,
          subscribers,
          public_description
        )
      )
    `
        )
        .eq("user_id", user.id)
        .eq("website_id", activeWebsite.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reddit_subreddits")
        .select("id, display_name_prefixed")
        .in("id", activeWebsite.subreddit_reddit_ids || []),
    ]);

  return (
    <DashboardClientLayout
      userInfo={userInfo as unknown as UserInfo}
      redditAccounts={redditAccounts as unknown as RedditAccount[]}
      redditUserInteractions={
        redditUserInteractions as unknown as RedditUserInteraction[]
      }
      websites={websites as unknown as Website[]}
      subreddits={subreddits as unknown as RedditSubreddit[]}
    >
      {children}
    </DashboardClientLayout>
  );
}
