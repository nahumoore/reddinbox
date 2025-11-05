import { supabaseAdmin } from "@/lib/supabase/client";
import { checkNewComments } from "./authority-feedback/check-new-comments";
import { createRedditUserInteractionsJob } from "./authority-feedback/create-reddit-user-interactions";
import { discoverRedditContentJob } from "./authority-feedback/discover-reddit-content";
import { generateRedditLeadsJob } from "./generate-reddit-leads/generate-reddit-leads";

const jobs = {
  discoverRedditContentJob,
  createRedditUserInteractionsJob,
  checkNewComments,
  generateRedditLeadsJob,
};

async function startCronJobs() {
  console.log("🕒 Starting testing process...");
  const supabase = supabaseAdmin;

  await generateRedditLeadsJob({ supabase });

  console.log("🚀 The test is complete!");
}

// START TEST
startCronJobs();
