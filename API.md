# API Documentation

Complete reference for the AI Design News API endpoints.

## Base URL

- **Production**: `https://ai-designnews.vercel.app/api`
- **Local Development**: `http://localhost:3000/api`

## Authentication

Most endpoints are public (no auth required). Admin endpoints require:

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Set `ADMIN_TOKEN` in your `.env` file.

---

## Public Endpoints

### GET `/sources`

List all available sources.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 50 | Items per page (1-100) |
| `type` | string | - | Filter by type: `rss`, `html`, `youtube`, `api` |
| `enabled` | boolean | true | Only enabled sources |
| `tags` | string | - | Filter by tag (comma-separated) |

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/sources?type=youtube&limit=10"
```

**Response**

```json
{
  "sources": [
    {
      "id": "cmnxbeidz000s12lq...",
      "name": "Fireship",
      "type": "youtube",
      "url": "https://www.youtube.com/feeds/videos.xml?channel_id=...",
      "trustTier": "influencer",
      "enabled": true,
      "tags": ["development", "youtube", "frontend"],
      "consecutiveFailures": 0,
      "degradedUntil": null,
      "createdAt": "2026-04-13T14:55:40.439Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 101,
    "totalPages": 11
  }
}
```

---

### GET `/items`

Get paginated content items.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (1-50) |
| `type` | string | - | Filter: `article`, `video`, `paper`, `release` |
| `focusArea` | string | - | Filter by area: `ai-research`, `design-ux`, `frontend-dev`, `product-industry`, `youtube-creator`, `podcast-newsletter` |
| `sortBy` | string | `score` | Sort: `score`, `date`, `views` |

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/items?type=video&focusArea=ai-research&limit=10"
```

**Response**

```json
{
  "data": [
    {
      "id": "cmqz1a2b3c...",
      "title": "How to Build an LLM from Scratch",
      "summary": "Deep dive into transformer architecture...",
      "url": "https://youtube.com/watch?v=...",
      "type": "video",
      "source": {
        "id": "cmnxbeidz000s12lq...",
        "name": "Fireship"
      },
      "topics": ["ai", "llm", "transformers"],
      "scoreTotal": 95,
      "views": 50000,
      "publishedAt": "2026-04-15T10:30:00Z",
      "createdAt": "2026-04-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 523,
    "totalPages": 53
  }
}
```

---

### GET `/items/:id`

Get a single item with related items.

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/items/cmqz1a2b3c"
```

**Response**

```json
{
  "item": {
    "id": "cmqz1a2b3c",
    "title": "...",
    "url": "...",
    "source": { ... },
    "topics": [ ... ]
  },
  "related": [
    { "id": "...", "title": "...", "topics": [ ... ] }
  ]
}
```

---

### GET `/search`

Search items by keywords.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | **required** | Search query |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `contentCategory` | string | - | Filter: `featured`, `curated`, `viral` |
| `focusArea` | string | - | Filter by focus area |

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/search?q=react+performance&limit=5"
```

**Response**

```json
{
  "query": "react performance",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### GET `/filters`

Get available filters for UI components.

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/filters"
```

**Response**

```json
{
  "contentTypes": ["article", "video", "paper", "release"],
  "focusAreas": [
    { "id": "ai-research", "label": "AI/ML Research" },
    { "id": "design-ux", "label": "Design/UX" },
    { "id": "frontend-dev", "label": "Frontend Dev" },
    { "id": "product-industry", "label": "Product/Industry" },
    { "id": "youtube-creator", "label": "YouTube Creators" },
    { "id": "podcast-newsletter", "label": "Podcasts/Newsletters" }
  ],
  "trustTiers": ["official_vendor", "reputed_press", "research_university", "influencer"]
}
```

---

## Ingestion Endpoints

### GET `/ingestion/status`

Get current ingestion status.

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/ingestion/status"
```

**Response**

```json
{
  "isRunning": false,
  "lastRun": {
    "id": "run_abc123",
    "status": "success",
    "startedAt": "2026-04-15T10:00:00Z",
    "completedAt": "2026-04-15T10:15:00Z",
    "itemsProcessed": 234,
    "itemsAdded": 45,
    "itemsSkipped": 189
  }
}
```

---

### GET `/ingestion/runs`

Get ingestion history.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `status` | string | - | Filter: `running`, `success`, `partial`, `failed` |

**Example**

```bash
curl "https://ai-designnews.vercel.app/api/ingestion/runs?status=success&limit=5"
```

---

### POST `/ingestion` (Admin)

Trigger a new ingestion run.

**Headers**

```
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

**Body**

```json
{
  "sourceIds": ["id1", "id2"],  // optional - specific sources
  "fullRun": false              // optional - clear items before ingesting
}
```

**Example**

```bash
curl -X POST "https://ai-designnews.vercel.app/api/ingestion" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullRun": false}'
```

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer YOUR_ADMIN_TOKEN` header.

### GET `/admin/dashboard`

Dashboard statistics.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://ai-designnews.vercel.app/api/admin/dashboard"
```

**Response**

```json
{
  "totalSources": 101,
  "totalItems": 5234,
  "averageScore": 72.5,
  "lastIngestion": {
    "completedAt": "2026-04-15T10:15:00Z",
    "status": "success"
  }
}
```

---

### GET `/admin/sources`

List all sources (with disabled ones).

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://ai-designnews.vercel.app/api/admin/sources"
```

---

### POST `/admin/sources`

Create a new source.

```bash
curl -X POST "https://ai-designnews.vercel.app/api/admin/sources" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Source",
    "type": "rss",
    "url": "https://example.com/feed",
    "trustTier": "influencer",
    "tags": ["custom", "important"]
  }'
```

---

### GET `/admin/sources/:id`

Get a specific source.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://ai-designnews.vercel.app/api/admin/sources/cmnxbeidz000s12lq"
```

---

### PUT `/admin/sources/:id`

Update a source.

```bash
curl -X PUT "https://ai-designnews.vercel.app/api/admin/sources/cmnxbeidz000s12lq" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false,
    "tags": ["updated", "disabled"]
  }'
```

---

### DELETE `/admin/sources/:id`

Delete a source.

```bash
curl -X DELETE "https://ai-designnews.vercel.app/api/admin/sources/cmnxbeidz000s12lq" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET/POST `/admin/curations`

Manage curated collections.

```bash
# Get all curations
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://ai-designnews.vercel.app/api/admin/curations"

# Create curation
curl -X POST "https://ai-designnews.vercel.app/api/admin/curations" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Best of AI Research",
    "itemIds": ["id1", "id2", "id3"]
  }'
```

---

### POST `/admin/items`

Manually add an item.

```bash
curl -X POST "https://ai-designnews.vercel.app/api/admin/items" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Great Article Title",
    "summary": "Brief summary...",
    "url": "https://example.com/article",
    "type": "article",
    "sourceId": "source_id_here",
    "topics": ["ai", "research"]
  }'
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-04-15T10:15:00Z"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (missing/invalid auth) |
| 404 | Not found |
| 500 | Server error |

---

## Rate Limiting

- **Public endpoints**: 100 requests per minute
- **Admin endpoints**: 50 requests per minute
- **Ingestion endpoints**: 10 requests per minute

Rate limit headers included in response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1713180900
```

---

## CORS Policy

Public endpoints have CORS enabled for:

- **Allowed origins**: Any (*)
- **Allowed methods**: GET, OPTIONS
- **Allowed headers**: Content-Type, Authorization

Perfect for Figma plugins and web integrations!

---

## Integration Examples

### Frontend (React)

```javascript
// Fetch items
const response = await fetch(
  'https://ai-designnews.vercel.app/api/items?type=video&limit=10'
);
const { data, pagination } = await response.json();
```

### Figma Plugin

```javascript
// Search in Figma plugin
const results = await fetch(
  `https://ai-designnews.vercel.app/api/search?q=${query}`
);
```

### Node.js

```javascript
// Fetch in Node.js
const axios = require('axios');

const items = await axios.get(
  'https://ai-designnews.vercel.app/api/items',
  {
    params: { type: 'video', limit: 20 }
  }
);
```

---

## Webhook Integration (Coming Soon)

Subscribe to content updates via webhooks.

---

## Support & Issues

- **API Status**: https://ai-designnews.vercel.app
- **GitHub Issues**: https://github.com/pragmatize360/AI-designnews/issues
- **Email**: support@ai-designnews.vercel.app

---

## Changelog

### v1.0.0 (Current)

- ✅ 101 content sources
- ✅ Full search functionality
- ✅ Admin CRUD operations
- ✅ Ingestion pipeline
- ✅ CORS enabled for public endpoints
