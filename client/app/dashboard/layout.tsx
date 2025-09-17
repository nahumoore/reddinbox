import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import {
  RedditAccount,
  RedditLead,
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
  const [
    { data: userInfo },
    { data: redditAccounts },
    { data: redditLeads },
    { data: websites },
  ] = await Promise.all([
    supabase
      .from("user_info")
      .select("onboarding_completed")
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
      .from("reddit_leads")
      .select(
        "id, content, content_type, lead_score, status, subreddit, reddit_author, reddit_created_at, reddit_url, ups, downs, contacted_at, created_at, user_id, website_id, ai_explanation"
      )
      .eq("user_id", user.id)
      .eq("status", "new")
      .order("lead_score", { ascending: false }),
    supabase
      .from("websites")
      .select("id, name, url, description, keywords, is_active")
      .eq("user_id", user.id),
  ]);

  // COMPLETED ONBOARDING CHECK
  if (!userInfo?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <DashboardClientLayout
      userInfo={userInfo as unknown as UserInfo}
      redditAccounts={redditAccounts as unknown as RedditAccount[]}
      redditLeads={redditLeads as unknown as RedditLead[]}
      websites={websites as unknown as Website[]}
    >
      {children}
    </DashboardClientLayout>
  );
}
