import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { supabaseAdmin } from "./lib/supabase/client";
import { authenticateRequest } from "./middleware/auth";
import { corsMiddleware } from "./middleware/cors";
import {
  gracefulShutdownWorkers,
  initializeWorkerManager,
  startAllWorkers,
} from "./workers/worker-manager";

dotenv.config();

// CREATE EXPRESS APPLICATION AND HTTP SERVER
const app = express();
const server = createServer(app);

// INITIALIZE WORKER MANAGER
initializeWorkerManager(supabaseAdmin);

// GLOBAL MIDDLEWARE SETUP
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API ROUTES SETUP
app.use("/api", authenticateRequest);

// START SERVER
const PORT = process.env.PORT || 4001;

server.listen(PORT, async () => {
  console.log("---------------------------------------------");
  console.log("🚀 Reddinbox Server started successfully!");
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log("---------------------------------------------");

  // START WORKERS AFTER SERVER IS RUNNING
  try {
    await startAllWorkers();
    console.log("✅ All workers initialized successfully");
  } catch (error) {
    console.error("❌ Failed to start workers:", error);
    // DON'T EXIT - SERVER CAN STILL FUNCTION WITHOUT WORKERS
  }
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  try {
    await gracefulShutdownWorkers();
    console.log("✅ Workers shutdown completed");
  } catch (error) {
    console.error("❌ Error during worker shutdown:", error);
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  try {
    await gracefulShutdownWorkers();
    console.log("✅ Workers shutdown completed");
  } catch (error) {
    console.error("❌ Error during worker shutdown:", error);
  }
  process.exit(0);
});
