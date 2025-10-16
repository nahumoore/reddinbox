import { supabaseAdmin } from "@/lib/supabase/client";
import { checkNewComments } from "./authority-feedback/check-new-comments";
import { createRedditUserInteractionsJob } from "./authority-feedback/create-reddit-user-interactions";
import { discoverRedditContentJob } from "./authority-feedback/discover-reddit-content";

const jobs = {
  discoverRedditContentJob,
  createRedditUserInteractionsJob,
  checkNewComments,
};

async function startCronJobs() {
  console.log("🕒 Starting testing process...");
  const supabase = supabaseAdmin;

  await discoverRedditContentJob({ supabase });

  console.log("🚀 The test is complete!");
}

// START TEST
startCronJobs();
