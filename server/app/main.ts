import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { authenticateRequest } from "./middleware/auth";
import { corsMiddleware } from "./middleware/cors";
import { checkNewComments } from "./routes/reddit/check-new-comments";

dotenv.config();

// CREATE EXPRESS APPLICATION AND HTTP SERVER
const app = express();
const server = createServer(app);

// GLOBAL MIDDLEWARE SETUP
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API ROUTES SETUP
app.use("/api", authenticateRequest);
app.use("/api/reddit/check-new-comments", checkNewComments);

// START SERVER
const PORT = process.env.PORT || 4001;

server.listen(PORT, async () => {
  console.log("---------------------------------------------");
  console.log("🚀 Reddinbox Server started successfully!");
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log("---------------------------------------------");
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  process.exit(0);
});
