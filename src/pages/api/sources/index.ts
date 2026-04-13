import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

const VALID_TYPES = ["rss", "html", "api", "youtube"];
const VALID_TIERS = ["official_vendor", "reputed_press", "research_university", "influencer"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
      const type = req.query.type as string | undefined;
      const trustTier = req.query.trustTier as string | undefined;
      const enabled = req.query.enabled as string | undefined;

      const where: Record<string, unknown> = {};
      if (type) where.type = type;
      if (trustTier) where.trustTier = trustTier;
      if (enabled !== undefined) where.enabled = enabled === "true";

      const [sources, total] = await Promise.all([
        prisma.source.findMany({
          where,
          orderBy: { name: "asc" },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            trustTier: true,
            enabled: true,
            tags: true,
            consecutiveFailures: true,
            degradedUntil: true,
            createdAt: true,
          },
        }),
        prisma.source.count({ where }),
      ]);

      return res.status(200).json({
        sources,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (e) {
      console.error("Error fetching sources:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { name, type, url, trustTier, enabled, tags, htmlSelector, channelId } = req.body;
      if (!name || !type || !url || !trustTier) {
        return res.status(400).json({ error: "name, type, url, and trustTier are required" });
      }
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` });
      }
      if (!VALID_TIERS.includes(trustTier)) {
        return res.status(400).json({ error: `trustTier must be one of: ${VALID_TIERS.join(", ")}` });
      }
      const source = await prisma.source.create({
        data: {
          name,
          type,
          url,
          trustTier,
          enabled: enabled !== false,
          tags: tags || [],
          htmlSelector: htmlSelector || null,
          channelId: channelId || null,
        },
      });
      return res.status(201).json(source);
    } catch (e) {
      console.error("Error creating source:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
