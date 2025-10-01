import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NoRedditAccountActiveClientPage from "./clientPage";

export default async function NoRedditAccountActivePage() {
  const supabaseAuth = await supabaseServer();

  // CHECK USER
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // CHECK USER INFO
  const supabase = supabaseAdmin;
  const { data: userInfo } = await supabase
    .from("user_info")
    .select("id, auth_user_id, onboarding_completed")
    .eq("auth_user_id", user.id)
    .single();

  if (!userInfo) {
    redirect("/auth/login");
  }

  // IF NOT COMPLETED ONBOARDING, REDIRECT
  if (!userInfo.onboarding_completed) {
    redirect("/onboarding");
  }

  // CHECK IF USER HAS A WEBSITE
  const { data: websites } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user.id);

  if (!websites || websites.length === 0) {
    redirect("/onboarding");
  }

  // CHECK IF USER HAS ACTIVE REDDIT ACCOUNT
  const { data: redditAccounts } = await supabase
    .from("reddit_accounts")
    .select("id, is_active")
    .eq("user_id", user.id);

  if (redditAccounts && redditAccounts.length > 0) {
    const hasActiveAccount = redditAccounts.some(
      (account) => account.is_active
    );
    if (hasActiveAccount) {
      redirect("/dashboard");
    }
  }

  return <NoRedditAccountActiveClientPage />;
}
