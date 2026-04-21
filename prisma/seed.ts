import { PrismaClient, SourceType, TrustTier } from "@prisma/client";
const prisma = new PrismaClient();

const SOURCES = [
  // 1-15: Top AI/ML/DS YouTube Channels
  {
    name: "3Blue1Brown",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@3blue1brown",
    channelId: "UCYO_jab_esuFRV4b17AJtAw",
    trustTier: TrustTier.influencer,
    tags: ["AI fundamentals", "math intuition", "youtube"],
  },
  {
    name: "Lex Fridman Podcast",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@lexfridman",
    channelId: "UCSHZKyawb77ixDdsGog4iWA",
    trustTier: TrustTier.influencer,
    tags: ["AI interviews", "industry leaders", "youtube"],
  },
  {
    name: "Veritasium",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@veritasium",
    channelId: "UCHnyfMqiRRG1u-2MsSQLbXA",
    trustTier: TrustTier.influencer,
    tags: ["science explainers", "AI", "youtube"],
  },
  {
    name: "Two Minute Papers",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@TwoMinutePapers",
    channelId: "UCbfYPyITQ-7l4upoX8nvctg",
    trustTier: TrustTier.influencer,
    tags: ["AI research summaries", "visual explainers", "youtube"],
  },
  {
    name: "sentdex",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@sentdex",
    channelId: "UCfzlCWGWYyIQ0aLC5w48gBQ",
    trustTier: TrustTier.influencer,
    tags: ["Python", "AI", "ML code", "youtube"],
  },
  {
    name: "Yannic Kilcher",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@YannicKilcher",
    channelId: "UCZHmQk67mSJgfCCTn7xBfew",
    trustTier: TrustTier.influencer,
    tags: ["AI research", "papers", "youtube"],
  },
  {
    name: "krishnaik06",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@krishnaik06",
    channelId: "UCNU_lfiiWBdtULKOw6X0Dig",
    trustTier: TrustTier.influencer,
    tags: ["AI", "tutorials", "data science", "youtube"],
  },
  {
    name: "AI Explained",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@AIExplained",
    channelId: "UCwRXb5dUK4cvsHbx-rGzSgw",
    trustTier: TrustTier.influencer,
    tags: ["AI news", "explainers", "youtube"],
  },
  {
    name: "DeepLearning.AI",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@DeepLearningAI",
    channelId: "UCcIXc5mABnE-nuCWZGnFnHQ",
    trustTier: TrustTier.official_vendor,
    tags: ["Deep learning", "AI courses", "youtube"],
  },
  {
    name: "Data School",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@DataSchool",
    channelId: "UCnVzApLJE2ljPZSeQylSEyg",
    trustTier: TrustTier.influencer,
    tags: ["Data science", "Python", "machine learning", "youtube"],
  },
  {
    name: "StatQuest with Josh Starmer",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@statquest",
    channelId: "UCtYLUTtgS3k1Fg4y5tAhLbw",
    trustTier: TrustTier.influencer,
    tags: ["Statistics", "ML concepts", "youtube"],
  },
  {
    name: "codebasics",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@codebasics",
    channelId: "UCh9nVJoWXmFb7sLApWGcLPQ",
    trustTier: TrustTier.influencer,
    tags: ["Data analysis", "Python", "ML", "youtube"],
  },
  {
    name: "Matt Wolfe",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@mreflow",
    channelId: "UCJklo0Zl5tLV9kkk_Jd81EA",
    trustTier: TrustTier.influencer,
    tags: ["AI tools", "AI news", "youtube"],
  },
  {
    name: "CodeEmporium",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@CodeEmporium",
    channelId: "UCSHZKyawb77ixDdsGog4iWA",
    trustTier: TrustTier.influencer,
    tags: ["AI", "Machine Learning", "coding", "youtube"],
  },
  {
    name: "Machine Learning Street Talk",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@MachineLearningStreetTalk",
    channelId: "UCMLtBahI5DMrt0j-MuDLObw",
    trustTier: TrustTier.influencer,
    tags: ["AI podcasts", "research discussions", "youtube"],
  },

  // 16-21: Official Vendor/Big Research YouTube
  {
    name: "OpenAI",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@OpenAI",
    channelId: "UCLB7AzTwc6VFZrBsO2ucBMg",
    trustTier: TrustTier.official_vendor,
    tags: ["OpenAI", "AI", "youtube"]
  },
  {
    name: "Hugging Face",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@huggingface",
    channelId: "UCHlNU7kIZhRgSbhHvFoy72w",
    trustTier: TrustTier.official_vendor,
    tags: ["Models", "open source", "youtube"]
  },
  {
    name: "Weights & Biases",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@WeightsBiases",
    channelId: "UCBBcK6lBkHN7__CiKGM-1_g",
    trustTier: TrustTier.official_vendor,
    tags: ["MLops", "AI tools", "youtube"]
  },
  {
    name: "Google Research",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@GoogleResearch",
    channelId: "UCBHcMnPO97K3MkqflcoExzQ",
    trustTier: TrustTier.official_vendor,
    tags: ["Google", "AI research", "youtube"]
  },
  {
    name: "Microsoft Research",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@MSFTResearch",
    channelId: "UCuNbPaAqFaaIrdssZ5EygAg",
    trustTier: TrustTier.official_vendor,
    tags: ["Microsoft", "AI research", "youtube"]
  },
  {
    name: "Facebook AI Research",
    type: SourceType.youtube,
    url: "https://www.youtube.com/@metaresearch",
    channelId: "UCMLtBahI5DMrt0j-MuDLObw",
    trustTier: TrustTier.official_vendor,
    tags: ["Meta", "AI Research", "youtube"]
  },

  // 22-40: Top AI News, Magazine, and Article Websites
  {
    name: "MIT Technology Review (AI coverage)",
    type: SourceType.rss,
    url: "https://www.technologyreview.com/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "technology review", "website"]
  },
  {
    name: "TechCrunch (AI section)",
    type: SourceType.rss,
    url: "https://techcrunch.com/tag/artificial-intelligence/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "techcrunch", "website"]
  },
  {
    name: "Forbes AI",
    type: SourceType.rss,
    url: "https://www.forbes.com/innovation/feed2",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "forbes", "website"]
  },
  {
    name: "VentureBeat AI",
    type: SourceType.rss,
    url: "https://venturebeat.com/category/ai/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "venturebeat", "website"]
  },
  {
    name: "AI News",
    type: SourceType.rss,
    url: "https://artificialintelligence-news.com/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "website"]
  },
  {
    name: "AI Magazine",
    type: SourceType.rss,
    url: "https://aimagazine.com/rss.xml",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "website"]
  },
  {
    name: "LLM News Today (LLM Stats AI News)",
    type: SourceType.rss,
    url: "https://llm-stats.com/ai-news/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["AI news", "llm", "website"]
  },
  {
    name: "OpenAI Blog",
    type: SourceType.rss,
    url: "https://openai.com/blog/rss.xml",
    trustTier: TrustTier.official_vendor,
    tags: ["blog", "openai", "ai", "website"]
  },
  {
    name: "DeepMind Blog",
    type: SourceType.rss,
    url: "https://deepmind.google/blog/feed.xml",
    trustTier: TrustTier.official_vendor,
    tags: ["deepmind", "ai", "research", "website"]
  },
  {
    name: "Google AI Blog",
    type: SourceType.rss,
    url: "https://blog.google/technology/ai/rss/",
    trustTier: TrustTier.official_vendor,
    tags: ["google", "ai", "research", "website"]
  },
  {
    name: "Microsoft AI Blog",
    type: SourceType.rss,
    url: "https://blogs.microsoft.com/ai/feed/",
    trustTier: TrustTier.official_vendor,
    tags: ["microsoft", "ai", "research", "website"]
  },
  {
    name: "NVIDIA AI Blog",
    type: SourceType.rss,
    url: "https://blogs.nvidia.com/blog/category/ai/feed/",
    trustTier: TrustTier.official_vendor,
    tags: ["nvidia", "ai", "website"]
  },
  {
    name: "Analytics India Magazine",
    type: SourceType.rss,
    url: "https://analyticsindiamag.com/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["analytics", "india", "ai", "website"]
  },
  {
    name: "Synced",
    type: SourceType.rss,
    url: "https://syncedreview.com/feed/",
    trustTier: TrustTier.reputed_press,
    tags: ["ai", "news", "synced", "website"]
  },
  {
    name: "Towards Data Science",
    type: SourceType.rss,
    url: "https://towardsdatascience.com/feed",
    trustTier: TrustTier.influencer,
    tags: ["AI", "machine learning", "blog", "website"]
  },
  {
    name: "Papers With Code",
    type: SourceType.rss,
    url: "https://paperswithcode.com/latest",
    trustTier: TrustTier.research_university,
    tags: ["ai", "research", "papers", "ml", "website"]
  },
  {
    name: "KDNuggets",
    type: SourceType.rss,
    url: "https://www.kdnuggets.com/feed",
    trustTier: TrustTier.influencer,
    tags: ["ai", "data science", "news", "website"]
  },
  {
    name: "Machine Learning Mastery",
    type: SourceType.rss,
    url: "https://machinelearningmastery.com/feed/",
    trustTier: TrustTier.influencer,
    tags: ["ml", "tutorials", "deep learning", "website"]
  },
  {
    name: "DataTau",
    type: SourceType.rss,
    url: "https://www.datatau.com/rss",
    trustTier: TrustTier.influencer,
    tags: ["data", "ai", "news", "website"]
  },

  // 41-50: More AI+ML Newsletter/Blog aggregators
  {
    name: "The Gradient",
    type: SourceType.rss,
    url: "https://thegradient.pub/rss/",
    trustTier: TrustTier.research_university,
    tags: ["ai", "machine learning", "blog", "website"]
  },
  {
    name: "Import AI",
    type: SourceType.rss,
    url: "https://jack-clark.net/feed/",
    trustTier: TrustTier.influencer,
    tags: ["ai", "newsletter", "website"]
  },
  {
    name: "BAIR Berkeley AI Research Blog",
    type: SourceType.rss,
    url: "https://bair.berkeley.edu/blog/feed.xml",
    trustTier: TrustTier.research_university,
    tags: ["ai", "research", "berkeley", "website"]
  },
  {
    name: "The Batch (DeepLearning.AI)",
    type: SourceType.rss,
    url: "https://www.deeplearning.ai/the-batch/feed/",
    trustTier: TrustTier.official_vendor,
    tags: ["newsletter", "deeplearning.ai", "ai", "website"]
  },
  {
    name: "AI Weekly",
    type: SourceType.rss,
    url: "https://aiweekly.co/feed.xml",
    trustTier: TrustTier.influencer,
    tags: ["ai", "news", "newsletter", "website"]
  },
  {
    name: "Import AI by Jack Clark",
    type: SourceType.rss,
    url: "https://jack-clark.net/feed/",
    trustTier: TrustTier.influencer,
    tags: ["ai", "newsletter", "website"]
  },
  {
    name: "AI Alignment Newsletter",
    type: SourceType.rss,
    url: "https://www.alignmentforum.org/posts/feed",
    trustTier: TrustTier.reputed_press,
    tags: ["ai", "alignment", "newsletter", "website"]
  },
  {
    name: "OCDE AI Observatory",
    type: SourceType.rss,
    url: "https://oecd.ai/en/news.rss",
    trustTier: TrustTier.reputed_press,
    tags: ["ai", "policy", "news", "website"]
  },
  {
    name: "Open Data Science",
    type: SourceType.rss,
    url: "https://opendatascience.com/feed/",
    trustTier: TrustTier.influencer,
    tags: ["open data", "ai", "news", "website"]
  },
  {
    name: "The Sequence",
    type: SourceType.rss,
    url: "https://thesequence.substack.com/feed",
    trustTier: TrustTier.influencer,
    tags: ["ai", "research", "newsletter", "website"]
  }
];

// --- SEED SCRIPT ---
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