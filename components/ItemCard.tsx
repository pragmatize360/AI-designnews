import Link from "next/link";

interface ItemCardProps {
  id: string;
  title: string;
  summary?: string | null;
  type: string;
  publishedAt: string;
  source?: { name: string; trustTier: string; type: string } | null;
  topics?: string[];
  thumbnailUrl?: string | null;
  pinned?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function typeBadgeClass(type: string): string {
  switch (type) {
    case "video":
      return "card__badge card__badge--video";
    case "paper":
      return "card__badge card__badge--paper";
    case "release":
      return "card__badge card__badge--release";
    default:
      return "card__badge";
  }
}

export default function ItemCard({
  id,
  title,
  summary,
  type,
  publishedAt,
  source,
  topics,
  thumbnailUrl,
  pinned,
}: ItemCardProps) {
  return (
    <div className="card">
      {thumbnailUrl && (
        <img
          className="card__thumbnail"
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
        />
      )}

      <div className="card__header">
        <span className={typeBadgeClass(type)}>
          {type === "video" ? "▶ Video" : type === "paper" ? "📄 Paper" : type === "release" ? "🚀 Release" : "📰 Article"}
        </span>
        {source && <span>{source.name}</span>}
        {pinned && <span title="Pinned">📌</span>}
      </div>

      <Link href={`/items/${id}`}>
        <h3 className="card__title">{title}</h3>
      </Link>

      {summary && <p className="card__summary">{summary}</p>}

      <div className="card__footer">
        <div className="card__topics">
          {topics?.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <span className="card__time">{timeAgo(publishedAt)}</span>
      </div>

      <Link href={`/items/${id}`} className="card__open">
        Open →
      </Link>
    </div>
  );
}
