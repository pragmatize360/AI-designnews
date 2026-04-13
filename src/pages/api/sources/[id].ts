import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

const VALID_TYPES = ["rss", "html", "api", "youtube"];
const VALID_TIERS = ["official_vendor", "reputed_press", "research_university", "influencer"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing source ID" });
  }

  if (req.method === "GET") {
    try {
      const source = await prisma.source.findUnique({
        where: { id },
        include: { _count: { select: { items: true } } },
      });
      if (!source) return res.status(404).json({ error: "Source not found" });
      return res.status(200).json(source);
    } catch (e) {
      console.error("Error fetching source:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "PUT") {
    try {
      const { name, type, url, trustTier, enabled, tags, htmlSelector, channelId } = req.body;
      const data: Record<string, unknown> = {};
      if (name !== undefined) data.name = name;
      if (type !== undefined) {
        if (!VALID_TYPES.includes(type)) {
          return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` });
        }
        data.type = type;
      }
      if (url !== undefined) data.url = url;
      if (trustTier !== undefined) {
        if (!VALID_TIERS.includes(trustTier)) {
          return res.status(400).json({ error: `trustTier must be one of: ${VALID_TIERS.join(", ")}` });
        }
        data.trustTier = trustTier;
      }
      if (enabled !== undefined) data.enabled = enabled;
      if (tags !== undefined) data.tags = tags;
      if (htmlSelector !== undefined) data.htmlSelector = htmlSelector;
      if (channelId !== undefined) data.channelId = channelId;

      const source = await prisma.source.update({
        where: { id },
        data,
      });
      return res.status(200).json(source);
    } catch (e) {
      console.error("Error updating source:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.source.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error("Error deleting source:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
