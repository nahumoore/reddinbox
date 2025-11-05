import { SupabaseClient } from "@supabase/supabase-js";

export interface Interaction {
  id: string;
  user_id: string;
  website_id: string;
  interacted_with_reddit_username: string;
  interaction_type: string;
  reddit_content_discovered_id: string;
  thread_context: string;
  our_interaction_content: string;
  created_at: string;
  reddit_leads: {
    id: string;
    lead_score: number;
    conversation_summary: string;
    buying_signals: string;
    pain_points: string;
    total_interactions_count: number;
    first_interaction_at: string;
    last_interaction_at: string;
  };
  reddit_content_discovered: {
    id: string;
    title: string;
    content: string;
    author: string;
  };
  reddit_accounts: {
    id: string;
    name: string;
  };
  websites: {
    id: string;
    name: string;
    keywords: string[];
    description: string;
  };
}

// HELPER: GET TODAY'S POSTED INTERACTIONS FOR A USER/WEBSITE
export const getTodaysPostedInteractions = async ({
  supabase,
  allUserIds,
  allWebsiteIds,
}: {
  supabase: SupabaseClient;
  allUserIds: string[];
  allWebsiteIds: string[];
}): Promise<Interaction[]> => {
  // GET TODAY'S DATE AT MIDNIGHT
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISOString = today.toISOString();

  // FETCH POSTED INTERACTIONS FROM TODAY
  const { data: allInteractions, error: interactionsError } = await supabase
    .from("reddit_user_interactions")
    .select(
      `
      id,
      user_id,
      website_id,
      interacted_with_reddit_username,
      interaction_type,
      reddit_content_discovered_id,
      thread_context,
      our_interaction_content,
      created_at,
      reddit_leads(
        id,
        lead_score,
        conversation_summary,
        buying_signals,
        pain_points,
        total_interactions_count,
        first_interaction_at,
        last_interaction_at
      ),
      reddit_content_discovered(
        id,
        title,
        content,
        author
      ),
      reddit_accounts(
        id,
        name
      ),
      websites(
        id,
        name,
        keywords,
        description
      )
      `
    )
    .in("user_id", allUserIds)
    .in("website_id", allWebsiteIds)
    .eq("status", "posted")
    .gte("created_at", todayISOString)
    .neq("interacted_with_reddit_username", "[deleted]")
    .is("reddit_lead", null);

  if (interactionsError) {
    console.error("Error fetching interactions:", interactionsError);
    return [];
  }

  return allInteractions as unknown as Interaction[];
};
