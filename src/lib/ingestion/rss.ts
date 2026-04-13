import RssParser from "rss-parser";
import { canonicalHash } from "../hash";
import { tagTopics } from "../topics";
import type { ItemType } from "@prisma/client";

const parser = new RssParser({
  timeout: 15000,
  headers: {
    "User-Agent": "AI-NewsHub/1.0 (RSS aggregator; +https://github.com/pragmatize360/AI-designnews)",
  },
});

export interface ParsedItem {
  title: string;
  url: string;
  publishedAt: Date;
  author: string | null;
  summary: string | null;
  contentSnippet: string | null;
  type: ItemType;
  topics: string[];
  thumbnailUrl: string | null;
  canonicalHash: string;
  language: string;
  metricsViews: number;
  metricsLikes: number;
  rawPayload: Record<string, unknown>;
  // YouTube-specific
  videoMeta?: {
    channelName: string;
    channelId: string;
    videoId: string;
    duration: string | null;
  };
}

function truncate(text: string | undefined | null, max: number): string | null {
  if (!text) return null;
  const clean = text.replace(/<[^>]*>/g, "").trim();
  return clean.length > max ? clean.slice(0, max - 3) + "..." : clean;
}

function extractThumbnail(item: RssParser.Item): string | null {
  const media = (item as Record<string, unknown>)["media:thumbnail"] as
    | { $?: { url?: string } }
    | undefined;
  if (media?.$?.url) return media.$.url;

  const group = (item as Record<string, unknown>)["media:group"] as
    | { "media:thumbnail"?: Array<{ $?: { url?: string } }> }
    | undefined;
  if (group?.["media:thumbnail"]?.[0]?.$?.url) return group["media:thumbnail"][0].$.url;

  const enclosure = item.enclosure;
  if (enclosure?.url && enclosure.type?.startsWith("image")) return enclosure.url;

  return null;
}

/**
 * Fetch and parse an RSS/Atom feed URL, returning normalized items.
 */
export async function fetchRss(feedUrl: string): Promise<ParsedItem[]> {
  const feed = await parser.parseURL(feedUrl);
  const items: ParsedItem[] = [];

  for (const entry of feed.items || []) {
    const title = (entry.title || "").trim();
    const link = entry.link || "";
    if (!title || !link) continue;

    const pubDate = entry.pubDate
      ? new Date(entry.pubDate)
      : entry.isoDate
        ? new Date(entry.isoDate)
        : new Date();

    const summary = truncate(entry.contentSnippet || entry.content, 280);
    const snippet = truncate(entry.content, 500);
    const topics = tagTopics(title, summary);
    const thumbnail = extractThumbnail(entry);

    items.push({
      title,
      url: link,
      publishedAt: pubDate,
      author: entry.creator || entry.author || null,
      summary,
      contentSnippet: snippet,
      type: "article",
      topics,
      thumbnailUrl: thumbnail,
      canonicalHash: canonicalHash(title, link, pubDate),
      language: feed.language || "en",
      metricsViews: 0,
      metricsLikes: 0,
      rawPayload: entry as unknown as Record<string, unknown>,
    });
  }

  return items;
}
