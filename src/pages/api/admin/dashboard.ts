import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalItems,
      itemsLast24h,
      totalSources,
      enabledSources,
      recentRuns,
      failedRunsLast24h,
      duplicateRate,
    ] = await Promise.all([
      prisma.item.count(),
      prisma.item.count({ where: { createdAt: { gte: oneDayAgo } } }),
      prisma.source.count(),
      prisma.source.count({ where: { enabled: true } }),
      prisma.ingestionRun.findMany({
        orderBy: { startedAt: "desc" },
        take: 10,
      }),
      prisma.ingestionRun.count({
        where: {
          startedAt: { gte: oneDayAgo },
          status: "failed",
        },
      }),
      // Approximate duplicate rate from recent runs
      prisma.ingestionRun.findMany({
        where: { startedAt: { gte: oneDayAgo }, stats: { not: { equals: null } } },
        select: { stats: true },
        take: 20,
      }),
    ]);

    // Calculate duplicate rate from stats
    let totalFetched = 0;
    let totalDuplicates = 0;
    for (const run of duplicateRate) {
      const stats = run.stats as Record<string, number> | null;
      if (stats) {
        totalFetched += stats.total || 0;
        totalDuplicates += stats.duplicates || 0;
      }
    }
    const dupRate = totalFetched > 0 ? (totalDuplicates / totalFetched) * 100 : 0;

    // Degraded sources
    const degradedSources = await prisma.source.findMany({
      where: { degradedUntil: { gt: now } },
      select: { id: true, name: true, consecutiveFailures: true, degradedUntil: true },
    });

    return res.status(200).json({
      totalItems,
      itemsLast24h,
      totalSources,
      enabledSources,
      failedRunsLast24h,
      duplicateRate: Math.round(dupRate * 100) / 100,
      degradedSources,
      recentRuns,
    });
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
