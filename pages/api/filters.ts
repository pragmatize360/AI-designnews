import type { NextApiRequest, NextApiResponse } from "next";
import { applyPublicCors } from "@/lib/api/cors";
import { CONTENT_CATEGORIES } from "@/lib/content-filter";

const FILTERS = {
  items: {
    sections: ["official", "press", "creators"],
    itemTypes: ["article", "video", "paper", "release"],
    contentCategories: CONTENT_CATEGORIES,
    queryParams: {
      page: "1-based page number",
      limit: "page size, max 50",
      section: "official | press | creators",
      type: "article | video | paper | release",
      contentCategory: "design | ai | dev | business",
      topic: "exact topic string stored on item",
      sourceId: "source id",
      search: "free text search on title, summary, topics",
    },
  },
  search: {
    contentCategories: CONTENT_CATEGORIES,
    queryParams: {
      q: "required free text query",
      page: "1-based page number",
      limit: "page size, max 50",
      contentCategory: "design | ai | dev | business",
    },
  },
  sources: {
    sourceTypes: ["rss", "html", "api", "youtube"],
    trustTiers: [
      "official_vendor",
      "reputed_press",
      "research_university",
      "influencer",
    ],
    queryParams: {
      page: "1-based page number",
      limit: "page size, max 100",
      type: "rss | html | api | youtube",
      trustTier:
        "official_vendor | reputed_press | research_university | influencer",
      enabled: "true | false",
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyPublicCors(req, res)) {
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json(FILTERS);
}