import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SOURCES = [
  // ─── Articles: Reputed Press ──────────────────────────────────────
  {
    name: "TechCrunch - AI",
    type: "rss" as const,
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "startups", "tech news"],
  },
  {
    name: "The Verge - AI",
    type: "rss" as const,
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    trustTier: "reputed_press" as const,
    tags: ["ai", "tech news"],
  },
  {
    name: "Wired - AI",
    type: "rss" as const,
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    trustTier: "reputed_press" as const,
    tags: ["ai", "tech news", "culture"],
  },
  {
    name: "Ars Technica - AI",
    type: "rss" as const,
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    trustTier: "reputed_press" as const,
    tags: ["ai", "tech news"],
  },
  {
    name: "VentureBeat - AI",
    type: "rss" as const,
    url: "https://venturebeat.com/category/ai/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "enterprise", "tech news"],
  },
  {
    name: "Forbes - AI",
    type: "rss" as const,
    url: "https://www.forbes.com/ai/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "business", "tech news"],
  },
  {
    name: "MIT Technology Review - AI",
    type: "rss" as const,
    url: "https://www.technologyreview.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["ai", "research", "tech news"],
  },
  {
    name: "ZDNet - AI",
    type: "rss" as const,
    url: "https://www.zdnet.com/topic/artificial-intelligence/rss.xml",
    trustTier: "reputed_press" as const,
    tags: ["ai", "enterprise", "tech news"],
  },
  {
    name: "The Information - AI",
    type: "rss" as const,
    url: "https://www.theinformation.com/feed",
    trustTier: "reputed_press" as const,
    tags: ["ai", "business", "tech news"],
  },
  {
    name: "IEEE Spectrum - AI",
    type: "rss" as const,
    url: "https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss",
    trustTier: "reputed_press" as const,
    tags: ["ai", "engineering", "research"],
  },

  // ─── Articles: Developer / Community ──────────────────────────────
  {
    name: "Hacker News",
    type: "rss" as const,
    url: "https://hnrss.org/frontpage",
    trustTier: "influencer" as const,
    tags: ["tech", "startups", "community"],
  },
  {
    name: "Dev.to - AI",
    type: "rss" as const,
    url: "https://dev.to/feed/tag/ai",
    trustTier: "influencer" as const,
    tags: ["ai", "developer", "tutorials"],
  },
  {
    name: "Medium - AI",
    type: "rss" as const,
    url: "https://medium.com/feed/tag/artificial-intelligence",
    trustTier: "influencer" as const,
    tags: ["ai", "ml", "tutorials"],
  },
  {
    name: "Towards Data Science",
    type: "rss" as const,
    url: "https://towardsdatascience.com/feed",
    trustTier: "influencer" as const,
    tags: ["ai", "data science", "ml"],
  },

  // ─── Official Vendor Blogs ────────────────────────────────────────
  {
    name: "OpenAI Blog",
    type: "rss" as const,
    url: "https://openai.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "llm", "openai"],
  },
  {
    name: "Google AI Blog",
    type: "rss" as const,
    url: "https://blog.google/technology/ai/rss/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "google", "research"],
  },
  {
    name: "Google DeepMind Blog",
    type: "rss" as const,
    url: "https://deepmind.google/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "deepmind"],
  },
  {
    name: "Meta AI Blog",
    type: "rss" as const,
    url: "https://ai.meta.com/blog/rss/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "meta"],
  },
  {
    name: "Microsoft AI Blog",
    type: "rss" as const,
    url: "https://blogs.microsoft.com/ai/feed/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "enterprise", "microsoft"],
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
    name: "Anthropic Blog",
    type: "rss" as const,
    url: "https://www.anthropic.com/research/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "safety", "llm"],
  },
  {
    name: "Amazon Science - AI",
    type: "rss" as const,
    url: "https://www.amazon.science/index.rss",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "amazon"],
  },
  {
    name: "Apple Machine Learning",
    type: "rss" as const,
    url: "https://machinelearning.apple.com/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "ml", "apple"],
  },

  // ─── Research / Academic ──────────────────────────────────────────
  {
    name: "ArXiv - AI",
    type: "rss" as const,
    url: "https://rss.arxiv.org/rss/cs.AI",
    trustTier: "research_university" as const,
    tags: ["ai", "research", "papers"],
  },
  {
    name: "ArXiv - Machine Learning",
    type: "rss" as const,
    url: "https://rss.arxiv.org/rss/cs.LG",
    trustTier: "research_university" as const,
    tags: ["ml", "research", "papers"],
  },
  {
    name: "ArXiv - Computer Vision",
    type: "rss" as const,
    url: "https://rss.arxiv.org/rss/cs.CV",
    trustTier: "research_university" as const,
    tags: ["cv", "research", "papers"],
  },
  {
    name: "MIT News - AI",
    type: "rss" as const,
    url: "https://news.mit.edu/topic/artificial-intelligence2/feed",
    trustTier: "research_university" as const,
    tags: ["ai", "research", "university"],
  },
  {
    name: "Stanford HAI",
    type: "rss" as const,
    url: "https://hai.stanford.edu/news/rss.xml",
    trustTier: "research_university" as const,
    tags: ["ai", "policy", "research"],
  },
  {
    name: "Distill.pub",
    type: "rss" as const,
    url: "https://distill.pub/rss.xml",
    trustTier: "research_university" as const,
    tags: ["ai", "ml", "visualization"],
  },

  // ─── YouTube Channels: Videos ─────────────────────────────────────
  {
    name: "Two Minute Papers",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg",
    trustTier: "influencer" as const,
    tags: ["ai", "research", "youtube"],
    channelId: "UCbfYPyITQ-7l4upoX8nvctg",
  },
  {
    name: "3Blue1Brown",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCYO_jab_esuFRV4b17AJtAw",
    trustTier: "influencer" as const,
    tags: ["math", "ml", "youtube", "explainers"],
    channelId: "UCYO_jab_esuFRV4b17AJtAw",
  },
  {
    name: "Veritasium",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCHnyfMqiRRG1u-2MsSQLbXA",
    trustTier: "influencer" as const,
    tags: ["science", "tech", "youtube"],
    channelId: "UCHnyfMqiRRG1u-2MsSQLbXA",
  },
  {
    name: "Yannic Kilcher",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZHmQk67mSJgfCCTn7xBfew",
    trustTier: "influencer" as const,
    tags: ["ai", "papers", "youtube"],
    channelId: "UCZHmQk67mSJgfCCTn7xBfew",
  },
  {
    name: "Andrej Karpathy",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXUPKJO5MZQN11PqgIvyuvQ",
    trustTier: "influencer" as const,
    tags: ["ai", "deep learning", "youtube"],
    channelId: "UCXUPKJO5MZQN11PqgIvyuvQ",
  },
  {
    name: "Fireship",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA",
    trustTier: "influencer" as const,
    tags: ["tech", "developer", "youtube"],
    channelId: "UCsBjURrPoezykLs9EqgamOA",
  },
  {
    name: "Lex Fridman",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSHZKyawb77ixDdsGog4iWA",
    trustTier: "influencer" as const,
    tags: ["ai", "interviews", "youtube"],
    channelId: "UCSHZKyawb77ixDdsGog4iWA",
  },
  {
    name: "Sentdex",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCfzlCWGWYyIQ0aLC5w48gBQ",
    trustTier: "influencer" as const,
    tags: ["ai", "python", "youtube", "tutorials"],
    channelId: "UCfzlCWGWYyIQ0aLC5w48gBQ",
  },
  {
    name: "AI Explained",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNJ1Ymd5yFuUPtn21xtRbbw",
    trustTier: "influencer" as const,
    tags: ["ai", "explainers", "youtube"],
    channelId: "UCNJ1Ymd5yFuUPtn21xtRbbw",
  },
  {
    name: "Matt Wolfe",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJq6AEgtStGGqAtqxYnOy6A",
    trustTier: "influencer" as const,
    tags: ["ai", "tools", "youtube"],
    channelId: "UCJq6AEgtStGGqAtqxYnOy6A",
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
