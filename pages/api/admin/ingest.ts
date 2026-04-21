import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isApiKeyAuthorized } from "@/lib/auth";
import { runIngestion, type IngestionMode } from "@/lib/ingestion/run";

/**
 * POST /api/admin/ingest
 *
 * Manually trigger the ingestion pipeline.
 * Requires Authorization: Bearer <ADMIN_API_KEY>.
 *
 * Body (JSON):
 *   - sourceId?: string  — limit ingestion to a single source
 *   - mode?: "hourly" | "daily"  — default "daily"
 *
 * Returns:
 *   { runId, stats, message }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isApiKeyAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sourceId = req.body?.sourceId as string | undefined;
    const mode = (req.body?.mode as IngestionMode | undefined) ?? "daily";

    const { runId, skipped } = await runIngestion(sourceId, mode);

    // Fetch the completed run record to include final stats in the response
    const run = await prisma.ingestionRun.findUnique({
      where: { id: runId },
    });

    return res.status(200).json({
      runId,
      stats: run?.stats ?? null,
      message: skipped
        ? "Ingestion already running — returning existing run"
        : "Ingestion completed",
    });
  } catch (e) {
    console.error("Error triggering ingestion:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
