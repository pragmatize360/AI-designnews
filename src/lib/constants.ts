import type { TrustTier, ItemType } from "@prisma/client";

/** Numeric base score for each trust tier */
export const TRUST_TIER_SCORES: Record<TrustTier, number> = {
  official_vendor: 100,
  reputed_press: 70,
  research_university: 60,
  influencer: 40,
};

/** Display labels for trust tiers */
export const TRUST_TIER_LABELS: Record<TrustTier, string> = {
  official_vendor: "Official Vendor",
  reputed_press: "Reputed Press",
  research_university: "Research / University",
  influencer: "Creator / Influencer",
};

/** All recognised item types */
export const ITEM_TYPES: ItemType[] = ["article", "video", "paper", "release"];

/** Display labels for item types */
export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  article: "Article",
  video: "Video",
  paper: "Paper",
  release: "Release",
};

/**
 * Homepage mix ratios.
 * 40% official vendors, 40% press/research, 20% creators.
 */
export const HOMEPAGE_MIX = {
  official: 0.4,
  press: 0.4,
  creators: 0.2,
} as const;

/** Scoring constants */
export const SCORING = {
  /** Points deducted per hour since publish */
  RECENCY_DECAY_PER_HOUR: 100 / 168, // ~0.6 per hour over 7 days
  /** Maximum engagement score */
  MAX_ENGAGEMENT: 20,
  /** Maximum topic bonus */
  MAX_TOPIC_BONUS: 10,
  /** Number of hours in scoring window */
  SCORING_WINDOW_HOURS: 168, // 7 days
} as const;

/** Ingestion defaults */
export const INGESTION = {
  /** Default interval between automatic ingestion runs (ms) */
  RUN_INTERVAL_MS: 2 * 60 * 60 * 1000, // 2 hours
  /** Consecutive failures before degrading a source */
  FAILURE_THRESHOLD: 3,
  /** Duration to degrade a failing source (ms) */
  DEGRADATION_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  /** Request timeout for fetching sources (ms) */
  FETCH_TIMEOUT_MS: 15_000,
} as const;

/**
 * The 15 topic categories used for tagging.
 */
export const TOPIC_CATEGORIES = [
  "large language models",
  "computer vision",
  "robotics",
  "reinforcement learning",
  "natural language processing",
  "generative ai",
  "ai safety",
  "ai regulation",
  "machine learning",
  "autonomous vehicles",
  "healthcare ai",
  "ai chips",
  "open source",
  "startups",
  "research",
] as const;
