import prisma from "../prisma";

export interface IngestionStatusResult {
  success: boolean;
  updatedAt: Date;
  /** Total number of items currently stored in the database (system-wide). */
  totalItems: number;
}

/**
 * Retrieve the latest ingestion status/stats from Supabase (via Prisma) and
 * return a normalized health summary suitable for admin dashboards and monitors.
 *
 * This function reads the completed IngestionRun record identified by `runId`
 * and combines it with the current total item count so callers can track:
 *   - Whether the run succeeded (status "success" or "partial")
 *   - The timestamp at which the run finished (last run time)
 *   - The total number of items currently in the database
 *
 * Callable from Vercel Functions or Supabase Edge Functions.
 *
 * @param runId - The IngestionRun ID to look up.
 * @returns { success, updatedAt, totalItems }
 */
export async function updateIngestionStatus(
  runId: string
): Promise<IngestionStatusResult> {
  const [run, totalItems] = await Promise.all([
    prisma.ingestionRun.findUnique({
      where: { id: runId },
    }),
    prisma.item.count(),
  ]);

  if (!run) {
    throw new Error(`IngestionRun not found: ${runId}`);
  }

  const success = run.status === "success" || run.status === "partial";
  const updatedAt = run.finishedAt ?? run.startedAt;

  return { success, updatedAt, totalItems };
}
