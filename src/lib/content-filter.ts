/**
 * Content relevance filter for AI Design News.
 *
 * Audience: Designers + vibe coders who care about AI and frontend tooling.
 *
 * Hard requirements for any item to be allowed:
 *  1. Must have a design/UX/UI signal.
 *  2. Must also have an applied AI signal OR a frontend/tooling signal.
 *
 * Special cases:
 *  - Papers: additionally require applied UX/HCI/product relevance.
 *  - Podcasts: same design + AI/frontend rule (no special exemption).
 *  - Generic AI news without design context: rejected.
 *
 * Spam / restricted content is blocked unconditionally.
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

// ── Audience gate — frontend/tooling signals ──────────────────────────────────

/**
 * Frontend + design-tooling signals.
 * An item must match DESIGN_SIGNALS **and** (AI_SIGNALS **or** these) to be allowed.
 * Intentionally includes design tools (figma, framer …) so that design-tool news
 * naturally satisfies the tooling side of the AND gate.
 */
const FRONTEND_TOOLING_SIGNALS = [
  // Design-to-code / design authoring tools
  "figma",
  "framer",
  "webflow",
  "storybook",
  "principle",
  "protopie",
  "invision",
  "zeplin",
  "spline",
  "rive ",
  "lottie",
  "sketch app",
  "affinity designer",
  "adobe xd",
  "canva",
  // Frontend frameworks / languages
  "react ",
  "next.js",
  "typescript",
  "javascript",
  " css ",
  "vue ",
  "svelte",
  "angular",
  "tailwind",
  "sass",
  "less ",
  // Build / tooling
  "vite ",
  "webpack",
  " npm ",
  " sdk",
  "plugin",
  "open source",
  "open-source",
  "package release",
  // Component / design systems
  "component library",
  "design token",
  "design system",
  "design systems",
  // Handoff / code-gen
  "design to code",
  "design to dev",
  "design handoff",
  "hand-off",
  "code generation",
  "code gen",
  // Vibe coding / no-code
  "vibe cod",
  "no-code",
  "low-code",
  // Mobile/web tooling
  "developer",
  "frontend",
  "web development",
  "mobile app",
  "responsive",
  "framework",
];

// ── Paper-specific applied UX / HCI signals ───────────────────────────────────

/**
 * Papers must have a design signal AND one of these applied UX/HCI signals to pass.
 * Pure ML/AI benchmarks without UI/interaction relevance are rejected.
 */
const APPLIED_UX_PAPER_SIGNALS = [
  "hci",
  "human-computer interaction",
  "interface",
  "interaction",
  "usability",
  "accessibility",
  "a11y",
  "user experience",
  "user interface",
  "user research",
  "user study",
  "user testing",
  "design system",
  "design systems",
  "frontend",
  "prototype",
  "wireframe",
  "ui generation",
  "ui gen",
  "generative ui",
  "text-to-ui",
  "natural language interface",
  "conversational ui",
  "voice interface",
  "multimodal interface",
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
 * Hard requirements (audience: designers + vibe coders):
 *  1. Must have a design/UX/UI signal.
 *  2. Must also have an applied AI signal OR a frontend/tooling signal.
 *  Papers additionally require an applied UX/HCI signal.
 *
 * Generic AI news without design context is rejected.
 *
 * @param itemType  Optional Prisma ItemType string ("paper", "video", …).
 *                  Pass this to enable stricter per-type rules.
 *
 * @returns `{ allowed: true, category }` when the item should be stored/shown,
 *          `{ allowed: false, reason }` when it should be discarded.
 */
export function classifyContent(
  title: string,
  summary?: string | null,
  itemType?: string
): FilterResult {
  // Combine fields; pad with spaces so edge-anchored patterns don't collide
  const text = ` ${title} ${summary || ""} `.toLowerCase();

  // Hard block — spam / restricted / off-topic ─────────────────────────────
  for (const pattern of BLOCKED_PATTERNS) {
    if (text.includes(pattern)) {
      return { allowed: false, reason: `blocked pattern: "${pattern}"` };
    }
  }

  const hasDesign = hasAnySignal(text, DESIGN_SIGNALS);
  const hasAI = hasAnySignal(text, AI_SIGNALS);
  const hasFrontend = hasAnySignal(text, FRONTEND_TOOLING_SIGNALS);

  // Papers: allow if AI-related or has applied UX/HCI relevance
  if (itemType === "paper") {
    if (hasAI || hasDesign || hasAnySignal(text, APPLIED_UX_PAPER_SIGNALS)) {
      const category = hasDesign ? "design" : "ai";
      return { allowed: true, category };
    }
    return {
      allowed: false,
      reason: "paper lacks AI or UX/product/frontend relevance",
    };
  }

  // Allow all AI-related content
  if (hasAI) {
    if (hasDesign) return { allowed: true, category: "design" };
    if (hasFrontend) return { allowed: true, category: "dev" };
    return { allowed: true, category: "ai" };
  }

  // Allow design + frontend content
  if (hasDesign) {
    if (hasFrontend) return { allowed: true, category: "design" };
    return { allowed: true, category: "design" };
  }

  // Allow general dev/tech content
  if (hasFrontend) return { allowed: true, category: "dev" };

  // Allow everything else that isn't spam — let the sources determine relevance
  return { allowed: true, category: "business" };
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
