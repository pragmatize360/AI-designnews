import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SOURCES = [
  // ─── Tech News (10) ───────────────────────────────────────────────
  {
    name: "TechCrunch",
    type: "rss" as const,
    url: "https://techcrunch.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "startups", "ai"],
  },
  {
    name: "The Verge",
    type: "rss" as const,
    url: "https://www.theverge.com/rss/index.xml",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "culture", "ai"],
  },
  {
    name: "Wired",
    type: "rss" as const,
    url: "https://www.wired.com/feed/rss",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "culture", "science"],
  },
  {
    name: "ArXiv CS",
    type: "rss" as const,
    url: "https://rss.arxiv.org/rss/cs",
    trustTier: "research_university" as const,
    tags: ["research", "papers", "computer science"],
  },
  {
    name: "MIT Tech Review",
    type: "rss" as const,
    url: "https://www.technologyreview.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "ai", "research"],
  },
  {
    name: "Forbes Tech",
    type: "rss" as const,
    url: "https://www.forbes.com/innovation/feed2",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "business", "ai"],
  },
  {
    name: "CNET",
    type: "rss" as const,
    url: "https://www.cnet.com/rss/news/",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "reviews", "consumer tech"],
  },
  {
    name: "Engadget",
    type: "rss" as const,
    url: "https://www.engadget.com/rss.xml",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "gadgets", "consumer tech"],
  },
  {
    name: "ZDNet",
    type: "rss" as const,
    url: "https://www.zdnet.com/news/rss.xml",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "enterprise", "ai"],
  },
  {
    name: "InfoQ",
    type: "rss" as const,
    url: "https://feed.infoq.com/",
    trustTier: "reputed_press" as const,
    tags: ["tech news", "development", "architecture"],
  },

  // ─── AI/ML/Data Science (8) ───────────────────────────────────────
  {
    name: "Towards Data Science",
    type: "rss" as const,
    url: "https://towardsdatascience.com/feed",
    trustTier: "influencer" as const,
    tags: ["ai", "data science", "ml", "tutorials"],
  },
  {
    name: "Machine Learning Mastery",
    type: "rss" as const,
    url: "https://machinelearningmastery.com/feed/",
    trustTier: "influencer" as const,
    tags: ["ml", "tutorials", "deep learning"],
  },
  {
    name: "Papers With Code",
    type: "rss" as const,
    url: "https://paperswithcode.com/latest",
    trustTier: "research_university" as const,
    tags: ["ai", "research", "papers", "ml"],
  },
  {
    name: "Kaggle Blog",
    type: "rss" as const,
    url: "https://medium.com/feed/@kaggle",
    trustTier: "official_vendor" as const,
    tags: ["data science", "ml", "competitions"],
  },
  {
    name: "OpenAI Blog",
    type: "rss" as const,
    url: "https://openai.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "llm", "openai"],
  },
  {
    name: "DeepMind Blog",
    type: "rss" as const,
    url: "https://deepmind.google/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "deepmind"],
  },
  {
    name: "Google AI Blog",
    type: "rss" as const,
    url: "https://blog.google/technology/ai/rss/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "google"],
  },
  {
    name: "Fast.ai",
    type: "rss" as const,
    url: "https://www.fast.ai/atom.xml",
    trustTier: "influencer" as const,
    tags: ["ml", "deep learning", "tutorials"],
  },

  // ─── Design/UX (6) ────────────────────────────────────────────────
  {
    name: "Design Observer",
    type: "rss" as const,
    url: "https://designobserver.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["design", "culture", "ux"],
  },
  {
    name: "A List Apart",
    type: "rss" as const,
    url: "https://alistapart.com/main/feed/",
    trustTier: "reputed_press" as const,
    tags: ["design", "web development", "ux"],
  },
  {
    name: "UX Collective",
    type: "rss" as const,
    url: "https://uxdesign.cc/feed",
    trustTier: "influencer" as const,
    tags: ["ux", "design", "user research"],
  },
  {
    name: "Nielsen Norman Group",
    type: "rss" as const,
    url: "https://www.nngroup.com/feed/rss/",
    trustTier: "research_university" as const,
    tags: ["ux", "usability", "research"],
  },
  {
    name: "Smashing Magazine",
    type: "rss" as const,
    url: "https://www.smashingmagazine.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["design", "web development", "css"],
  },
  {
    name: "CSS-Tricks",
    type: "rss" as const,
    url: "https://css-tricks.com/feed/",
    trustTier: "influencer" as const,
    tags: ["css", "web development", "design"],
  },

  // ─── Science (8) ──────────────────────────────────────────────────
  {
    name: "Nature",
    type: "rss" as const,
    url: "https://www.nature.com/nature.rss",
    trustTier: "research_university" as const,
    tags: ["science", "research", "papers"],
  },
  {
    name: "Science Daily",
    type: "rss" as const,
    url: "https://www.sciencedaily.com/rss/all.xml",
    trustTier: "reputed_press" as const,
    tags: ["science", "research", "news"],
  },
  {
    name: "Phys.org",
    type: "rss" as const,
    url: "https://phys.org/rss-feed/",
    trustTier: "reputed_press" as const,
    tags: ["science", "physics", "technology"],
  },
  {
    name: "Quanta Magazine",
    type: "rss" as const,
    url: "https://api.quantamagazine.org/feed/",
    trustTier: "reputed_press" as const,
    tags: ["science", "math", "physics"],
  },
  {
    name: "Scientific American",
    type: "rss" as const,
    url: "https://www.scientificamerican.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["science", "research", "health"],
  },
  {
    name: "Nautilus",
    type: "rss" as const,
    url: "https://nautil.us/feed/",
    trustTier: "reputed_press" as const,
    tags: ["science", "culture", "philosophy"],
  },
  {
    name: "Popular Science",
    type: "rss" as const,
    url: "https://www.popsci.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["science", "technology", "consumer"],
  },
  {
    name: "FiveThirtyEight",
    type: "rss" as const,
    url: "https://fivethirtyeight.com/feed/",
    trustTier: "reputed_press" as const,
    tags: ["data", "statistics", "politics"],
  },

  // ─── Development (5) ──────────────────────────────────────────────
  {
    name: "Dev.to",
    type: "rss" as const,
    url: "https://dev.to/feed",
    trustTier: "influencer" as const,
    tags: ["development", "tutorials", "community"],
  },
  {
    name: "Hacker News",
    type: "rss" as const,
    url: "https://hnrss.org/frontpage",
    trustTier: "influencer" as const,
    tags: ["tech", "startups", "community"],
  },
  {
    name: "GitHub Blog",
    type: "rss" as const,
    url: "https://github.blog/feed/",
    trustTier: "official_vendor" as const,
    tags: ["development", "open source", "github"],
  },
  {
    name: "Stack Overflow Blog",
    type: "rss" as const,
    url: "https://stackoverflow.blog/feed/",
    trustTier: "influencer" as const,
    tags: ["development", "community", "programming"],
  },

  // ─── Product/Industry + Tooling + Podcasts (10) ──────────────────
  {
    name: "NVIDIA Developer Blog",
    type: "rss" as const,
    url: "https://developer.nvidia.com/blog/feed/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "gpu", "developer tooling", "industry"],
  },
  {
    name: "AWS Machine Learning Blog",
    type: "rss" as const,
    url: "https://aws.amazon.com/blogs/machine-learning/feed/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "ml", "cloud", "industry"],
  },
  {
    name: "Microsoft Research",
    type: "rss" as const,
    url: "https://www.microsoft.com/en-us/research/feed/",
    trustTier: "research_university" as const,
    tags: ["ai", "research", "ml", "industry"],
  },
  {
    name: "Google Research Blog",
    type: "rss" as const,
    url: "https://research.google/blog/rss/",
    trustTier: "official_vendor" as const,
    tags: ["ai", "research", "google", "papers"],
  },
  {
    name: "Hugging Face Blog",
    type: "rss" as const,
    url: "https://huggingface.co/blog/feed.xml",
    trustTier: "official_vendor" as const,
    tags: ["ai", "open source", "llm", "models"],
  },
  {
    name: "Figma Blog",
    type: "rss" as const,
    url: "https://www.figma.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["design", "product", "ui", "ux"],
  },
  {
    name: "Vercel Blog",
    type: "rss" as const,
    url: "https://vercel.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["frontend", "performance", "nextjs", "tooling"],
  },
  {
    name: "React Blog",
    type: "rss" as const,
    url: "https://react.dev/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["frontend", "react", "development", "tooling"],
  },
  {
    name: "Chrome Developers",
    type: "rss" as const,
    url: "https://developer.chrome.com/blog/rss.xml",
    trustTier: "official_vendor" as const,
    tags: ["frontend", "web platform", "performance", "tooling"],
  },
  {
    name: "Practical AI Podcast",
    type: "rss" as const,
    url: "https://changelog.com/practicalai/feed",
    trustTier: "influencer" as const,
    tags: ["ai", "podcast", "ml", "industry"],
  },

  // ─── Video Channels (4) ───────────────────────────────────────────
  {
    name: "Fireship",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA",
    trustTier: "influencer" as const,
    tags: ["development", "ai", "tooling", "youtube"],
    channelId: "UCsBjURrPoezykLs9EqgamOA",
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
    name: "3Blue1Brown",
    type: "youtube" as const,
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCYO_jab_esuFRV4b17AJtAw",
    trustTier: "influencer" as const,
    tags: ["math", "ml", "youtube", "explainers"],
    channelId: "UCYO_jab_esuFRV4b17AJtAw",
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
