import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PlanUpgradedPageClient from "./clientPage";

export default async function PlanUpgradedPage() {
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
    .select("id, auth_user_id, stripe_customer_id")
    .eq("auth_user_id", user.id)
    .single();

  if (!userInfo) {
    redirect("/auth/login");
  }

  if (!userInfo.stripe_customer_id) {
    redirect("/dashboard");
  }

  return <PlanUpgradedPageClient />;
}
