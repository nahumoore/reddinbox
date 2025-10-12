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
        .select(
          "id, auth_user_id, onboarding_completed, name, email, stripe_customer_id, subscription_status, subscription_period_end_at, subscription_period_started_at"
        )
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
        reddit_id,
        public_description
      `
        )
        .eq("user_id", user.id)
        .eq("is_active", true),
      supabase
        .from("websites")
        .select(
          "id, name, url, description, keywords, is_active, subreddit_reddit_ids, authority_feed_options"
        )
        .eq("user_id", user.id),
    ]);

  // VALIDATION CHECKS
  if (!userInfo?.onboarding_completed) {
    redirect("/onboarding");
  } else if (userInfo?.subscription_status === "stopped") {
    redirect("/subscription-ended");
  } else if (redditAccounts?.length === 0) {
    redirect("/no-reddit-account-active");
  }

  // GET ACTIVE WEBSITE
  const activeWebsite = websites?.find(
    (website) => website.is_active
  ) as Website;
  if (!activeWebsite) {
    redirect("/");
  }

  // GET ACTIVE REDDIT ACCOUNT
  const activeRedditAccount = redditAccounts?.find(
    (account) => account.is_active
  ) as RedditAccount;
  if (!activeRedditAccount) {
    redirect("/no-reddit-account-active");
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
      original_reddit_parent_id,
      our_interaction_content,
      our_interaction_reddit_id,
      status,
      created_at,
      updated_at,
      user_id,
      website_id,
      thread_context,
      similarity_score,
      reddit_content_discovered:reddit_content_discovered_id (
        id,
        author,
        reddit_id,
        content,
        summarized_content,
        title,
        reddit_url,
        ups,
        downs,
        content_category,
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
        .eq("reddit_account_id", activeRedditAccount?.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reddit_subreddits")
        .select(
          "id, display_name_prefixed, title, public_description, community_icon, subscribers, created_utc"
        )
        .eq("is_active", true),
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
