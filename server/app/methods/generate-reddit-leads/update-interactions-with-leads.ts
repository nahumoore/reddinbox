import { SupabaseClient } from "@supabase/supabase-js";
import { Interaction } from "./get-todays-posted-interactions";

// UPDATE INTERACTIONS TO LINK THEM WITH THEIR CORRESPONDING LEADS
export const updateInteractionsWithLeads = async ({
  allInteractions,
  leadIdMap,
  supabase,
}: {
  allInteractions: Interaction[];
  leadIdMap: Map<string, string>;
  supabase: SupabaseClient;
}): Promise<void> => {
  // BUILD ARRAY OF INTERACTION IDS WITH THEIR CORRESPONDING LEAD IDS
  const updates: { id: string; leadId: string }[] = [];

  for (const interaction of allInteractions) {
    // BUILD COMPOSITE KEY TO MATCH WITH LEAD ID MAP
    const compositeKey = `${interaction.user_id}|${interaction.website_id}|${interaction.interacted_with_reddit_username}`;

    // GET LEAD ID FROM MAP
    const leadId = leadIdMap.get(compositeKey);

    // IF LEAD ID EXISTS, ADD TO UPDATES ARRAY
    if (leadId) {
      updates.push({
        id: interaction.id,
        leadId: leadId,
      });
    }
  }

  // EXIT EARLY IF NO UPDATES NEEDED
  if (updates.length === 0) {
    console.log("⚠️ No interactions to update");
    return;
  }

  // UPDATE INTERACTIONS IN BATCHES (SUPABASE DOESN'T SUPPORT BULK UPDATE BY ID)
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from("reddit_user_interactions")
      .update({ reddit_lead: update.leadId })
      .eq("id", update.id);

    if (error) {
      console.error(`❌ Error updating interaction ${update.id}:`, error);
      errorCount++;
    } else {
      successCount++;
    }
  }

  // LOG RESULTS
  console.log(
    `✅ Successfully updated ${successCount}/${updates.length} interactions with lead references`
  );
  if (errorCount > 0) {
    console.log(`⚠️ Failed to update ${errorCount} interactions`);
  }
};
