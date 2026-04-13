import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SOURCES = [
  {
    name: "The Verge - AI",
    type: "rss" as const,
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    trustTier: "reputed_press" as const,
    tags: ["ai", "tech news"],
  },
  {
    name: "MIT News - AI",
    type: "rss" as const,
    url: "https://news.mit.edu/topic/artificial-intelligence2/feed",
    trustTier: "research_university" as const,
    tags: ["ai", "research", "university"],
  },
  {
    name: "OpenAI Blog",
    type: "rss" as const,
    url: "https://openai.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "llm", "openai"],
  },
  {
    name: "Google DeepMind Blog",
    type: "rss" as const,
    url: "https://deepmind.google/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "deepmind"],
  },
  {
    name: "Varun Mayya",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIGsVFMmqOhVeNnv1MwO6A",
    trustTier: "influencer" as const,
    tags: ["ai", "startups", "youtube"],
    channelId: "UCIGsVFMmqOhVeNnv1MwO6A",
  },
  {
    name: "TechCrunch - AI",
    type: "rss" as const,
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "startups", "tech news"],
  },
  {
    name: "Ars Technica - AI",
    type: "rss" as const,
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    trustTier: "reputed_press" as const,
    tags: ["ai", "tech news"],
  },
  {
    name: "NVIDIA Blog - AI",
    type: "rss" as const,
    url: "https://blogs.nvidia.com/feed/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "hardware", "nvidia"],
  },
  {
    name: "Hugging Face Blog",
    type: "rss" as const,
    url: "https://huggingface.co/blog/feed.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "open source", "ml"],
  },
  {
    name: "Google AI Blog",
    type: "rss" as const,
    url: "https://blog.google/technology/ai/rss/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "google", "research"],
  },
  {
    name: "VentureBeat - AI",
    type: "rss" as const,
    url: "https://venturebeat.com/category/ai/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "enterprise", "tech news"],
  },
  {
    name: "Two Minute Papers",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg",
    trustTier: "influencer" as const,
    tags: ["ai", "research", "youtube"],
    channelId: "UCbfYPyITQ-7l4upoX8nvctg",
  },
];

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
