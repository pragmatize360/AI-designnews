/**
 * Content relevance filter for AI Design News.
 *
 * Rules:
 *  1. Items must relate to AI, software development, product/UX design, or
 *     corporate/business use of AI.  Off-topic content is discarded.
 *  2. Spam indicators and restricted/NSFW content are always blocked regardless
 *     of any other signals.
 *
 * Applied at ingestion time — rejected items are never stored in the database.
 */

// ── Allowed signal groups ────────────────────────────────────────────────────

/** Broad AI / ML signals — any of these makes an item AI-adjacent. */
const AI_SIGNALS = [
  " ai ",
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "neural network",
  "large language model",
  "llm",
  "gpt",
  "claude",
  "gemini",
  "llama",
  "mistral",
  "chatgpt",
  "copilot",
  "openai",
  "anthropic",
  "hugging face",
  "huggingface",
  "stable diffusion",
  "midjourney",
  "dall-e",
  "diffusion model",
  "language model",
  "generative ai",
  "genai",
  "gen ai",
  "transformer",
  "embedding",
  "inference",
  "fine-tun",
  "prompt engineer",
  "retrieval augmented",
  "rag ",
  "ai agent",
  "agentic",
  "computer vision",
  "image recognition",
  "natural language processing",
  "nlp ",
  "speech recognition",
  "reinforcement learning",
  "foundation model",
  "multimodal",
  "text-to-image",
  "text-to-video",
  "text-to-speech",
  "data science",
];

/** Software development / engineering signals. */
const DEV_SIGNALS = [
  "software engineer",
  "software development",
  "developer",
  "programming",
  "typescript",
  "javascript",
  "python",
  "react ",
  "next.js",
  "framework",
  "open source",
  "github",
  "api",
  "sdk",
  "devops",
  "deployment",
  "ci/cd",
  "cloud computing",
  "kubernetes",
  "microservice",
  "web application",
  "mobile app",
  "code review",
  "version control",
  "package release",
  "v1.",
  "v2.",
  "v3.",
  " launch",
  "open-source",
];

/** Product / UX / visual design signals. */
const DESIGN_SIGNALS = [
  " design",
  "ui/ux",
  " ux ",
  " ui ",
  "figma",
  "user interface",
  "user experience",
  "usability",
  "prototype",
  "typography",
  "accessibility",
  "design system",
  "wireframe",
  "interaction design",
  "visual design",
  "branding",
  "component library",
  "motion design",
  "product design",
  "color palette",
  "icon set",
];

/** Corporate / business / product strategy signals. */
const BUSINESS_SIGNALS = [
  "product launch",
  "startup",
  "enterprise",
  "team collaboration",
  "workflow",
  "productivity",
  "roadmap",
  "announcement",
  "partnership",
  "acquisition",
  "funding round",
  "series a",
  "series b",
  "series c",
  "ipo",
  "valuation",
  "revenue",
  "growth",
  "market",
  "benchmark",
  "case study",
  "whitepaper",
  "research report",
  "survey result",
];

// ── Hard-block lists ─────────────────────────────────────────────────────────

/**
 * Any item whose combined title+summary contains one of these strings is
 * unconditionally discarded.
 */
const BLOCKED_PATTERNS = [
  // NSFW / adult content
  "porn",
  " xxx ",
  "nude photo",
  "adult entertainment",
  "adult content",
  "escort service",
  "onlyfans",
  "sex video",
  "erotic story",
  "nsfw",

  // Gambling / get-rich schemes
  "online casino",
  "slot machine",
  "sports betting tip",
  "binary option",
  "forex signal",
  "crypto pump",
  "get rich quick",
  "make money fast",
  "passive income secret",

  // Supplement / pharma spam
  "weight loss pill",
  "keto gummy",
  "diet pill",
  "male enhancement pill",
  "testosterone booster",

  // Social-media manipulation
  "buy followers",
  "buy subscribers",
  "buy youtube views",

  // Generic engagement bait
  "you have been selected",
  "you won a prize",
  "congratulations you",
  "click here now!!!",
  "limited time offer!!!",

  // Completely off-topic verticals (non-AI)
  " nfl score",
  " nba score",
  "premier league result",
  "match result",
  "celebrity gossip",
  "reality tv drama",
  "horoscope today",
  "cooking recipe",
  "easy recipe",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function hasAnySignal(text: string, signals: readonly string[]): boolean {
  return signals.some((s) => text.includes(s));
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface FilterResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Classify an item as allowed or blocked based on its title + summary.
 *
 * @returns `{ allowed: true }` when the item should be stored,
 *          `{ allowed: false, reason }` when it should be discarded.
 */
export function classifyContent(
  title: string,
  summary?: string | null
): FilterResult {
  // Combine fields; pad with spaces so edge-anchored patterns don't collide
  const text = ` ${title} ${summary || ""} `.toLowerCase();

  // 1. Hard block — spam / restricted / off-topic ───────────────────────────
  for (const pattern of BLOCKED_PATTERNS) {
    if (text.includes(pattern)) {
      return { allowed: false, reason: `blocked pattern: "${pattern}"` };
    }
  }

  // 2. Category relevance — must match at least one signal group ────────────
  const relevant =
    hasAnySignal(text, AI_SIGNALS) ||
    hasAnySignal(text, DEV_SIGNALS) ||
    hasAnySignal(text, DESIGN_SIGNALS) ||
    hasAnySignal(text, BUSINESS_SIGNALS);

  if (!relevant) {
    return {
      allowed: false,
      reason: "no AI / dev / design / business signal found",
    };
  }

  return { allowed: true };
}
