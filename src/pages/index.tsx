import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";

interface FeedItem {
  id: string;
  title: string;
  summary: string | null;
  type: string;
  publishedAt: string;
  topics: string[];
  thumbnailUrl: string | null;
  pinned: boolean;
  source: { name: string; trustTier: string; type: string };
}

interface SectionData {
  items: FeedItem[];
}

interface IngestionStatus {
  lastRun: {
    status: string;
    startedAt: string;
    finishedAt: string | null;
    stats: { total: number; inserted: number; duplicates: number; errors: number } | null;
  } | null;
  totalSources: number;
  enabledSources: number;
  totalItems: number;
}

export default function Home() {
  const [heroItems, setHeroItems] = useState<FeedItem[]>([]);
  const [officialItems, setOfficialItems] = useState<FeedItem[]>([]);
  const [pressItems, setPressItems] = useState<FeedItem[]>([]);
  const [videoItems, setVideoItems] = useState<FeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<IngestionStatus | null>(null);
  const [filterType, setFilterType] = useState("");
  const [filterTopic, setFilterTopic] = useState("");

  useEffect(() => {
    async function loadSections() {
      try {
        const [heroRes, officialRes, pressRes, videoRes, statusRes] = await Promise.all([
          fetch("/api/items?limit=4&page=1"),
          fetch("/api/items?section=official&limit=5"),
          fetch("/api/items?section=press&limit=5"),
          fetch("/api/items?type=video&limit=5"),
          fetch("/api/ingest/status"),
        ]);

        const hero: SectionData = await heroRes.json();
        const official: SectionData = await officialRes.json();
        const press: SectionData = await pressRes.json();
        const videos: SectionData = await videoRes.json();
        if (statusRes.ok) setStats(await statusRes.json());

        setHeroItems(hero.items || []);
        setOfficialItems(official.items || []);
        setPressItems(press.items || []);
        setVideoItems(videos.items || []);
      } catch (e) {
        console.error("Failed to load sections:", e);
      }
      setLoading(false);
    }

    loadSections();
  }, []);

  const loadFeed = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      });
      if (filterType) params.set("type", filterType);
      if (filterTopic) params.set("topic", filterTopic);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.items) {
        setFeedItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(page < data.pagination.totalPages);
      }
    } catch (e) {
      console.error("Failed to load feed:", e);
    }
  }, [page, filterType, filterTopic]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  function loadMore() {
    setPage((p) => p + 1);
  }

  function applyFilter(type: string, topic: string) {
    setFilterType(type);
    setFilterTopic(topic);
    setPage(1);
    setFeedItems([]);
    setHasMore(true);
  }

  return (
    <>
      <Head>
        <title>AI News Hub - Latest AI & ML News</title>
        <meta
          name="description"
          content="Aggregated AI news from 40+ trusted sources"
        />
      </Head>

      <Header />

      <main>
        {/* Stats Bar */}
        {stats && (
          <section className="stats-bar">
            <div className="stats-bar__item">
              <strong>{stats.totalSources}</strong> Sources
            </div>
            <div className="stats-bar__item">
              <strong>{stats.enabledSources}</strong> Active
            </div>
            <div className="stats-bar__item">
              <strong>{stats.totalItems}</strong> Articles
            </div>
            {stats.lastRun && (
              <div className="stats-bar__item">
                Last ingestion:{" "}
                <span className={`status-dot status-dot--${stats.lastRun.status}`} />{" "}
                {new Date(stats.lastRun.startedAt).toLocaleString()}
              </div>
            )}
          </section>
        )}

        {/* Hero Section */}
        <section className="hero">
          <h2 className="hero__title">🔥 Top Stories</h2>
          {loading ? (
            <p>Loading...</p>
          ) : heroItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              No items yet. Run the ingestion pipeline to fetch news.
            </p>
          ) : (
            <div className="hero__grid">
              {heroItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </section>

        {/* 3-Column Section */}
        <section className="sections">
          <div>
            <h3 className="section__title">📰 Latest Articles</h3>
            {pressItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
          <div>
            <h3 className="section__title">🏢 Official Updates</h3>
            {officialItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
          <div>
            <h3 className="section__title">🎬 Latest Videos</h3>
            {videoItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </section>

        {/* Filtered feed */}
        <section className="feed">
          <h2 className="feed__title">All News</h2>

          {/* Filter controls */}
          <div className="feed__filters">
            <select
              value={filterType}
              onChange={(e) => applyFilter(e.target.value, filterTopic)}
              className="feed__filter-select"
            >
              <option value="">All Types</option>
              <option value="article">📰 Articles</option>
              <option value="video">🎬 Videos</option>
              <option value="paper">📄 Papers</option>
              <option value="release">🚀 Releases</option>
            </select>

            <select
              value={filterTopic}
              onChange={(e) => applyFilter(filterType, e.target.value)}
              className="feed__filter-select"
            >
              <option value="">All Topics</option>
              <option value="large language models">LLMs</option>
              <option value="computer vision">Computer Vision</option>
              <option value="machine learning">Machine Learning</option>
              <option value="generative ai">Generative AI</option>
              <option value="ai safety">AI Safety</option>
              <option value="robotics">Robotics</option>
              <option value="research">Research</option>
              <option value="startups">Startups</option>
              <option value="open source">Open Source</option>
            </select>
          </div>

          <div className="feed__grid">
            {feedItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
          {hasMore && feedItems.length > 0 && (
            <button className="feed__load-more" onClick={loadMore}>
              Load More
            </button>
          )}
        </section>
      </main>
    </>
  );
}
