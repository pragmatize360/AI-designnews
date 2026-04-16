import type { NextApiRequest, NextApiResponse } from "next";
import { runIngestion } from "@/lib/ingestion/run";

/**
 * GET /api/cron/ingest-daily
 *
 * Full daily ingestion sweep: processes all enabled sources once per day.
 *
 * Protected by CRON_SECRET (passed as the `secret` query parameter or via the
 * `Authorization: Bearer <secret>` header).
 *
 * Schedule (vercel.json): 15 2 * * *  (daily at 02:15 UTC)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify CRON_SECRET — support both query param and Bearer header
  const secret =
    (req.query.secret as string | undefined) ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { runId, skipped } = await runIngestion(undefined, "daily");
    return res.status(200).json({ mode: "daily", runId, skipped });
  } catch (e) {
    console.error("[cron] ingest-daily error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
