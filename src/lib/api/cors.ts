import type { NextApiRequest, NextApiResponse } from "next";

/**
 * CORS helper for public read-only endpoints consumed by browser clients (e.g. Figma plugins).
 */
export function applyPublicCors(req: NextApiRequest, res: NextApiResponse): boolean {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}
