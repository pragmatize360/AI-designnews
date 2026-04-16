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
    const existingSources = await prisma.source.findMany({
      select: { name: true },
    });
    const existingNames = new Set(existingSources.map((s) => s.name));

    const toCreate = SOURCES.filter((s) => !existingNames.has(s.name));
    const skipped = SOURCES.filter((s) => existingNames.has(s.name)).map(
      (s) => s.name
    );

    if (toCreate.length > 0) {
      await prisma.source.createMany({ data: toCreate });
    }

    const totalInDb = await prisma.source.count();

    return res.status(200).json({
      created: toCreate.map((s) => s.name),
      skipped,
      totalInSeed: SOURCES.length,
      totalInDb,
    });
  } catch (e) {
    console.error("Seed error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
