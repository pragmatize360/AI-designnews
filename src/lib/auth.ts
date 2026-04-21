import type { NextApiRequest } from "next";

/**
 * Simple admin token authentication.
 * Checks the Authorization header for a Bearer token matching ADMIN_TOKEN.
 */
export function isAdminAuthorized(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return false;
  return token === process.env.ADMIN_TOKEN;
}

/**
 * API key authentication for admin endpoints.
 * Checks the Authorization header for a Bearer token matching ADMIN_API_KEY.
 */
export function isApiKeyAuthorized(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return false;
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) return false;
  return token === apiKey;
}
