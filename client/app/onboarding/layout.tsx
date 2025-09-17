import OnboardingLayoutClientPage from "@/components/onboarding/OnboardingLayoutClientPage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { UserInfo } from "@/types/db-schema";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
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
  const { data: userInfo } = await supabase
    .from("user_info")
    .select("id, auth_user_id, onboarding_completed, name")
    .eq("auth_user_id", user.id)
    .single();

  if (userInfo?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <OnboardingLayoutClientPage userInfo={userInfo as UserInfo}>
      {children}
    </OnboardingLayoutClientPage>
  );
}
