import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
