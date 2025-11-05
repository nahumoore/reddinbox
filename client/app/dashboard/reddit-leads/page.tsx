import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { RedditLeads } from "@/types/db-schema";
import RedditLeadsClient from "./clientPage";

export default async function RedditLeadsPage() {
  const supabaseAuth = await supabaseServer();

  // GET USER
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  // GET LEADS FOR USER
  const supabase = supabaseAdmin;
  const { data: leads } = (await supabase
    .from("reddit_leads")
    .select(
      "id, reddit_username, lead_score, lead_status, total_interactions_count, buying_signals, pain_points, conversation_summary, first_interaction_at, last_interaction_at, created_at, last_analyzed_at, marked_ready_at"
    )
    .eq("user_id", user!.id)
    .gte("lead_score", 50)
    .order("created_at", { ascending: false })) as {
    data: Partial<RedditLeads>[];
  };

  return <RedditLeadsClient serverLeads={leads} />;
}
