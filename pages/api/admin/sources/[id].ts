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

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing source ID" });
  }

  if (req.method === "GET") {
    try {
      const source = await prisma.source.findUnique({
        where: { id },
        include: { _count: { select: { items: true } } },
      });
      if (!source) return res.status(404).json({ error: "Source not found" });
      return res.status(200).json(source);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const source = await prisma.source.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json(source);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.source.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
