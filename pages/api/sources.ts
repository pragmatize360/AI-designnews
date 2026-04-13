import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sources = await prisma.source.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        trustTier: true,
        enabled: true,
        tags: true,
        consecutiveFailures: true,
        degradedUntil: true,
        createdAt: true,
      },
    });
    return res.status(200).json(sources);
  } catch (e) {
    console.error("Error fetching sources:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
