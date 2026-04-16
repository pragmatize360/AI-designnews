import prisma from "../prisma";
import { fetchRss, type ParsedItem } from "./rss";
import { fetchHtml, DEFAULT_HTML_SELECTORS } from "./html";
import { fetchYouTube } from "./youtube";
import { classifyContent } from "../content-filter";
import type { Source, SourceType } from "@prisma/client";

interface RunStats {
  total: number;
  inserted: number;
  duplicates: number;
  filtered: number;
  errors: number;
}

const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

function extractYouTubeId(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.match(YOUTUBE_ID_RE);
  return match?.[1] || null;
}

function enrichYouTubeMetadata(source: Source, item: ParsedItem): ParsedItem {
  if (item.videoMeta?.videoId) {
    return {
      ...item,
      type: "video",
      thumbnailUrl:
        item.thumbnailUrl || `https://i.ytimg.com/vi/${item.videoMeta.videoId}/hqdefault.jpg`,
      videoMeta: {
        ...item.videoMeta,
        channelName: item.videoMeta.channelName || source.name,
      },
    };
  }

  const videoId =
    extractYouTubeId(item.url) ||
    extractYouTubeId(item.summary) ||
    extractYouTubeId(item.contentSnippet);

  if (!videoId) {
    // For youtube sources, always force type=video even when video ID is not detected,
    // so items are never accidentally stored as articles.
    if (source.type === "youtube") {
      return {
        ...item,
        type: "video",
        videoMeta: item.videoMeta ?? {
          channelName: source.name,
          channelId: source.channelId || extractChannelId(source.url),
          videoId: "",
          duration: null,
        },
      };
    }
    return item;
  }

  return {
    ...item,
    type: "video",
    thumbnailUrl: item.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    videoMeta: {
      channelName: source.name,
      channelId: source.channelId || extractChannelId(source.url),
      videoId,
      duration: null,
    },
  };
}

/**
 * Run the full ingestion pipeline for all enabled sources, or a single source.
 */
export async function runIngestion(sourceId?: string): Promise<string> {
  const run = await prisma.ingestionRun.create({
    data: {
      status: "running",
      sourceId: sourceId || null,
    },
  });

  const stats: RunStats = { total: 0, inserted: 0, duplicates: 0, filtered: 0, errors: 0 };
  const errors: Array<{ source: string; error: string }> = [];

  try {
    // Get enabled sources, skip degraded ones
    const where: Record<string, unknown> = {
      enabled: true,
      OR: [
        { degradedUntil: null },
        { degradedUntil: { lt: new Date() } },
      ],
    };
    if (sourceId) {
      where.id = sourceId;
      // When manually triggered, ignore degraded status
      delete where.OR;
    }

    const sources = await prisma.source.findMany({ where });

    for (const source of sources) {
      try {
        const fetchedItems = await fetchItemsForSource(source);
        const items = fetchedItems.map((item) => enrichYouTubeMetadata(source, item));
        stats.total += items.length;

        for (const item of items) {
          // Content relevance + spam filter
          const filter = classifyContent(item.title, item.summary);
          if (!filter.allowed) {
            stats.filtered++;
            console.log(`[filter] Skipping "${item.title.slice(0, 80)}": ${filter.reason}`);
            continue;
          }

          try {
            await upsertItem(source, item);
            stats.inserted++;
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg.includes("Unique constraint")) {
              stats.duplicates++;
            } else {
              stats.errors++;
              errors.push({ source: source.name, error: msg });
            }
          }
        }

        // Reset consecutive failures on success
        if (source.consecutiveFailures > 0) {
          await prisma.source.update({
            where: { id: source.id },
            data: { consecutiveFailures: 0, degradedUntil: null },
          });
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        stats.errors++;
        errors.push({ source: source.name, error: msg });

        // Track consecutive failures
        const newFailCount = source.consecutiveFailures + 1;
        const updateData: Record<string, unknown> = {
          consecutiveFailures: newFailCount,
        };
        // If > 3 consecutive failures, degrade for 24h
        if (newFailCount > 3) {
          updateData.degradedUntil = new Date(
            Date.now() + 24 * 60 * 60 * 1000
          );
        }
        await prisma.source.update({
          where: { id: source.id },
          data: updateData,
        });
      }
    }

    const status =
      stats.errors > 0
        ? stats.inserted > 0
          ? "partial"
          : "failed"
        : "success";

    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        status,
        stats: JSON.parse(JSON.stringify(stats)),
        errors: errors.length > 0 ? JSON.parse(JSON.stringify(errors)) : undefined,
      },
    });

    return run.id;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        status: "failed",
        stats: JSON.parse(JSON.stringify(stats)),
        errors: JSON.parse(JSON.stringify([{ source: "pipeline", error: msg }])),
      },
    });
    return run.id;
  }
}

async function fetchItemsForSource(source: Source): Promise<ParsedItem[]> {
  const type = source.type as SourceType;

  switch (type) {
    case "rss":
      return fetchRss(source.url);

    case "youtube": {
      const channelId = source.channelId || extractChannelId(source.url);
      if (!channelId) throw new Error("No channel ID configured");
      const items = await fetchYouTube(channelId);
      // Populate channel name from source
      return items.map((item) => ({
        ...item,
        videoMeta: item.videoMeta
          ? { ...item.videoMeta, channelName: source.name }
          : undefined,
      }));
    }

    case "html": {
      let selectors = DEFAULT_HTML_SELECTORS;
      if (source.htmlSelector) {
        try {
          selectors = {
            ...DEFAULT_HTML_SELECTORS,
            ...JSON.parse(source.htmlSelector),
          };
        } catch {
          // Use defaults
        }
      }
      return fetchHtml(source.url, selectors);
    }

    case "api":
      // Generic API fetching — treat as RSS for now
      return fetchRss(source.url);

    default:
      throw new Error(`Unknown source type: ${type}`);
  }
}

function extractChannelId(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get("channel_id") || null;
  } catch {
    return null;
  }
}

async function upsertItem(source: Source, item: ParsedItem): Promise<void> {
  // Check for existing item by canonical hash
  const existing = await prisma.item.findUnique({
    where: { canonicalHash: item.canonicalHash },
    include: { videoMeta: true },
  });

  if (existing) {
    // Update fields that may arrive later (metrics, thumbnails, video metadata).
    const updateData: Record<string, unknown> = {};
    if (
      item.metricsViews !== existing.metricsViews ||
      item.metricsLikes !== existing.metricsLikes
    ) {
      updateData.metricsViews = item.metricsViews;
      updateData.metricsLikes = item.metricsLikes;
    }

    if (!existing.thumbnailUrl && item.thumbnailUrl) {
      updateData.thumbnailUrl = item.thumbnailUrl;
    }

    if (existing.type !== "video" && item.type === "video") {
      updateData.type = "video";
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.item.update({
        where: { id: existing.id },
        data: updateData,
      });
    }

    if (item.videoMeta?.videoId) {
      await prisma.videoMeta.upsert({
        where: { itemId: existing.id },
        create: {
          itemId: existing.id,
          channelName: item.videoMeta.channelName,
          channelId: item.videoMeta.channelId,
          videoId: item.videoMeta.videoId,
          duration: item.videoMeta.duration,
        },
        update: {
          channelName: item.videoMeta.channelName,
          channelId: item.videoMeta.channelId,
          videoId: item.videoMeta.videoId,
          duration: item.videoMeta.duration,
        },
      });
    }
    throw new Error("Unique constraint: duplicate item");
  }

  const created = await prisma.item.create({
    data: {
      sourceId: source.id,
      title: item.title,
      url: item.url,
      publishedAt: item.publishedAt,
      author: item.author,
      summary: item.summary,
      contentSnippet: item.contentSnippet,
      type: item.type,
      topics: item.topics,
      thumbnailUrl: item.thumbnailUrl,
      canonicalHash: item.canonicalHash,
      language: item.language,
      metricsViews: item.metricsViews,
      metricsLikes: item.metricsLikes,
      rawPayload: item.rawPayload ? JSON.parse(JSON.stringify(item.rawPayload)) : undefined,
    },
  });

  // Create video metadata if present
  if (item.videoMeta) {
    await prisma.videoMeta.create({
      data: {
        itemId: created.id,
        channelName: item.videoMeta.channelName,
        channelId: item.videoMeta.channelId,
        videoId: item.videoMeta.videoId,
        duration: item.videoMeta.duration,
      },
    });
  }
}
