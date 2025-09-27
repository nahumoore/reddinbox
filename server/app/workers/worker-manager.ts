import { SupabaseClient } from "@supabase/supabase-js";
import {
  getScheduledContentWorkerStatus,
  startScheduledContentWorker,
  stopScheduledContentWorker,
} from "./scheduled-content-worker";

interface WorkerStatus {
  name: string;
  isRunning: boolean;
  startedAt?: Date;
  lastError?: string;
  additionalInfo?: Record<string, any>;
}

interface WorkerManagerState {
  supabase: SupabaseClient;
  workerStatus: Map<string, WorkerStatus>;
  isShuttingDown: boolean;
  startTime: Date;
}

let managerState: WorkerManagerState = {
  supabase: null as any,
  workerStatus: new Map(),
  isShuttingDown: false,
  startTime: new Date(),
};

// WORKER REGISTRY WITH THEIR START/STOP FUNCTIONS
const workerRegistry = {
  "scheduled-content": {
    name: "Scheduled Content Worker",
    startFn: startScheduledContentWorker,
    stopFn: stopScheduledContentWorker,
    statusFn: getScheduledContentWorkerStatus,
  },
} as const;

// INITIALIZE WORKER MANAGER
export function initializeWorkerManager(supabase: SupabaseClient): void {
  managerState.supabase = supabase;
  managerState.startTime = new Date();

  // INITIALIZE STATUS TRACKING FOR ALL WORKERS
  for (const [workerKey, workerConfig] of Object.entries(workerRegistry)) {
    managerState.workerStatus.set(workerKey, {
      name: workerConfig.name,
      isRunning: false,
    });
  }
}

// START ALL WORKERS
export async function startAllWorkers(): Promise<void> {
  if (managerState.isShuttingDown) {
    console.log("⚠️ Cannot start workers during shutdown");
    return;
  }

  console.log("🚀 Starting all workers...");

  try {
    await startWorker("scheduled-content");
    console.log("✅ All workers started successfully");
  } catch (error) {
    console.error("❌ Failed to start all workers:", error);
    throw error;
  }
}

// START SPECIFIC WORKER
export async function startWorker(
  workerName: keyof typeof workerRegistry
): Promise<void> {
  if (managerState.isShuttingDown) {
    console.log(`⚠️ Cannot start worker ${workerName} during shutdown`);
    return;
  }

  const workerConfig = workerRegistry[workerName];
  if (!workerConfig) {
    throw new Error(`Worker ${workerName} not found`);
  }

  const status = managerState.workerStatus.get(workerName)!;
  if (status.isRunning) {
    console.log(`⚠️ Worker ${workerName} is already running`);
    return;
  }

  try {
    console.log(`🚀 Starting worker: ${status.name}`);

    await workerConfig.startFn(managerState.supabase);

    // UPDATE STATUS
    managerState.workerStatus.set(workerName, {
      ...status,
      isRunning: true,
      startedAt: new Date(),
      lastError: undefined,
    });

    console.log(`✅ Worker ${status.name} started successfully`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Failed to start worker ${status.name}:`, errorMessage);

    // UPDATE STATUS WITH ERROR
    managerState.workerStatus.set(workerName, {
      ...status,
      isRunning: false,
      lastError: errorMessage,
    });

    throw error;
  }
}

// STOP ALL WORKERS
export async function stopAllWorkers(): Promise<void> {
  console.log("🛑 Stopping all workers...");
  managerState.isShuttingDown = true;

  const stopPromises: Promise<void>[] = [];

  // STOP ALL WORKERS IN PARALLEL
  for (const workerName of Object.keys(workerRegistry)) {
    stopPromises.push(
      stopWorker(workerName as keyof typeof workerRegistry, false)
    );
  }

  try {
    await Promise.all(stopPromises);
    console.log("✅ All workers stopped successfully");
  } catch (error) {
    console.error("❌ Some workers failed to stop gracefully:", error);
  }
}

// STOP SPECIFIC WORKER
export async function stopWorker(
  workerName: keyof typeof workerRegistry,
  logIndividually: boolean = true
): Promise<void> {
  const workerConfig = workerRegistry[workerName];
  if (!workerConfig) {
    throw new Error(`Worker ${workerName} not found`);
  }

  const status = managerState.workerStatus.get(workerName)!;
  if (!status.isRunning) {
    if (logIndividually) {
      console.log(`⚠️ Worker ${workerName} is not running`);
    }
    return;
  }

  try {
    if (logIndividually) {
      console.log(`🛑 Stopping worker: ${status.name}`);
    }

    await workerConfig.stopFn();

    // UPDATE STATUS
    managerState.workerStatus.set(workerName, {
      ...status,
      isRunning: false,
      startedAt: undefined,
      lastError: undefined,
    });

    if (logIndividually) {
      console.log(`✅ Worker ${status.name} stopped successfully`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Failed to stop worker ${status.name}:`, errorMessage);

    // UPDATE STATUS WITH ERROR
    managerState.workerStatus.set(workerName, {
      ...status,
      lastError: errorMessage,
    });

    throw error;
  }
}

// GRACEFUL SHUTDOWN
export async function gracefulShutdownWorkers(): Promise<void> {
  console.log("🔄 Initiating graceful shutdown of worker manager...");

  try {
    await stopAllWorkers();
    console.log("✅ Worker manager shutdown completed");
  } catch (error) {
    console.error("❌ Worker manager shutdown encountered errors:", error);
    throw error;
  }
}
