import cron from "node-cron";
import { supabaseAdmin } from "../lib/supabase/client";
import { commentsCollection } from "./leads-discovery/lead-scoring";
import { postsCollection } from "./leads-discovery/posts-collection";

// CRON JOBS REGISTRY
const cronJobs = {
  postsCollection, // Collect posts from Reddit with keyword matching
  commentsCollection, // Collect comments from stored posts with keyword matching
} as const;

// CRON SCHEDULES
const cronSchedules = {
  postsCollection: "*/45 * * * *", // Every 45 minutes
  commentsCollection: "0 0 */1 * * *", // Every hour
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

  // Execute cron jobs immediately in development mode
  if (process.env.NODE_ENV === "dev") {
    console.log(
      "🧪 Development mode detected - executing all cron jobs immediately for testing..."
    );
    const cronJobsToExecute = ["postsCollection"];

    cronJobsToExecute.forEach(async (jobName) => {
      try {
        await executeCronJob(jobName as CronJobName);
      } catch (error) {
        console.error(`❌ Immediate execution of "${jobName}" failed:`, error);
      }
    });

    return;
  }

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
