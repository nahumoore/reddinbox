import { supabaseAdmin } from "@/lib/supabase/client";
import { createRedditUserInteractionsJob } from "./authority-feedback/create-reddit-user-interactions";
import { discoverRedditContentJob } from "./authority-feedback/discover-reddit-content";

const jobs = {
  discoverRedditContentJob,
  createRedditUserInteractionsJob,
};

async function startCronJobs() {
  console.log("🕒 Starting testing process...");
  const supabase = supabaseAdmin;

  await createRedditUserInteractionsJob({ supabase });

  console.log("🚀 The test is complete!");
}

// START TEST
startCronJobs();
