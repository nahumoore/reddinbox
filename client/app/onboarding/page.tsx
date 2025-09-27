import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingClientPage from "./ClientPage";

export default async function OnboardingPage() {
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // CHECK REDDIT ACCOUNTS
  const supabase = supabaseAdmin;
  const { data: redditAccounts } = await supabase
    .from("reddit_accounts")
    .select("id")
    .eq("user_id", user.id);
  if (redditAccounts?.length && redditAccounts.length > 0) {
    redirect("/onboarding/completed");
  }

  return <OnboardingClientPage />;
}
