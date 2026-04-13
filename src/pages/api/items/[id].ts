import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing item ID" });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        source: { select: { name: true, trustTier: true, type: true, url: true } },
        videoMeta: true,
        curations: true,
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Find related items (same source or overlapping topics)
    const related = await prisma.item.findMany({
      where: {
        id: { not: item.id },
        OR: [
          { sourceId: item.sourceId },
          ...(item.topics.length > 0
            ? [{ topics: { hasSome: item.topics } }]
            : []),
        ],
      },
      include: {
        source: { select: { name: true, trustTier: true, type: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    });

    return res.status(200).json({ item, related });
  } catch (e) {
    console.error("Error fetching item:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
