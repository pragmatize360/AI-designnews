import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { classifyContent } from "@/lib/content-filter";
import { applyPublicCors } from "@/lib/api/cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (applyPublicCors(req, res)) {
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const q = (req.query.q as string || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Missing search query parameter 'q'" });
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

  try {
    const where = {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { summary: { contains: q, mode: "insensitive" as const } },
        { topics: { has: q.toLowerCase() } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          source: { select: { name: true, trustTier: true, type: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    // Remove spam / restricted / off-topic items from search results
    const allowedItems = items.filter((item) =>
      classifyContent(item.title, item.summary).allowed
    );

    return res.status(200).json({
      items: allowedItems,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Error searching items:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
