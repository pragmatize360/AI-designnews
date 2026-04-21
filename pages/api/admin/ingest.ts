import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthorized } from "@/lib/auth";
import { runIngestion } from "@/lib/ingestion/run";
import type { IngestionMode } from "@/lib/ingestion/run";

interface IngestRequest {
  sourceId?: string;
  mode?: IngestionMode;
}

interface IngestResponse {
  success: boolean;
  runId: string;
  skipped: boolean;
  stats?: {
    total: number;
    inserted: number;
    duplicates: number;
    filtered: number;
    errors: number;
  };
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IngestResponse>
) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({
      success: false,
      runId: "",
      skipped: false,
      message: "Unauthorized: missing or invalid API key",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      runId: "",
      skipped: false,
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    const { sourceId, mode = "daily" } = req.body as IngestRequest;

    // Validate mode
    if (mode !== "hourly" && mode !== "daily") {
      return res.status(400).json({
        success: false,
        runId: "",
        skipped: false,
        message: "Invalid mode. Use 'hourly' or 'daily'.",
      });
    }

    console.log(
      `[admin/ingest] Triggering ${mode} ingestion${sourceId ? ` for source ${sourceId}` : ""}`
    );

    const result = await runIngestion(sourceId, mode);

    return res.status(200).json({
      success: !result.skipped,
      runId: result.runId,
      skipped: result.skipped,
      message: result.skipped
        ? `Ingestion run already in progress (${result.runId}). Skipping.`
        : `Ingestion triggered successfully (${result.runId}). Check status in admin dashboard.`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/ingest] Error:", msg);
    return res.status(500).json({
      success: false,
      runId: "",
      skipped: false,
      message: `Internal server error: ${msg}`,
    });
  }
}
