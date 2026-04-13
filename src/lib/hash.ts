import { createHash } from "crypto";

/**
 * Build a canonical hash for deduplication.
 * hash(normalizedTitle + canonicalUrlHost + publishedDate)
 */
export function canonicalHash(
  title: string,
  url: string,
  publishedAt: Date | string
): string {
  const normTitle = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = url;
  }

  const dateStr =
    typeof publishedAt === "string"
      ? publishedAt.slice(0, 10)
      : publishedAt.toISOString().slice(0, 10);

  const payload = `${normTitle}|${host}|${dateStr}`;
  return createHash("sha256").update(payload).digest("hex");
}
