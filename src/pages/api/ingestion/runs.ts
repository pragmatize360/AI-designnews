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
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const [runs, total] = await Promise.all([
      prisma.ingestionRun.findMany({
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ingestionRun.count(),
    ]);

    return res.status(200).json({
      runs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Error fetching ingestion runs:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
