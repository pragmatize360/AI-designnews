import { PrismaClient } from "@prisma/client";
import { SOURCES } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AI News Hub database...\n");

  for (const source of SOURCES) {
    const existing = await prisma.source.findFirst({
      where: { name: source.name },
    });

    if (existing) {
      console.log(`  ⏭  Skipping "${source.name}" (already exists)`);
      continue;
    }

    await prisma.source.create({ data: source });
    console.log(`  ✅ Created source: ${source.name} (${source.type})`);
  }

  const count = await prisma.source.count();
  console.log(`\n🎉 Done! ${count} sources in database.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
