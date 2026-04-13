import prisma from "../prisma";
import { canonicalHash } from "../hash";

/**
 * Check whether an item already exists in the database by its canonical hash.
 *
 * The canonical hash is computed from normalised title + URL host + publish date
 * using SHA-256 (see `src/lib/hash.ts`).
 *
 * @returns `true` if a duplicate already exists, `false` otherwise.
 */
export async function isDuplicate(
  title: string,
  url: string,
  publishedAt: Date | string
): Promise<boolean> {
  const hash = canonicalHash(title, url, publishedAt);
  const existing = await prisma.item.findUnique({
    where: { canonicalHash: hash },
    select: { id: true },
  });
  return existing !== null;
}

/**
 * Build a canonical hash for the given item fields.
 * Re-exported here for convenience so ingestion callers only need one import.
 */
export { canonicalHash } from "../hash";
