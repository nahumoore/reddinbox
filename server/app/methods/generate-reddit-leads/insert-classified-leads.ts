import { SupabaseClient } from "@supabase/supabase-js";
import { LeadPerWebsiteClassified } from "./classify-leads";

// BULK INSERT OR UPDATE CLASSIFIED LEADS INTO DATABASE
export const insertClassifiedLeads = async ({
  classifiedLeads,
  supabase,
}: {
  classifiedLeads: LeadPerWebsiteClassified[];
  supabase: SupabaseClient;
}): Promise<Map<string, string>> => {
  // CREATE MAP TO STORE COMPOSITE KEY -> LEAD ID
  const leadIdMap = new Map<string, string>();

  // FLATTEN ALL LEADS FROM ALL WEBSITES INTO SINGLE ARRAY
  const allLeadsToInsert = classifiedLeads.flatMap((websiteData) =>
    websiteData.leads.map((lead) => {
      // CALCULATE INTERACTION STATISTICS FROM COMMENT DATES
      const interactionTimestamps = lead.interactions.flatMap((interaction) =>
        interaction.comments.map((comment) => new Date(comment.date).getTime())
      );
      const firstInteractionAt = new Date(
        Math.min(...interactionTimestamps)
      ).toISOString();
      const lastInteractionAt = new Date(
        Math.max(...interactionTimestamps)
      ).toISOString();
      const totalInteractionsCount = lead.interactions.length;

      // BUILD INSERT OBJECT
      return {
        user_id: websiteData.user_id,
        website_id: websiteData.website_id,
        reddit_username: lead.reddit_username,
        lead_score: lead.lead_score,
        lead_status: "new" as const,
        buying_signals: lead.buying_signals,
        pain_points: lead.pain_points,
        conversation_summary: lead.conversation_summary,
        total_interactions_count: totalInteractionsCount,
        first_interaction_at: firstInteractionAt,
        last_interaction_at: lastInteractionAt,
        last_analyzed_at: new Date().toISOString(),
      };
    })
  );

  // EXIT EARLY IF NO LEADS TO INSERT
  if (allLeadsToInsert.length === 0) {
    console.log("⚠️ No leads to insert");
    return leadIdMap;
  }

  // UPSERT LEADS INTO DATABASE (UPDATE IF EXISTS, INSERT IF NEW)
  const { data: insertedLeads, error: insertError } = await supabase
    .from("reddit_leads")
    .upsert(allLeadsToInsert, {
      onConflict: "user_id,website_id,reddit_username",
      ignoreDuplicates: false,
    })
    .select("id, user_id, website_id, reddit_username");

  // HANDLE INSERT ERROR
  if (insertError) {
    console.error("❌ Error inserting leads:", insertError);
    throw insertError;
  }

  // BUILD MAP OF COMPOSITE KEY -> LEAD ID
  if (insertedLeads) {
    insertedLeads.forEach((lead) => {
      const compositeKey = `${lead.user_id}|${lead.website_id}|${lead.reddit_username}`;
      leadIdMap.set(compositeKey, lead.id);
    });
    console.log(`✅ Successfully inserted/updated ${insertedLeads.length} leads`);
  }

  return leadIdMap;
};
