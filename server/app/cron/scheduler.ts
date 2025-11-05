import cron from "node-cron";
import { supabaseAdmin } from "../lib/supabase/client";
import { checkNewComments } from "./authority-feedback/check-new-comments";
import { discoverRedditContentJob } from "./authority-feedback/discover-reddit-content";
import { generateRedditLeadsJob } from "./authority-feedback/generate-reddit-leads";
import { checkSubscriptions } from "./check-subscriptions/check-subscriptions";
import { collectFeedback } from "./collect-feedback/collect-feedback";

// CRON JOBS REGISTRY
const cronJobs = {
  discoverRedditContentJob, // Collect content from Reddit and answer comments
  checkNewComments, // Check for new comments
  checkSubscriptions, // Check and update expired subscriptions
  collectFeedback, // Collect user feedback from new users
  generateRedditLeadsJob, // Generate leads from Reddit
} as const;

// CRON SCHEDULES
const cronSchedules = {
  discoverRedditContentJob: "0 0 */1 * * *", // Every hour
  checkNewComments: "0 0 */1 * * *", // Every hour
  generateRedditLeadsJob: "0 0 */1 * * *", // Every hour
  checkSubscriptions: "0 0 0 * * *", // Every day at midnight UTC
  collectFeedback: "0 0 */6 * * *", // Every 6 hours
} as const;

/**
 * EXECUTE CRON JOB BY NAME
 */
type CronJobName = keyof typeof cronJobs;
async function executeCronJob(jobName: CronJobName) {
  const job = cronJobs[jobName];

  console.log(
    `🚀 Executing cron job: ${jobName} at ${new Date().toISOString()}`
  );

  try {
    const result = await job({ supabase: supabaseAdmin });
    console.log(
      `🏁 Cron job "${jobName}" completed at ${new Date().toISOString()}`
    );
    return result;
  } catch (error) {
    console.error(
      `❌ Cron job "${jobName}" failed at ${new Date().toISOString()}:`,
      error
    );
    throw error;
  }
}

/**
 * START ALL CRON JOBS
 */
function startCronJobs() {
  console.log("🕒 Starting cron scheduler...");

  Object.entries(cronSchedules).forEach(([jobName, schedule]) => {
    cron.schedule(
      schedule,
      async () => {
        try {
          await executeCronJob(jobName as CronJobName);
        } catch (error) {
          console.error(`❌ Scheduled job "${jobName}" failed:`, error);
        }
      },
      {
        timezone: "UTC",
      }
    );

    console.log(`✅ Scheduled "${jobName}"`);
  });

  console.log("🚀 All cron jobs are scheduled and running!");
}

// START SCHEDULER
startCronJobs();

// KEEP PROCESS ALIVE
process.on("SIGINT", () => {
  console.log("🛑 Shutting down cron scheduler...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("🛑 Shutting down cron scheduler...");
  process.exit(0);
});
