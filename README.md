# AI News Hub 🤖📰

A comprehensive AI news aggregation platform built with **Next.js 14**, **Prisma**, and **PostgreSQL**. Aggregates news from 100+ trusted sources including RSS feeds, YouTube channels, and web pages.

## Features

- **100+ Pre-configured Sources**: AI/ML labs, design/UX publications, frontend/dev tooling blogs, product/industry coverage, YouTube creators (~54 channels), and podcast feeds
- **Multi-format Ingestion**: RSS/Atom feeds, HTML parsing with CSS selectors, YouTube channel RSS
- **Smart Deduplication**: Canonical hash based on normalized title + URL host + date
- **Trust-based Scoring**: Official Vendor > Reputed Press > Research/University > Influencer
- **Topic Tagging**: Automatic keyword-based topic classification
- **Admin CMS**: Protected dashboard for managing sources, curations, and ingestion
- **Responsive UI**: Modern glassmorphism design with hero carousel, 3-column layout, and infinite scroll
- **Source Degradation**: Auto-skips sources after 3+ consecutive failures (24h cooldown)

## Tech Stack

- **Framework**: Next.js 15 (Pages Router)
- **Database**: PostgreSQL with Prisma ORM
- **RSS Parsing**: rss-parser
- **HTML Parsing**: cheerio
- **Deployment**: Vercel-ready

## Project Structure

```
pages/          # Next.js pages and API routes
components/     # Shared React components
src/lib/        # Utility modules (Prisma client, auth, ingestion, scoring)
src/styles/     # Global CSS styles
src/types/      # TypeScript type definitions
prisma/         # Prisma schema and seed script
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted via [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)

### 1. Clone and Install

```bash
git clone https://github.com/pragmatize360/AI-designnews.git
cd AI-designnews
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database connection string and admin token:

```
DATABASE_URL="postgresql://user:password@host:5432/ai_news_hub"
DIRECT_URL="postgresql://user:password@host:5432/ai_news_hub"
ADMIN_TOKEN="your-secure-admin-token"
```

### 3. Set Up Database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sources` | List all sources |
| GET | `/api/items?page=1&limit=20&section=official&type=video&topic=llm` | Paginated feed with filters |
| GET | `/api/items/[id]` | Item detail + related items |
| GET | `/api/search?q=query` | Search items by title/summary |
| POST | `/api/ingestion` | Trigger ingestion (admin auth) |
| GET | `/api/ingestion/runs` | Ingestion history |
| GET | `/api/admin/dashboard` | Dashboard stats (admin auth) |
| GET/POST | `/api/admin/sources` | CRUD sources (admin auth) |
| GET/PUT/DELETE | `/api/admin/sources/[id]` | Single source CRUD (admin auth) |
| GET/POST/DELETE | `/api/admin/curations` | Manage curations (admin auth) |
| POST | `/api/admin/items` | Add manual items (admin auth) |

### Public API Base URL

- Production base URL: `https://ai-designnews.vercel.app`
- Figma-safe read endpoints (CORS enabled):
  - `GET /api/items`
  - `GET /api/items/[id]`
  - `GET /api/search`
  - `GET /api/sources`
  - `GET /api/sources/[id]`
  - `GET /api/ingest/status`

Example:

```bash
curl "https://ai-designnews.vercel.app/api/items?limit=5&page=1"
```

### Authentication

Admin endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://your-app.vercel.app/api/admin/dashboard
```

## Cron / Scheduled Ingestion

### Option 1: Vercel Cron (recommended for Vercel deployments)

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/ingestion",
    "schedule": "0 */2 * * *"
  }]
}
```

### Option 2: External Cron Service

Use [cron-job.org](https://cron-job.org) or similar to POST to `/api/ingestion` every 2 hours:

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" https://your-app.vercel.app/api/ingestion
```

### Option 3: System Cron

```bash
crontab -e
# Add:
0 */2 * * * curl -X POST -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/ingestion
```

## Deployment to Vercel

1. Push to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. **Add environment variables** in Vercel → Project Settings → Environment Variables:
   - `DATABASE_URL` — PostgreSQL connection string (e.g. from [Supabase](https://supabase.com) or [Neon](https://neon.tech)). **Required** — the build and all API routes depend on this.
   - `DIRECT_URL` — Direct (non-pooled) PostgreSQL connection string (required for Prisma migrations)
   - `ADMIN_TOKEN` — Secret token for admin API endpoints
4. Deploy — Vercel auto-detects Next.js. The build script (`prisma generate && next build`) automatically generates the Prisma client before building.
5. Set up cron job for automated ingestion

> **Note:** If you see a 404 after deploying, ensure `DATABASE_URL` is set in Vercel environment variables and redeploy. Prisma must generate its client during the build step.

## Database Schema

- **Source**: News source configuration (RSS, HTML, YouTube, API)
- **Item**: Normalized news items with dedup hash
- **VideoMeta**: YouTube-specific metadata (videoId, channel, duration)
- **ManualCuration**: Pin/unpin items, add notes
- **IngestionRun**: Audit log for every ingestion run

## Admin Panel

Access at `/admin` with your admin token. Features:

- 📊 **Dashboard**: Items/24h, failure rates, duplicate rate, degraded sources
- 📡 **Sources**: Enable/disable, re-run ingestion per source
- 🔄 **Ingestion Runs**: View history, stats, and error logs

## Figma Consumption

AI Design News exposes a single stable endpoint for Figma Sites and plugins:

```
GET https://ai-designnews.vercel.app/api/items
```

CORS headers are included on every response so the endpoint can be called directly from browser-based Figma runtimes.

### Response schema

```json
{
  "items": [
    {
      "id": "clxxx",
      "title": "…",
      "summary": "…",
      "type": "article | video | paper | release",
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "thumbnailUrl": "https://…",
      "topics": ["design", "ux"],
      "contentCategory": "design | ai | dev | business",
      "source": { "name": "…", "trustTier": "…", "type": "…", "tags": ["…"] },
      "videoMeta": null,
      "pinned": false,
      "score": 0.85
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5163,
    "totalPages": 259
  }
}
```

### Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (1-based, default: 1) |
| `limit` | integer | Items per page (max 50, default: 20) |
| `type` | string | `article` \| `video` \| `paper` \| `release` |
| `section` | string | `official` \| `press` \| `creators` |
| `focusArea` | string | See focus area table below |
| `contentCategory` | string | `design` \| `ai` \| `dev` \| `business` |
| `topic` | string | Exact topic string, e.g. `large language models` |
| `sourceId` | string | Filter by source ID |
| `search` | string | Full-text search on title, summary, topics |

### focusArea values

| focusArea | What it returns |
|-----------|----------------|
| `research` | Items with research topics or from research_university sources |
| `design` | Items with design/UX/UI topics or from design-tagged sources |
| `frontend` | Items with frontend/web-dev topics or from frontend-tagged sources |
| `product` | Items with product/business/industry topics |
| `creators` | YouTube videos and influencer/creator sources |
| `podcasts` | Items from podcast-tagged sources |

### Example query strings for Figma Sites

```
# All videos from YouTube sources (grows as more channels are enabled)
# Videos are sourced from YouTube channels via RSS ingestion.
# After seeding and running ingestion the endpoint returns hundreds of video items.
https://ai-designnews.vercel.app/api/items?type=video&limit=50&page=1

# Articles only
https://ai-designnews.vercel.app/api/items?type=article&limit=20&page=1

# Feature updates / product releases
https://ai-designnews.vercel.app/api/items?type=release&limit=20&page=1

# White papers and research papers
https://ai-designnews.vercel.app/api/items?type=paper&limit=20&page=1

# Research focus area
https://ai-designnews.vercel.app/api/items?focusArea=research&limit=20&page=1

# Design / UX focus area
https://ai-designnews.vercel.app/api/items?focusArea=design&limit=20&page=1

# Frontend / dev tooling focus area
https://ai-designnews.vercel.app/api/items?focusArea=frontend&limit=20&page=1

# Product / industry focus area
https://ai-designnews.vercel.app/api/items?focusArea=product&limit=20&page=1

# YouTube creators and influencers
https://ai-designnews.vercel.app/api/items?focusArea=creators&limit=20&page=1

# Podcasts and newsletters
https://ai-designnews.vercel.app/api/items?focusArea=podcasts&limit=20&page=1

# Combine: design articles only
https://ai-designnews.vercel.app/api/items?focusArea=design&type=article&limit=20&page=1

# Load page 2 of videos
https://ai-designnews.vercel.app/api/items?type=video&limit=20&page=2
```

### Other public read endpoints

In addition to `/api/items`, these public GET endpoints also support CORS:

- `https://ai-designnews.vercel.app/api/sources?limit=50&page=1`
- `https://ai-designnews.vercel.app/api/ingest/status`

## Constraints & Ethics

- ❌ No scraping of paywalled content — stores metadata + link only
- ✅ Respects robots.txt — prefers official RSS/feeds
- 📏 Summaries capped at 280 chars unless full text is legally available
- 🔗 HTML extraction stores snippets only, never republishes full articles
- 🔒 Admin endpoints protected by token authentication

## License

MIT
