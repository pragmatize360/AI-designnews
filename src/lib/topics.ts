/**
 * Lightweight keyword-based topic tagger.
 * Maps keywords found in title/summary to topic labels.
 */

const TOPIC_RULES: Record<string, string[]> = {
  "large language models": ["llm", "gpt", "claude", "gemini", "llama", "mistral", "language model", "chatgpt", "copilot"],
  "computer vision": ["computer vision", "image recognition", "object detection", "image generation", "dall-e", "midjourney", "stable diffusion", "diffusion model"],
  "robotics": ["robot", "robotics", "humanoid", "autonomous"],
  "reinforcement learning": ["reinforcement learning", "rl agent", "reward model"],
  "natural language processing": ["nlp", "natural language", "text generation", "sentiment analysis", "translation"],
  "generative ai": ["generative ai", "genai", "gen ai", "generative model", "text-to-image", "text-to-video"],
  "ai safety": ["ai safety", "alignment", "hallucination", "red team", "guardrail", "responsible ai", "ai ethics"],
  "ai regulation": ["regulation", "eu ai act", "executive order", "policy", "governance"],
  "machine learning": ["machine learning", "ml ", "deep learning", "neural network", "training", "fine-tune", "fine-tuning"],
  "autonomous vehicles": ["self-driving", "autonomous vehicle", "waymo", "tesla autopilot"],
  "healthcare ai": ["healthcare ai", "medical ai", "drug discovery", "clinical", "diagnosis"],
  "ai chips": ["ai chip", "gpu", "tpu", "nvidia", "ai hardware", "accelerator"],
  "open source": ["open source", "open-source", "hugging face", "huggingface"],
  "startups": ["startup", "funding", "raised", "series a", "series b", "valuation", "vc "],
  "research": ["paper", "arxiv", "research", "study", "benchmark", "sota"],
};

export function tagTopics(title: string, summary?: string | null): string[] {
  const text = `${title} ${summary || ""}`.toLowerCase();
  const matched: string[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_RULES)) {
    if (keywords.some((kw) => text.includes(kw))) {
      matched.push(topic);
    }
  }

  return matched.length > 0 ? matched : ["general ai"];
}
