import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";
import { SOURCES } from "@/lib/seed-data";

interface SeedResult {
  created: string[];
  skipped: string[];
  totalInSeed: number;
  totalInDb: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SeedResult | { error: string }>
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const created: string[] = [];
    const skipped: string[] = [];

    for (const source of SOURCES) {
      const existing = await prisma.source.findFirst({
        where: { name: source.name },
      });

      if (existing) {
        skipped.push(source.name);
        continue;
      }

      await prisma.source.create({ data: source });
      created.push(source.name);
    }

    const totalInDb = await prisma.source.count();

    return res.status(200).json({
      created,
      skipped,
      totalInSeed: SOURCES.length,
      totalInDb,
    });
  } catch (e) {
    console.error("Seed error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
