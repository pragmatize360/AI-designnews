import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { scoreItem } from "@/lib/scoring";
import {
  classifyContent,
  CONTENT_CATEGORIES,
  matchesContentCategory,
} from "@/lib/content-filter";
import type { TrustTier } from "@prisma/client";
import { applyPublicCors } from "@/lib/api/cors";

/**
 * focusArea → Prisma OR conditions mapping.
 * Each area maps to a combination of item topics and/or source trustTier/type/tags.
 */
const FOCUS_AREA_CONDITIONS: Record<string, Record<string, unknown>[]> = {
  research: [
    { topics: { hasSome: ["research", "ai safety", "machine learning", "large language models", "computer vision", "nlp", "arxiv"] } },
    { source: { trustTier: "research_university" } },
    { source: { tags: { hasSome: ["research", "academic", "arxiv", "paper"] } } },
  ],
  design: [
    { topics: { hasSome: ["design", "ux", "ui", "product design", "user experience", "interaction design", "typography", "accessibility"] } },
    { source: { tags: { hasSome: ["design", "ux", "ui", "figma", "product design"] } } },
  ],
  frontend: [
    { topics: { hasSome: ["frontend", "web development", "tooling", "javascript", "typescript", "css", "react", "nextjs", "open source"] } },
    { source: { tags: { hasSome: ["frontend", "tooling", "web development", "javascript", "css", "react"] } } },
  ],
  product: [
    { topics: { hasSome: ["product", "business", "industry", "startup", "saas", "enterprise", "roadmap"] } },
    { source: { tags: { hasSome: ["business", "industry", "product", "startup", "saas"] } } },
  ],
  creators: [
    { source: { type: "youtube" } },
    { source: { trustTier: "influencer" } },
    { type: "video" },
  ],
  podcasts: [
    { source: { tags: { hasSome: ["podcast", "newsletter", "audio"] } } },
    { source: { url: { contains: "podcast" } } },
    { source: { url: { contains: "feed" } } },
  ],
};

const FOCUS_AREAS = Object.keys(FOCUS_AREA_CONDITIONS);

const AVAILABLE_FILTERS = {
  sections: ["official", "press", "creators"],
  itemTypes: ["article", "video", "paper", "release"],
  contentCategories: CONTENT_CATEGORIES,
  focusAreas: FOCUS_AREAS,
  queryParams: ["page", "limit", "section", "type", "contentCategory", "topic", "sourceId", "search", "focusArea", "windowDays", "tier"],
};

/**
 * Trust tiers included in the default strict feed.
 * Pass `tier=all` to disable this gate.
 */
const DEFAULT_TRUST_TIERS = [
  "official_vendor",
  "reputed_press",
  "research_university",
  "influencer",
] as const;

/** Milliseconds in one day — used for the recency window calculation. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const windowDays = Math.max(1, parseInt(req.query.windowDays as string) || 180);
    const section = req.query.section as string | undefined;
    const type = req.query.type as string | undefined;
    const contentCategory = req.query.contentCategory as string | undefined;
    const topic = req.query.topic as string | undefined;
    const sourceId = req.query.sourceId as string | undefined;
    const search = req.query.search as string | undefined;
    const focusArea = req.query.focusArea as string | undefined;
    // tier=all disables the default trustTier restriction
    const tier = req.query.tier as string | undefined;

    // Recency window cutoff — default 180 days
    const cutoff = new Date(Date.now() - windowDays * MS_PER_DAY);

    // Build individual AND clauses so we can combine section, focusArea, and other
    // filters without overwriting each other.
    const andClauses: Record<string, unknown>[] = [
      // Items must fall within the recency window.
      // Fall back to createdAt only when publishedAt is absent.
      {
        OR: [
          { publishedAt: { gte: cutoff } },
          { AND: [{ publishedAt: null }, { createdAt: { gte: cutoff } }] },
        ],
      },
    ];

    // Default trustTier gate — strict 4-tier feed unless caller passes tier=all.
    if (tier !== "all" && !section) {
      andClauses.push({
        source: { trustTier: { in: [...DEFAULT_TRUST_TIERS] } },
      });
    }

    if (sourceId) {
      andClauses.push({ sourceId });
    }

    if (section === "official") {
      andClauses.push({ source: { trustTier: "official_vendor" } });
    } else if (section === "press") {
      andClauses.push({ source: { trustTier: { in: ["reputed_press", "research_university"] } } });
    } else if (section === "creators") {
      andClauses.push({ source: { trustTier: "influencer" } });
    }

    if (type) {
      andClauses.push({ type });
    }

    if (topic) {
      andClauses.push({ topics: { has: topic } });
    }

    if (search) {
      const q = search.trim();
      andClauses.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { topics: { has: q.toLowerCase() } },
        ],
      });
    }

    if (focusArea && FOCUS_AREA_CONDITIONS[focusArea]) {
      andClauses.push({ OR: FOCUS_AREA_CONDITIONS[focusArea] });
    }

    // Collapse into a single Prisma where object
    const where: Record<string, unknown> =
      andClauses.length === 0
        ? {}
        : andClauses.length === 1
        ? andClauses[0]
        : { AND: andClauses };

    // Get accurate total count from DB (before in-memory content filter)
    const totalDb = await prisma.item.count({ where });

    const items = await prisma.item.findMany({
      where,
      include: {
        source: { select: { name: true, trustTier: true, type: true, tags: true } },
        videoMeta: true,
        curations: { where: { pinned: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Content filter — remove spam / restricted / off-topic items.
    // Top official_vendor sources (tagged 'top') bypass the topic gate.
    const allowedItems = items.filter((item) => {
      const isTopOfficial =
        item.source.trustTier === "official_vendor" &&
        Array.isArray(item.source.tags) &&
        item.source.tags.includes("top");
      if (isTopOfficial) return true;

      const classification = classifyContent(item.title, item.summary, item.type);
      return (
        classification.allowed &&
        matchesContentCategory(item.title, item.summary, contentCategory)
      );
    });

    // Score and sort items
    const scored = allowedItems.map((item) => {
      const isTopOfficial =
        item.source.trustTier === "official_vendor" &&
        Array.isArray(item.source.tags) &&
        item.source.tags.includes("top");
      const classification = isTopOfficial
        ? { allowed: true, category: "design" as const }
        : classifyContent(item.title, item.summary, item.type);

      return {
      ...item,
      contentCategory: classification.category,
      score: scoreItem({
        publishedAt: item.publishedAt,
        trustTier: item.source.trustTier as TrustTier,
        metricsViews: item.metricsViews,
        metricsLikes: item.metricsLikes,
        topics: item.topics,
        type: item.type,
        title: item.title,
        summary: item.summary,
      }),
      pinned: item.curations.some((c) => c.pinned),
      };
    });

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
        // totalDb reflects the full DB count for the applied filters — use this
        // for "Load More" / page navigation. The actual items on this page may be
        // slightly fewer because of the in-memory content-quality filter.
        total: totalDb,
        totalPages: Math.ceil(totalDb / limit),
      },
      filters: AVAILABLE_FILTERS,
    });
  } catch (e) {
    console.error("Error fetching items:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
