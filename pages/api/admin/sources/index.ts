// File: pages/api/sources.ts

import type { NextApiRequest, NextApiResponse } from "next";

const youtube_channels = [
  {
    name: "3Blue1Brown",
    handle: "@3blue1brown",
    platform: "YouTube",
    subscriber_count: 8200000,
    count_label: "8.2M",
    category: ["AI fundamentals", "math intuition"],
    source: {
      reference_id: "turn5search176",
      url: "https://clickstrike.com/blog/best-ai-youtube-channels/"
    }
  },
  {
    name: "Lex Fridman Podcast",
    handle: "@lexfridman",
    platform: "YouTube",
    subscriber_count: 5000000,
    count_label: "5M",
    category: ["AI interviews", "industry leaders"],
    source: {
      reference_id: "turn5search176",
      url: "https://clickstrike.com/blog/best-ai-youtube-channels/"
    }
  },
  {
    name: "Two Minute Papers",
    handle: "@TwoMinutePapers",
    platform: "YouTube",
    subscriber_count: 1520000,
    count_label: "1.52M",
    category: ["AI research summaries", "visual explainers"],
    source: {
      reference_id: "turn5search174",
      url: "https://yourdreamai.com/best-ai-focused-youtube-channels/"
    }
  },
  {
    name: "Krish Naik",
    handle: "@krishnaik06",
    platform: "YouTube",
    subscriber_count: 1400000,
    count_label: "1.4M",
    category: ["ML/AI education", "applied tutorials"],
    source: {
      reference_id: "turn5search175",
      url: "https://videos.feedspot.com/ai_youtube_channels/"
    }
  },
  {
    name: "Matt Wolfe",
    handle: "@mreflow",
    platform: "YouTube",
    subscriber_count: 525000,
    count_label: "525K",
    category: ["AI tools", "AI news", "workflows"],
    source: {
      reference_id: "turn5search174",
      url: "https://yourdreamai.com/best-ai-focused-youtube-channels/"
    }
  },
  {
    name: "DeepLearning.AI",
    handle: "@DeepLearningAI",
    platform: "YouTube",
    subscriber_count: 393000,
    count_label: "393K",
    category: ["AI education", "courses & events"],
    source: {
      reference_id: "turn5search179",
      url: "https://aimojo.io/youtube-channels-master-generative-ai/"
    }
  },
  {
    name: "AI Explained",
    handle: "@AIExplained",
    platform: "YouTube",
    subscriber_count: null,
    count_label: null,
    category: ["AI explainers", "model updates"],
    source: {
      reference_id: "turn5search177",
      url: "https://usefulai.com/youtube-channels"
    }
  },
  {
    name: "Machine Learning Street Talk",
    handle: "@MachineLearningStreetTalk",
    platform: "YouTube",
    subscriber_count: null,
    count_label: null,
    category: ["research discussions", "expert interviews"],
    source: {
      reference_id: "turn5search177",
      url: "https://usefulai.com/youtube-channels"
    }
  }
];

const ai_news_websites = [
  {
    name: "MIT Technology Review (AI coverage)",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search171",
      url: "https://www.jeffbullas.com/ai-news/"
    }
  },
  {
    name: "TechCrunch (AI section)",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search167",
      url: "https://www.forbes.com/sites/allbusiness/2025/10/24/the-15-best-websites-you-should-read-to-learn-about-developments-in-ai/"
    }
  },
  {
    name: "Forbes (AI & Innovation channels)",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search167",
      url: "https://www.forbes.com/sites/allbusiness/2025/10/24/the-15-best-websites-you-should-read-to-learn-about-developments-in-ai/"
    }
  },
  {
    name: "VentureBeat (AI coverage)",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search171",
      url: "https://www.jeffbullas.com/ai-news/"
    }
  },
  {
    name: "AI News",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search168",
      url: "https://techdator.net/ai-news-websites/"
    }
  },
  {
    name: "AI Magazine",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search169",
      url: "https://aimagazine.com/"
    }
  },
  {
    name: "LLM News Today (LLM Stats AI News)",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search170",
      url: "https://llm-stats.com/ai-news"
    }
  },
  {
    name: "OpenAI Blog",
    type: "website",
    followers_or_subscribers: null,
    unit: null,
    source: {
      reference_id: "turn5search171",
      url: "https://www.jeffbullas.com/ai-news/"
    }
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    youtube_channels,
    ai_news_websites,
    notes: {
      counts_only_when_explicit: true,
      null_means_not_provided_in_sources: true
    }
  });
}
