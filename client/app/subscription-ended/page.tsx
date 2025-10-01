import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubscriptionEndedPageClient from "./clientPage";

export default async function SubscriptionEndedPage() {
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
    .select("id, auth_user_id, subscription_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!userInfo) {
    redirect("/auth/login");
  }

  if (userInfo.subscription_status !== "stopped") {
    redirect("/dashboard");
  }

  return <SubscriptionEndedPageClient />;
}
