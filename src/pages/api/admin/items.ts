import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";
import { canonicalHash } from "@/lib/hash";
import { tagTopics } from "@/lib/topics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { title, url, summary, type, topics, sourceId, thumbnailUrl } = req.body;
      if (!title || !url) {
        return res.status(400).json({ error: "title and url are required" });
      }

      const now = new Date();
      const hash = canonicalHash(title, url, now);
      const autoTopics = topics && topics.length > 0 ? topics : tagTopics(title, summary);

      const item = await prisma.item.create({
        data: {
          sourceId: sourceId || null,
          title,
          url,
          publishedAt: now,
          summary: summary?.slice(0, 280) || null,
          type: type || "article",
          topics: autoTopics,
          thumbnailUrl: thumbnailUrl || null,
          canonicalHash: hash,
          rawPayload: { manual: true },
        },
      });

      return res.status(201).json(item);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
