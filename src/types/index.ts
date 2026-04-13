import type {
  Source as PrismaSource,
  Item as PrismaItem,
  VideoMeta as PrismaVideoMeta,
  ManualCuration as PrismaManualCuration,
  IngestionRun as PrismaIngestionRun,
  TrustTier,
  ItemType,
  SourceType,
  IngestionStatus,
} from "@prisma/client";

// Re-export Prisma enums for convenience
export type { TrustTier, ItemType, SourceType, IngestionStatus };

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

export type Source = PrismaSource;

export interface SourceWithCount extends Source {
  _count: { items: number };
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

export type Item = PrismaItem;

export interface ItemWithRelations extends Item {
  source: Pick<Source, "name" | "trustTier" | "type" | "url">;
  videoMeta: VideoMeta | null;
  curations: ManualCuration[];
}

/** Lightweight item shape returned by list / feed endpoints */
export interface FeedItem {
  id: string;
  title: string;
  summary: string | null;
  type: ItemType;
  publishedAt: string;
  topics: string[];
  thumbnailUrl: string | null;
  pinned: boolean;
  source: Pick<Source, "name" | "trustTier" | "type">;
}

/** Scored item used internally for ranking */
export interface ScoredItem extends FeedItem {
  score: number;
}

// ---------------------------------------------------------------------------
// Video Meta
// ---------------------------------------------------------------------------

export type VideoMeta = PrismaVideoMeta;

// ---------------------------------------------------------------------------
// Manual Curation
// ---------------------------------------------------------------------------

export type ManualCuration = PrismaManualCuration;

// ---------------------------------------------------------------------------
// Ingestion Run
// ---------------------------------------------------------------------------

export type IngestionRun = PrismaIngestionRun;

export interface IngestionRunStats {
  total: number;
  inserted: number;
  duplicates: number;
  errors: number;
}

// ---------------------------------------------------------------------------
// API response shapes
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ItemDetailResponse {
  item: ItemWithRelations;
  related: FeedItem[];
}

export interface DashboardStats {
  totalItems: number;
  itemsLast24h: number;
  totalSources: number;
  enabledSources: number;
  failedRunsLast24h: number;
  duplicateRate: number;
  degradedSources: Array<{
    id: string;
    name: string;
    consecutiveFailures: number;
  }>;
  recentRuns: IngestionRun[];
}

// ---------------------------------------------------------------------------
// Parsed item (ingestion pipeline)
// ---------------------------------------------------------------------------

export interface ParsedItem {
  title: string;
  url: string;
  publishedAt: Date;
  author: string | null;
  summary: string | null;
  contentSnippet: string | null;
  type: ItemType;
  topics: string[];
  thumbnailUrl: string | null;
  canonicalHash: string;
  language: string;
  metricsViews: number;
  metricsLikes: number;
  rawPayload: Record<string, unknown>;
  videoMeta?: {
    channelName: string;
    channelId: string;
    videoId: string;
    duration: string | null;
  };
}
