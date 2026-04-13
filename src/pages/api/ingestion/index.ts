import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthorized } from "@/lib/auth";
import { runIngestion } from "@/lib/ingestion/run";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const sourceId = req.body?.sourceId as string | undefined;
      const runId = await runIngestion(sourceId);
      return res.status(200).json({ message: "Ingestion started", runId });
    } catch (e) {
      console.error("Error triggering ingestion:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
