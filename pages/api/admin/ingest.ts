import type { NextApiRequest, NextApiResponse } from "next";
import { runIngestion, type IngestionMode } from "@/lib/ingestion/run";

/**
 * POST /api/admin/ingest — manually trigger ingestion via browser, Make, or automation.
 * - Pass the admin token via "x-api-key" header, "Authorization" header, or ?key= in query.
 * - Supports CORS (preflight and browser call).
 * - Handles JSON and text/plain POST bodies.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS preflight support
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    return res.status(200).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Accept admin token via header or query param
  const headerToken =
    (typeof req.headers["x-api-key"] === "string"
      ? req.headers["x-api-key"]
      : Array.isArray(req.headers["x-api-key"])
      ? req.headers["x-api-key"][0]
      : undefined) ||
    (typeof req.headers.authorization === "string"
      ? req.headers.authorization.replace(/^Bearer /, "")
      : undefined);

  const queryToken =
    typeof req.query.api_key === "string"
      ? req.query.api_key
      : typeof req.query.key === "string"
      ? req.query.key
      : typeof req.query.token === "string"
      ? req.query.token
      : undefined;

  const token = headerToken || queryToken;
  if (token !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Robustly parse string or object body
  let body: any = req.body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  }

  try {
    const sourceId = body?.sourceId as string | undefined;
    // Safe IngestionMode union, defaulting to "manual"
    const mode = (body?.mode as IngestionMode | undefined) ?? "manual";
    const { runId, skipped } = await runIngestion(sourceId, mode);
    return res.status(200).json({
      message: skipped ? "Ingestion already running" : "Manual ingestion started",
      runId,
      skipped,
    });
  } catch (e) {
    console.error("Error triggering manual ingestion:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
