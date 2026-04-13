import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const curations = await prisma.manualCuration.findMany({
        include: { item: { select: { title: true, url: true, type: true } } },
        orderBy: { priority: "desc" },
      });
      return res.status(200).json(curations);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { itemId, pinned, note, priority, expiresAt } = req.body;
      if (!itemId) {
        return res.status(400).json({ error: "itemId is required" });
      }
      const curation = await prisma.manualCuration.create({
        data: {
          itemId,
          pinned: pinned || false,
          note,
          priority: priority || 0,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });
      return res.status(201).json(curation);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id is required" });
      await prisma.manualCuration.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
