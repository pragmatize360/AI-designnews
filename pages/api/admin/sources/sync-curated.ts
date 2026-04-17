import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

const VALID_TIERS = ["official_vendor", "reputed_press", "research_university", "influencer"] as const;
const VALID_TYPES = ["rss", "html", "api", "youtube"] as const;

type TrustTier = typeof VALID_TIERS[number];
type SourceType = typeof VALID_TYPES[number];

interface CuratedSourceEntry {
  name: string;
  url: string;
  type: string;
  trustTier: string;
  tags?: string[];
  priorityScore?: number;
  enabled?: boolean;
  channelId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "curated-sources.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Curated sources file not found at data/curated-sources.json" });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const entries: CuratedSourceEntry[] = JSON.parse(raw);

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: "Curated sources file is empty or not a valid JSON array" });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const skippedEntries: string[] = [];

    for (const entry of entries) {
      // Validate required fields
      if (!entry.name || !entry.url || !entry.type || !entry.trustTier) {
        skipped++;
        skippedEntries.push(`${entry.name || "unknown"}: missing required field (name, url, type, or trustTier)`);
        continue;
      }

      if (!VALID_TYPES.includes(entry.type as SourceType)) {
        skipped++;
        skippedEntries.push(`${entry.name}: invalid type "${entry.type}"`);
        continue;
      }

      if (!VALID_TIERS.includes(entry.trustTier as TrustTier)) {
        skipped++;
        skippedEntries.push(`${entry.name}: invalid trustTier "${entry.trustTier}"`);
        continue;
      }

      // Derive tags: ensure "top" is added for priorityScore === 5
      const baseTags: string[] = Array.isArray(entry.tags) ? entry.tags : [];
      const tags =
        entry.priorityScore === 5 && !baseTags.includes("top")
          ? [...baseTags, "top"]
          : baseTags;

      const enabled = entry.enabled !== false;

      try {
        const existing = await prisma.source.findFirst({
          where: { url: entry.url },
        });

        if (existing) {
          await prisma.source.update({
            where: { id: existing.id },
            data: {
              name: entry.name,
              type: entry.type as SourceType,
              trustTier: entry.trustTier as TrustTier,
              tags,
              enabled,
              // Preserve existing channelId only when the field is absent from the JSON entry.
              // An explicit null in the JSON will clear the stored value.
              channelId: entry.channelId !== undefined ? entry.channelId : existing.channelId,
            },
          });
          updated++;
        } else {
          await prisma.source.create({
            data: {
              name: entry.name,
              url: entry.url,
              type: entry.type as SourceType,
              trustTier: entry.trustTier as TrustTier,
              tags,
              enabled,
              channelId: entry.channelId ?? null,
            },
          });
          created++;
        }
      } catch (e) {
        skipped++;
        const msg = e instanceof Error ? e.message : String(e);
        skippedEntries.push(`${entry.name}: ${msg}`);
      }
    }

    // CURATED_ONLY mode: disable sources not present in the curated pack
    let disabled = 0;
    if (process.env.CURATED_ONLY === "true") {
      const curatedUrls = entries
        .filter((e) => e.url)
        .map((e) => e.url);

      const result = await prisma.source.updateMany({
        where: {
          url: { notIn: curatedUrls },
          enabled: true,
        },
        data: { enabled: false },
      });
      disabled = result.count;
    }

    return res.status(200).json({
      created,
      updated,
      disabled,
      skipped,
      total: created + updated,
      ...(skippedEntries.length > 0 && { skippedDetails: skippedEntries }),
    });
  } catch (e) {
    console.error("[sync-curated] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
