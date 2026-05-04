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

  // GET — list all sources
  if (req.method === "GET") {
    const sources = await prisma.source.findMany({
      orderBy: [{ enabled: "desc" }, { name: "asc" }],
      include: { _count: { select: { items: true } } },
    });
    return res.status(200).json(sources);
  }

  // POST — create a new source
  if (req.method === "POST") {
    const { name, url, type, trustTier, enabled, tags, htmlSelector, channelId } = req.body;
    if (!name || !url || !type || !trustTier) {
      return res.status(400).json({ error: "name, url, type, and trustTier are required" });
    }
    const source = await prisma.source.create({
      data: {
        name,
        url,
        type,
        trustTier,
        enabled: enabled !== false,
        tags: Array.isArray(tags) ? tags : [],
        htmlSelector: htmlSelector || null,
        channelId: channelId || null,
      },
    });
    return res.status(201).json(source);
  }

  return res.status(405).json({ error: "Method not allowed" });
}