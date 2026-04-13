import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { scoreItem } from "@/lib/scoring";
import type { TrustTier } from "@prisma/client";

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
    const section = req.query.section as string | undefined;
    const type = req.query.type as string | undefined;
    const topic = req.query.topic as string | undefined;

    const where: Record<string, unknown> = {};

    if (section === "official") {
      where.source = { trustTier: "official_vendor" };
    } else if (section === "press") {
      where.source = { trustTier: { in: ["reputed_press", "research_university"] } };
    } else if (section === "creators") {
      where.source = { trustTier: "influencer" };
    }

    if (type) {
      where.type = type;
    }

    if (topic) {
      where.topics = { has: topic };
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          source: { select: { name: true, trustTier: true, type: true } },
          videoMeta: true,
          curations: { where: { pinned: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    // Score and sort items
    const scored = items.map((item) => ({
      ...item,
      score: scoreItem({
        publishedAt: item.publishedAt,
        trustTier: item.source.trustTier as TrustTier,
        metricsViews: item.metricsViews,
        metricsLikes: item.metricsLikes,
        topics: item.topics,
        type: item.type,
      }),
      pinned: item.curations.some((c) => c.pinned),
    }));

    // Pinned items first, then by score
    scored.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.score - a.score;
    });

    return res.status(200).json({
      items: scored,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("Error fetching items:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
