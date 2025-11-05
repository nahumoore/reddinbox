import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LeadDetailsClient from "./clientPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetails({ params }: Props) {
  const p = await params;
  const id = (await p.id) as string;

  // CHECK USER
  const supabaseUser = await supabaseServer();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return notFound();
  }

  // GET INTERACTIONS
  const supabase = supabaseAdmin;
  const { data: interactions } = await supabase
    .from("reddit_user_interactions")
    .select("*")
    .eq("lead_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <LeadDetailsClient id={id} />;
}
