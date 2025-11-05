import { classifyLeads } from "@/methods/generate-reddit-leads/classify-leads";
import { getTodaysPostedInteractions } from "@/methods/generate-reddit-leads/get-todays-posted-interactions";
import { groupLeadsPerWebsite } from "@/methods/generate-reddit-leads/group-leads-per-website";
import { insertClassifiedLeads } from "@/methods/generate-reddit-leads/insert-classified-leads";
import { updateInteractionsWithLeads } from "@/methods/generate-reddit-leads/update-interactions-with-leads";
import { SupabaseClient } from "@supabase/supabase-js";
import { fetchActiveUsers } from "../../methods/generate-reddit-leads/fetch-active-users";

export const generateRedditLeadsJob = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  // STEP 1: FETCH ACTIVE USERS
  const activeUsers = await fetchActiveUsers(supabase);
  console.log(`Processing ${activeUsers.length} active users...`);

  // STEP 2: GET UNPROCESSED TODAY'S INTERACTIONS
  const allInteractions = await getTodaysPostedInteractions({
    supabase,
    allUserIds: activeUsers.map((user) => user.auth_user_id),
    allWebsiteIds: activeUsers
      .map((user) => user.websites.map((website) => website.id))
      .flat(),
  });
  console.log(`Fetched ${allInteractions?.length || 0} total interactions`);

  // STEP 3: GROUP INTERACTIONS BY LEAD (REDDIT_USERNAME) PER WEBSITE
  const leadsPerWebsite = groupLeadsPerWebsite({
    interactions: allInteractions,
  });
  console.log(`Leads grouped from ${leadsPerWebsite?.length || 0} websites`);

  // STEP 4: CLASSIFY LEADS
  const classifiedLeads = await classifyLeads({
    leadsPerWebsite,
  });
  console.log(`Classified ${classifiedLeads.length} website lead groups`);

  // STEP 5: INSERT CLASSIFIED LEADS INTO DATABASE
  const leadIdMap = await insertClassifiedLeads({
    classifiedLeads,
    supabase,
  });

  // STEP 6: UPDATE INTERACTIONS WITH LEADS
  await updateInteractionsWithLeads({
    allInteractions,
    leadIdMap,
    supabase,
  });

  console.log("✅ Job completed successfully");
};
