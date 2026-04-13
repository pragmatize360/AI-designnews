import { INGESTION } from "../constants";
import { runIngestion } from "./run";

let timer: ReturnType<typeof setInterval> | null = null;

/**
 * Start the ingestion scheduler.
 * Runs the full pipeline immediately, then every `INGESTION.RUN_INTERVAL_MS`
 * (default 2 hours).
 *
 * This is designed for long-running Node processes (e.g. a custom server).
 * On Vercel, use a cron-triggered API route instead (`POST /api/ingestion`).
 */
export function startScheduler(): void {
  if (timer) {
    console.warn("[scheduler] Already running – ignoring duplicate start");
    return;
  }

  console.log(
    `[scheduler] Starting ingestion scheduler (every ${INGESTION.RUN_INTERVAL_MS / 60_000} min)`
  );

  // Kick off the first run immediately
  runIngestion().catch((err) =>
    console.error("[scheduler] Initial run failed:", err)
  );

  timer = setInterval(() => {
    console.log("[scheduler] Triggering scheduled ingestion run");
    runIngestion().catch((err) =>
      console.error("[scheduler] Scheduled run failed:", err)
    );
  }, INGESTION.RUN_INTERVAL_MS);
}

/**
 * Stop the scheduler (e.g. for graceful shutdown).
 */
export function stopScheduler(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
    console.log("[scheduler] Stopped");
  }
}
