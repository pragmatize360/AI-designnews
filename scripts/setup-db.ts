/**
 * Database initialization script.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/setup-db.ts
 *
 * Steps:
 *   1. Runs `prisma db push` to sync the schema
 *   2. Runs the seed script to populate default sources
 */

import { execSync } from "child_process";

function run(cmd: string) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  console.log("📦 Setting up AI News Hub database...\n");

  // 1. Generate Prisma client
  run("npx prisma generate");

  // 2. Push schema to database (creates tables if they don't exist)
  run("npx prisma db push");

  // 3. Seed default sources
  run('npx ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts');

  console.log("\n🎉 Database setup complete!");
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
