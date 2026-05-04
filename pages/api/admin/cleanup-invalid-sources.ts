import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

/**
 * POST /api/admin/cleanup-invalid-sources
 * Deletes all source rows whose `type` column contains a value not in the
 * SourceType enum (rss | html | api | youtube).
 * Uses a raw query so Prisma does not try to deserialize the bad rows.
 */
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
    // Use raw SQL — Prisma ORM cannot touch rows with invalid enum values
    const result = await prisma.$executeRaw`
      DELETE FROM "Source"
      WHERE "type"::text NOT IN ('rss', 'html', 'api', 'youtube')
    `;

    return res.status(200).json({
      message: `Deleted ${result} source(s) with invalid type`,
      deleted: result,
    });
  } catch (e) {
    console.error("[cleanup] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
