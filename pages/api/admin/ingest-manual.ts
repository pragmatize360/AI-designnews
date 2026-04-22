import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthorized } from "@/lib/auth";
import { runIngestion } from "@/lib/ingestion/run";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Optionally, support passing a single sourceId and/or mode
    const sourceId = req.body?.sourceId as string | undefined;
    const mode = (req.body?.mode as string | undefined) ?? "manual";
    const { runId, skipped } = await runIngestion(sourceId, mode);
    return res.status(200).json({ message: skipped ? "Ingestion already running" : "Manual ingestion started", runId, skipped });
  } catch (e) {
    console.error("Error triggering manual ingestion:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
