import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { canonicalHash } from "../hash";
import { tagTopics } from "../topics";
import type { ParsedItem } from "./rss";

function resolveUrl(candidate: string | undefined | null, pageUrl: string): string | null {
  if (!candidate) return null;
  const value = candidate.trim();
  if (!value || value.startsWith("data:")) return null;

  try {
    return new URL(value, pageUrl).toString();
  } catch {
    return null;
  }
}

function fromSrcSet(srcset: string | undefined | null, pageUrl: string): string | null {
  if (!srcset) return null;
  const first = srcset
    .split(",")
    .map((s) => s.trim().split(" ")[0])
    .find(Boolean);
  return resolveUrl(first, pageUrl);
}

function extractElementThumbnail(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<AnyNode>,
  selectors: { thumbnail?: string },
  pageUrl: string,
  fallbackImage: string | null
): string | null {
  const selectorChain = [
    selectors.thumbnail,
    "figure img",
    "picture img",
    "img",
    "picture source",
  ].filter(Boolean) as string[];

  for (const selector of selectorChain) {
    const node = $el.find(selector).first();
    if (!node.length) continue;

    const src = node.attr("src") || node.attr("data-src") || node.attr("data-lazy-src");
    const srcset = node.attr("srcset") || node.attr("data-srcset");

    const normalizedSrc = resolveUrl(src, pageUrl);
    if (normalizedSrc) return normalizedSrc;

    const normalizedSet = fromSrcSet(srcset, pageUrl);
    if (normalizedSet) return normalizedSet;
  }

  const inlineStyle = $el.attr("style") || "";
  const match = inlineStyle.match(/background-image:\s*url\(([^)]+)\)/i);
  if (match?.[1]) {
    const raw = match[1].replace(/["']/g, "");
    const normalized = resolveUrl(raw, pageUrl);
    if (normalized) return normalized;
  }

  return fallbackImage;
}

/**
 * Fetch an HTML page and extract items using CSS selectors.
 * Used as a fallback when RSS is not available.
 *
 * @param pageUrl - The URL of the page to fetch
 * @param selectors - CSS selectors for extracting items
 */
export async function fetchHtml(
  pageUrl: string,
  selectors: {
    articleContainer: string;
    title: string;
    link: string;
    summary?: string;
    date?: string;
    thumbnail?: string;
  }
): Promise<ParsedItem[]> {
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "AI-NewsHub/1.0 (news aggregator; +https://github.com/pragmatize360/AI-designnews)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTML fetch failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const items: ParsedItem[] = [];
  const pageOgImage = resolveUrl(
    $("meta[property='og:image']").attr("content") ||
      $("meta[name='twitter:image']").attr("content"),
    pageUrl
  );

  $(selectors.articleContainer).each((_i, el) => {
    const $el = $(el);

    const title = $el.find(selectors.title).first().text().trim();
    let link = $el.find(selectors.link).first().attr("href") || "";

    if (!title || !link) return;

    link = resolveUrl(link, pageUrl) || link;

    const summary = selectors.summary
      ? $el.find(selectors.summary).first().text().trim().slice(0, 280) || null
      : null;

    const dateStr = selectors.date
      ? $el.find(selectors.date).first().text().trim()
      : null;
    const pubDate = dateStr ? new Date(dateStr) : new Date();
    // If parsing fails, use current date
    const publishedAt = isNaN(pubDate.getTime()) ? new Date() : pubDate;

    const thumbnail = extractElementThumbnail($, $el, selectors, pageUrl, pageOgImage);

    const topics = tagTopics(title, summary);

    items.push({
      title,
      url: link,
      publishedAt,
      author: null,
      summary,
      contentSnippet: summary,
      type: "article",
      topics,
      thumbnailUrl: thumbnail,
      canonicalHash: canonicalHash(title, link, publishedAt),
      language: "en",
      metricsViews: 0,
      metricsLikes: 0,
      rawPayload: { source: "html", pageUrl, title, link },
    });
  });

  return items;
}

/** Default HTML selectors for common blog layouts */
export const DEFAULT_HTML_SELECTORS = {
  articleContainer: "article, .post, .entry, .blog-item",
  title: "h2 a, h3 a, .title a, .entry-title a",
  link: "h2 a, h3 a, .title a, .entry-title a",
  summary: "p, .summary, .excerpt, .description",
  date: "time, .date, .published",
  thumbnail: "img",
};
