import prisma from "../prisma";
import { fetchRss, type ParsedItem } from "./rss";
import { fetchHtml, DEFAULT_HTML_SELECTORS } from "./html";
import { fetchYouTube } from "./youtube";
import type { Source, SourceType } from "@prisma/client";

interface RunStats {
  total: number;
  inserted: number;
  duplicates: number;
  errors: number;
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

  const startTime = Date.now();
  const stats: RunStats = { total: 0, inserted: 0, duplicates: 0, errors: 0 };
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
        const items = await fetchItemsForSource(source);
        stats.total += items.length;

        for (const item of items) {
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
  });

  if (existing) {
    // Update metrics if changed
    if (
      item.metricsViews !== existing.metricsViews ||
      item.metricsLikes !== existing.metricsLikes
    ) {
      await prisma.item.update({
        where: { id: existing.id },
        data: {
          metricsViews: item.metricsViews,
          metricsLikes: item.metricsLikes,
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
