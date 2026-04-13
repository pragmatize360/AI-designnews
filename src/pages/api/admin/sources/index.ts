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

  if (req.method === "GET") {
    try {
      const sources = await prisma.source.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { items: true } } },
      });
      return res.status(200).json(sources);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, type, url, trustTier, enabled, tags, htmlSelector, channelId } = req.body;
      if (!name || !type || !url || !trustTier) {
        return res.status(400).json({ error: "name, type, url, and trustTier are required" });
      }
      const source = await prisma.source.create({
        data: { name, type, url, trustTier, enabled: enabled !== false, tags: tags || [], htmlSelector, channelId },
      });
      return res.status(201).json(source);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
