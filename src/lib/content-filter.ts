/**
 * Content relevance filter for AI Design News.
 *
 * Priority levels:
 *  Level 1 — Design (product, UX, visual, brand, motion — always passes if matched)
 *  Level 2 — AI / ML signals
 *  Level 3 — Software development / engineering
 *  Level 4 — Corporate / business use of AI products
 *
 * An item only needs to match ONE level to be allowed.
 * Spam / restricted content is blocked regardless of any match.
 */

// ── LEVEL 1 — Design signals (highest priority) ──────────────────────────────

/** Product, UX, visual, and brand design — the primary content focus. */
const DESIGN_SIGNALS = [
  // Tools & platforms
  "figma",
  "sketch app",
  "framer",
  "invision",
  "zeplin",
  "principle",
  "protopie",
  "adobe xd",
  "adobe illustrator",
  "adobe photoshop",
  "affinity designer",
  "canva",
  "spline",
  "rive ",
  "lottie",
  "webflow",

  // Disciplines
  " design",
  "product design",
  "visual design",
  "interaction design",
  "interface design",
  "graphic design",
  "communication design",
  "service design",
  "design thinking",
  "human-centered design",
  "user-centered design",
  "design strategy",
  "design leadership",
  "design ops",
  "designops",
  "design systems",
  "design system",
  "design token",
  "design language",
  "design pattern",
  "design critique",
  "design review",
  "design sprint",
  "design process",
  "design workflow",
  "design team",
  "design org",
  "design culture",

  // UX / research
  " ux ",
  "ux design",
  "ux research",
  "ux writing",
  "ux audit",
  "user experience",
  "user research",
  "user testing",
  "usability testing",
  "usability study",
  "usability",
  "user interview",
  "card sorting",
  "tree testing",
  "heuristic evaluation",
  "mental model",
  "user journey",
  "customer journey",
  "journey map",
  "empathy map",
  "persona",
  "user flow",
  "task flow",

  // UI / visual
  " ui ",
  "ui design",
  "user interface",
  "interface component",
  "component library",
  "component system",
  "ui kit",
  "wireframe",
  "mockup",
  "prototype",
  "high-fidelity",
  "low-fidelity",
  "lo-fi",
  "hi-fi",
  "visual hierarchy",
  "color palette",
  "color system",
  "color theory",
  "typography",
  "type scale",
  "font pairing",
  "icon set",
  "iconography",
  "illustration style",
  "motion design",
  "animation",
  "micro-interaction",
  "transition design",
  "dark mode",
  "light mode",

  // Accessibility
  "accessibility",
  "a11y",
  "wcag",
  "aria ",
  "screen reader",
  "color contrast",
  "inclusive design",
  "accessible design",

  // Branding / identity
  "branding",
  "brand identity",
  "brand design",
  "brand guideline",
  "logo design",
  "visual identity",
  "style guide",

  // Dev–design hand-off / collaboration
  "hand-off",
  "handoff",
  "design handoff",
  "design to code",
  "design to dev",
  "design token",
  "storybook",
  "tailwind",
  "css framework",
  "responsive design",
  "mobile-first",
  "adaptive design",
  "layout grid",
  "spacing system",
];

// ── LEVEL 2 — AI / ML signals ────────────────────────────────────────────────

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

// ── LEVEL 3 — Software development / engineering signals ─────────────────────

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
  " sdk",
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
  "open-source",
];

// ── LEVEL 4 — Corporate / business signals ────────────────────────────────────

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
  category?: "design" | "ai" | "dev" | "business";
  reason?: string;
}

export const CONTENT_CATEGORIES = ["design", "ai", "dev", "business"] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

/**
 * Classify an item as allowed or blocked based on its title + summary.
 *
 * Priority order:
 *  1. Design  (figma, ux, ui, typography, a11y, branding …)
 *  2. AI / ML
 *  3. Dev / engineering
 *  4. Business / corporate
 *
 * @returns `{ allowed: true, category }` when the item should be stored,
 *          `{ allowed: false, reason }` when it should be discarded.
 */
export function classifyContent(
  title: string,
  summary?: string | null
): FilterResult {
  // Combine fields; pad with spaces so edge-anchored patterns don't collide
  const text = ` ${title} ${summary || ""} `.toLowerCase();

  // Hard block — spam / restricted / off-topic ─────────────────────────────
  for (const pattern of BLOCKED_PATTERNS) {
    if (text.includes(pattern)) {
      return { allowed: false, reason: `blocked pattern: "${pattern}"` };
    }
  }

  // Level 1 — Design (highest priority, checked first) ─────────────────────
  if (hasAnySignal(text, DESIGN_SIGNALS)) {
    return { allowed: true, category: "design" };
  }

  // Level 2 — AI / ML ───────────────────────────────────────────────────────
  if (hasAnySignal(text, AI_SIGNALS)) {
    return { allowed: true, category: "ai" };
  }

  // Level 3 — Software development ─────────────────────────────────────────
  if (hasAnySignal(text, DEV_SIGNALS)) {
    return { allowed: true, category: "dev" };
  }

  // Level 4 — Business / corporate ─────────────────────────────────────────
  if (hasAnySignal(text, BUSINESS_SIGNALS)) {
    return { allowed: true, category: "business" };
  }

  return {
    allowed: false,
    reason: "no design / AI / dev / business signal found",
  };
}

export function matchesContentCategory(
  title: string,
  summary: string | null | undefined,
  category: string | undefined
): boolean {
  if (!category) {
    return true;
  }

  const result = classifyContent(title, summary);
  return result.allowed && result.category === category;
}
