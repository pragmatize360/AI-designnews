import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";
import { runIngestion } from "@/lib/ingestion/run";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // GET /api/ingestion — return latest ingestion status
    try {
      const latestRun = await prisma.ingestionRun.findFirst({
        orderBy: { startedAt: "desc" },
      });

      const [totalSources, enabledSources, totalItems] = await Promise.all([
        prisma.source.count(),
        prisma.source.count({ where: { enabled: true } }),
        prisma.item.count(),
      ]);

      return res.status(200).json({
        lastRun: latestRun
          ? {
              id: latestRun.id,
              status: latestRun.status,
              startedAt: latestRun.startedAt,
              finishedAt: latestRun.finishedAt,
              stats: latestRun.stats,
              errors: latestRun.errors,
            }
          : null,
        totalSources,
        enabledSources,
        totalItems,
      });
    } catch (e) {
      console.error("Error fetching ingestion status:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

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
