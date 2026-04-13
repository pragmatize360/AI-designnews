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

export default function Home() {
  const [heroItems, setHeroItems] = useState<FeedItem[]>([]);
  const [officialItems, setOfficialItems] = useState<FeedItem[]>([]);
  const [pressItems, setPressItems] = useState<FeedItem[]>([]);
  const [videoItems, setVideoItems] = useState<FeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      try {
        const [heroRes, officialRes, pressRes, videoRes] = await Promise.all([
          fetch("/api/items?limit=4&page=1"),
          fetch("/api/items?section=official&limit=5"),
          fetch("/api/items?section=press&limit=5"),
          fetch("/api/items?type=video&limit=5"),
        ]);

        const hero: SectionData = await heroRes.json();
        const official: SectionData = await officialRes.json();
        const press: SectionData = await pressRes.json();
        const videos: SectionData = await videoRes.json();

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
      const res = await fetch(`/api/items?page=${page}&limit=12`);
      const data = await res.json();
      if (data.items) {
        setFeedItems((prev) => [...prev, ...data.items]);
        setHasMore(page < data.pagination.totalPages);
      }
    } catch (e) {
      console.error("Failed to load feed:", e);
    }
  }, [page]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  function loadMore() {
    setPage((p) => p + 1);
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

        {/* Infinite scroll feed */}
        <section className="feed">
          <h2 className="feed__title">All News</h2>
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
