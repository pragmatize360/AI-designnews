// File: pages/api/admin/sources/index.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Build the object as a TypeScript constant
const data = {
  meta: {
    title: "Top AI Sources – YouTube, News & Articles",
    version: "1.0",
    last_updated: "2026-04",
    ranking_logic: "Reach-first (subscribers/followers where available), otherwise authority and influence",
    counts_policy: "Only explicit, verifiable counts included. Unknown values set to null."
  },

  sources: [
    // ==== YOUTUBE ====
    {
      id: "yt_001",
      type: "youtube",
      name: "3Blue1Brown",
      handle: "@3blue1brown",
      subscriber_count: 8200000,
      video_count: null,
      focus: ["AI fundamentals", "math", "visual explanations"],
      priority_score: 0.98
    },
    {
      id: "yt_002",
      type: "youtube",
      name: "Lex Fridman Podcast",
      handle: "@lexfridman",
      subscriber_count: 5000000,
      video_count: null,
      focus: ["AI leadership", "long-form interviews", "AGI"],
      priority_score: 0.97
    },
    {
      id: "yt_003",
      type: "youtube",
      name: "Two Minute Papers",
      handle: "@TwoMinutePapers",
      subscriber_count: 1520000,
      video_count: null,
      focus: ["AI research", "computer vision", "generative AI"],
      priority_score: 0.95
    },
    {
      id: "yt_004",
      type: "youtube",
      name: "Krish Naik",
      handle: "@krishnaik06",
      subscriber_count: 1400000,
      video_count: null,
      focus: ["machine learning", "applied AI", "education"],
      priority_score: 0.92
    },
    {
      id: "yt_005",
      type: "youtube",
      name: "Matt Wolfe",
      handle: "@mreflow",
      subscriber_count: 525000,
      video_count: null,
      focus: ["AI tools", "no-code", "productivity"],
      priority_score: 0.90
    },
    {
      id: "yt_006",
      type: "youtube",
      name: "DeepLearning.AI",
      handle: "@DeepLearningAI",
      subscriber_count: 393000,
      video_count: null,
      focus: ["AI education", "courses", "events"],
      priority_score: 0.89
    },
    {
      id: "yt_007",
      type: "youtube",
      name: "AI Explained",
      handle: "@AIExplained",
      subscriber_count: null,
      video_count: null,
      focus: ["AI models", "explainers", "industry shifts"],
      priority_score: 0.85
    },
    {
      id: "yt_008",
      type: "youtube",
      name: "Machine Learning Street Talk",
      handle: "@MachineLearningStreetTalk",
      subscriber_count: null,
      video_count: null,
      focus: ["research interviews", "deep AI discussions"],
      priority_score: 0.84
    },

    // ==== AI NEWS ====
    {
      id: "news_001",
      type: "news",
      name: "MIT Technology Review – AI",
      url: "https://www.technologyreview.com",
      follower_count: null,
      focus: ["AI research", "ethics", "long-term impact"],
      priority_score: 0.98
    },
    {
      id: "news_002",
      type: "news",
      name: "TechCrunch – AI",
      url: "https://techcrunch.com/tag/artificial-intelligence/",
      follower_count: null,
      focus: ["AI startups", "funding", "products"],
      priority_score: 0.96
    },
    {
      id: "news_003",
      type: "news",
      name: "VentureBeat – AI",
      url: "https://venturebeat.com/ai/",
      follower_count: null,
      focus: ["enterprise AI", "platforms", "business adoption"],
      priority_score: 0.95
    },
    {
      id: "news_004",
      type: "news",
      name: "Forbes – AI & Innovation",
      url: "https://www.forbes.com/ai/",
      follower_count: null,
      focus: ["executive AI", "industry transformation"],
      priority_score: 0.94
    },
    {
      id: "news_005",
      type: "news",
      name: "AI News",
      url: "https://www.artificialintelligence-news.com/",
      follower_count: null,
      focus: ["daily AI updates", "industry news"],
      priority_score: 0.90
    },
    {
      id: "news_006",
      type: "news",
      name: "AI Magazine",
      url: "https://aimagazine.com/",
      follower_count: null,
      focus: ["enterprise AI", "strategy", "case studies"],
      priority_score: 0.89
    },
    {
      id: "news_007",
      type: "news",
      name: "LLM News / Techmeme AI",
      url: "https://llm-stats.com/ai-news",
      follower_count: null,
      focus: ["LLMs", "model releases", "benchmarks"],
      priority_score: 0.88
    },

    // ==== OFFICIAL BLOGS ====
    {
      id: "blog_001",
      type: "blog",
      name: "OpenAI Blog",
      url: "https://openai.com/blog",
      focus: ["foundation models", "research", "product updates"],
      priority_score: 0.99
    },
    {
      id: "blog_002",
      type: "blog",
      name: "Google DeepMind Blog",
      url: "https://deepmind.google/discover/blog/",
      focus: ["research", "AGI", "science"],
      priority_score: 0.98
    },
    {
      id: "blog_003",
      type: "blog",
      name: "Anthropic Research",
      url: "https://www.anthropic.com/research",
      focus: ["AI safety", "Claude models"],
      priority_score: 0.97
    },
    {
      id: "blog_004",
      type: "blog",
      name: "Meta AI Research",
      url: "https://ai.meta.com/blog/",
      focus: ["open models", "multimodal AI"],
      priority_score: 0.95
    }
  ],

  notes: {
    intended_use: [
      "AI content API",
      "Design & AI trend curation",
      "Leadership dashboards",
      "Signal scoring pipelines"
    ],
    recommended_next_step: "Add engagement_rate, update_frequency, and freshness_score via cron enrichment"
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(data);
}