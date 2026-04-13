/**
 * Manual ingestion trigger script.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/run-ingestion.ts
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/run-ingestion.ts <sourceId>
 */

import { runIngestion } from "../src/lib/ingestion/run";

async function main() {
  const sourceId = process.argv[2] || undefined;

  console.log(
    sourceId
      ? `🚀 Running ingestion for source: ${sourceId}`
      : "🚀 Running full ingestion pipeline..."
  );

  const runId = await runIngestion(sourceId);
  console.log(`✅ Ingestion complete. Run ID: ${runId}`);
}

main()
  .catch((err) => {
    console.error("❌ Ingestion failed:", err);
    process.exit(1);
  })
  .finally(() => {
    // Allow Prisma to disconnect cleanly
    setTimeout(() => process.exit(0), 500);
  });
