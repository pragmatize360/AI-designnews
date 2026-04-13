import { TrustTier } from "@prisma/client";

/** Numeric weight for each trust tier (higher = more trusted) */
const TIER_WEIGHTS: Record<TrustTier, number> = {
  official_vendor: 4,
  reputed_press: 3,
  research_university: 2,
  influencer: 1,
};

/**
 * Compute a score for ranking items on the homepage.
 * Factors: recency, trust tier, engagement (video views/likes), topic match bonus.
 */
export function scoreItem(item: {
  publishedAt: Date | string;
  trustTier: TrustTier;
  metricsViews?: number;
  metricsLikes?: number;
  topics?: string[];
  type?: string;
}): number {
  // Recency score: items within last 24h get full points, decays over 7 days
  const now = Date.now();
  const pub =
    typeof item.publishedAt === "string"
      ? new Date(item.publishedAt).getTime()
      : item.publishedAt.getTime();
  const hoursAgo = (now - pub) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 100 - hoursAgo * (100 / 168)); // 168h = 7 days

  // Trust tier score
  const tierScore = TIER_WEIGHTS[item.trustTier] * 15;

  // Engagement score (normalized, mainly for videos)
  const views = item.metricsViews || 0;
  const likes = item.metricsLikes || 0;
  const engagementScore = Math.min(20, Math.log10(views + 1) * 5 + Math.log10(likes + 1) * 3);

  // Topic relevance bonus (more topics = slightly higher)
  const topicBonus = Math.min(10, (item.topics?.length || 0) * 2);

  return recencyScore + tierScore + engagementScore + topicBonus;
}

/**
 * Section allocation helper.
 * Returns the target section for an item based on its trust tier.
 */
export function getSection(
  trustTier: TrustTier
): "official" | "press" | "creators" {
  switch (trustTier) {
    case "official_vendor":
      return "official";
    case "reputed_press":
    case "research_university":
      return "press";
    case "influencer":
      return "creators";
  }
}
