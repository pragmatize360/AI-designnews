import { fetchRss } from "./rss";
import type { ParsedItem } from "./rss";

/**
 * Fetch YouTube channel feed via the official RSS feed.
 * URL format: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 *
 * Returns items with type "video" and populated videoMeta.
 */
export async function fetchYouTube(channelId: string): Promise<ParsedItem[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const items = await fetchRss(feedUrl);

  return items.map((item) => {
    // Extract video ID from YouTube URL
    let videoId = "";
    try {
      const url = new URL(item.url);
      videoId = url.searchParams.get("v") || url.pathname.split("/").pop() || "";
    } catch {
      videoId = "";
    }

    return {
      ...item,
      type: "video" as const,
      thumbnailUrl:
        item.thumbnailUrl ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null),
      videoMeta: {
        channelName: "", // Will be populated from source name
        channelId,
        videoId,
        duration: null,
      },
    };
  });
}
