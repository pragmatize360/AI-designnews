import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";

interface SearchItem {
  id: string;
  title: string;
  summary: string | null;
  type: string;
  publishedAt: string;
  topics: string[];
  thumbnailUrl: string | null;
  source: { name: string; trustTier: string; type: string };
}

export default function SearchPage() {
  const router = useRouter();
  const q = (router.query.q as string) || "";
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <Head>
        <title>{q ? `Search: ${q}` : "Search"} - AI News Hub</title>
      </Head>

      <Header />

      <div className="feed">
        <h2 className="feed__title">
          {q ? `Search results for "${q}" (${total})` : "Search AI News"}
        </h2>

        {loading && <p>Searching...</p>}

        {!loading && q && items.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>No results found for &quot;{q}&quot;</p>
        )}

        <div className="feed__grid">
          {items.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
