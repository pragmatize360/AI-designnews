import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";

interface ItemDetail {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  contentSnippet: string | null;
  type: string;
  publishedAt: string;
  author: string | null;
  topics: string[];
  thumbnailUrl: string | null;
  metricsViews: number;
  metricsLikes: number;
  source: { name: string; trustTier: string; type: string; url: string };
  videoMeta: {
    videoId: string;
    channelName: string;
    duration: string | null;
  } | null;
}

interface RelatedItem {
  id: string;
  title: string;
  summary: string | null;
  type: string;
  publishedAt: string;
  topics: string[];
  thumbnailUrl: string | null;
  source: { name: string; trustTier: string; type: string };
}

export default function ItemDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [related, setRelated] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setItem(data.item);
        setRelated(data.related || []);
      } catch (e) {
        console.error("Failed to load item:", e);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="detail">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <div className="detail">
          <p>Item not found.</p>
          <Link href="/">← Back to Home</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{item.title} - AI News Hub</title>
        <meta name="description" content={item.summary || item.title} />
      </Head>

      <Header />

      <article className="detail">
        <Link href="/" className="detail__back">
          ← Back to Home
        </Link>

        <div className="detail__meta">
          <span className={`card__badge${item.type === "video" ? " card__badge--video" : ""}`}>
            {item.type}
          </span>
          <span>{item.source.name}</span>
          {item.author && <span>by {item.author}</span>}
          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
        </div>

        <h1 className="detail__title">{item.title}</h1>

        {/* Video player */}
        {item.videoMeta?.videoId && (
          <iframe
            className="detail__video"
            src={`https://www.youtube.com/embed/${item.videoMeta.videoId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {item.thumbnailUrl && !item.videoMeta?.videoId && (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          />
        )}

        {item.summary && <p className="detail__summary">{item.summary}</p>}

        {item.contentSnippet && item.contentSnippet !== item.summary && (
          <div className="detail__content">
            <p>{item.contentSnippet}</p>
          </div>
        )}

        <div className="card__topics mb-2">
          {item.topics.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        {item.videoMeta && (
          <div className="mb-2" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {item.videoMeta.channelName && <span>Channel: {item.videoMeta.channelName} · </span>}
            {item.videoMeta.duration && <span>Duration: {item.videoMeta.duration} · </span>}
            {item.metricsViews > 0 && <span>{item.metricsViews.toLocaleString()} views</span>}
          </div>
        )}

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="detail__link"
        >
          Read Original →
        </a>

        {/* Related items */}
        {related.length > 0 && (
          <div className="detail__related">
            <h3>Related Stories</h3>
            <div className="detail__related-grid">
              {related.map((r) => (
                <ItemCard key={r.id} {...r} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
