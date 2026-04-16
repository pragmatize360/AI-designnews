# Setup & Deployment Guide

Complete guide for setting up, configuring, and deploying AI Design News.

## Table of Contents

1. [Local Development](#local-development)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

- **Node.js**: 18+ ([download](https://nodejs.org))
- **npm**: included with Node.js
- **Git**: ([download](https://git-scm.com))
- **PostgreSQL**: 12+ (or use Supabase)

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/pragmatize360/AI-designnews.git
cd AI-designnews

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database URL

# 4. Initialize database
npx prisma db push
npx prisma db seed

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Database Setup

### Option 1: Supabase (Recommended for Production)

Supabase provides a hosted PostgreSQL database with built-in API.

#### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Fill in project details:
   - **Name**: ai-design-news
   - **Database Password**: Strong random password
   - **Region**: Closest to your users
4. Click **Create new project** (takes 2-5 minutes)

#### Step 2: Get Connection String

1. Go to **Settings** → **Database**
2. Find **Connection String** section
3. Copy the connection string with your password

#### Step 3: Update .env

```
DATABASE_URL="postgresql://postgres.XXXX:XXXX@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.XXXX:XXXX@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

#### Step 4: Push Schema

```bash
npx prisma db push
```

### Option 2: Local PostgreSQL

For local development without external services.

#### Step 1: Install PostgreSQL

**macOS** (Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows**: [Download installer](https://www.postgresql.org/download/windows/)

#### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE ai_news_hub;
CREATE USER ai_dev WITH PASSWORD 'secure_password';
ALTER ROLE ai_dev WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE ai_news_hub TO ai_dev;
\q
```

#### Step 3: Update .env

```
DATABASE_URL="postgresql://ai_dev:secure_password@localhost:5432/ai_news_hub"
DIRECT_URL="postgresql://ai_dev:secure_password@localhost:5432/ai_news_hub"
```

#### Step 4: Push Schema

```bash
npx prisma db push
```

### Option 3: Docker

Use Docker for consistent development environment.

```bash
# Create docker-compose.yml
docker-compose up -d

# Connect and initialize
npx prisma db push
npx prisma db seed
```

---

## Environment Configuration

### .env File

Create `.env` in project root with:

```bash
# Database (choose one)
DATABASE_URL="postgresql://user:pass@host:5432/db"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# Admin security token (generate: openssl rand -hex 32)
ADMIN_TOKEN="your_secure_admin_token_here"

# Optional: API configuration
API_BASE_URL="https://ai-designnews.vercel.app"
API_TIMEOUT="30000"

# Optional: Monitoring
SENTRY_DSN=""
LOG_LEVEL="info"
```

### Generate Secure Admin Token

```bash
# macOS/Linux
openssl rand -hex 32

# Windows (PowerShell)
-join ([char[]](33..126) | Get-Random -Count 32)
```

Or use an online generator: https://generate.plus/en/base64

---

## Seeding Initial Data

### Automatic Seed

```bash
# Runs seed from prisma/seed.ts
npx prisma db seed
```

This adds:
- ✅ 51 RSS feeds (AI/ML research, design, tech blogs)
- ✅ 50+ YouTube channels
- ✅ Configure all sources with appropriate tags and trust tiers

### Manual Seed

Add your own sources:

```bash
# Connect to database
psql $DATABASE_URL

# Insert source manually
INSERT INTO "Source" (id, name, type, url, "trustTier", tags)
VALUES (
  gen_random_uuid(),
  'My Source',
  'rss',
  'https://example.com/feed',
  'influencer',
  '{"custom"}' ::text[]
);
```

---

## Deployment

### Deploy to Vercel

Vercel automatically deploys on each git push.

#### Step 1: Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Select your GitHub repository
4. Vercel auto-detects Next.js project

#### Step 2: Configure Environment

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `ADMIN_TOKEN`

#### Step 3: Deploy

1. Click **Deploy**
2. Vercel builds and deploys automatically

**Deployment URL**: `https://YOUR_PROJECT.vercel.app`

### Deploy to Other Platforms

#### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `.next`
4. Add environment variables
5. Deploy

#### Railway

1. Create new project
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Deploy

#### Docker (Self-hosted)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ai-design-news .
docker run -p 3000:3000 -e DATABASE_URL="..." ai-design-news
```

---

## Staging vs Production

### Staging Setup

For testing before production:

```bash
# .env.staging
DATABASE_URL="postgresql://...staging-db..."
ADMIN_TOKEN="staging-token"
```

Deploy to staging:
```bash
vercel --prod --env staging
```

### Production Setup

```bash
# .env.production
DATABASE_URL="postgresql://...production-db..."
ADMIN_TOKEN="production-token"
SENTRY_DSN="your-sentry-dsn"
```

---

## Running Ingestion

### Manual Ingestion

```bash
# One-time ingestion
npm run ingest

# Or via API
curl -X POST "https://ai-designnews.vercel.app/api/ingestion" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullRun": false}'
```

### Scheduled Ingestion

Configure via Vercel Cron (requires Vercel Pro):

```json
{
  "crons": [{
    "path": "/api/ingestion",
    "schedule": "0 * * * *"
  }]
}
```

---

## Monitoring & Maintenance

### Database Backups

#### Supabase
- Automatic daily backups
- Manual backup in **Settings** → **Backups**

#### Self-hosted
```bash
# Daily backup script
0 2 * * * pg_dump $DATABASE_URL > backups/db-$(date +\%Y-\%m-\%d).sql
```

### Performance Monitoring

```bash
# Check slow queries
SELECT query, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC;
```

### Database Optimization

```bash
# Analyze table
ANALYZE "Item";

# Reindex if needed
REINDEX TABLE "Item";

# Vacuum (cleanup)
VACUUM "Item";
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase firewall (if applicable)
```

### Issue: "Prisma migration conflicts"

**Solution:**
```bash
# Skip and reset
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate dev --name fix
npx prisma db push
```

### Issue: "Seeds fail to run"

**Solution:**
```bash
# Clear existing data first
npx prisma db push --force-reset

# Then seed
npx prisma db seed
```

### Issue: "Import plugin from manifest fails"

**Solution:**
```bash
# Verify manifest.json syntax
jsonlint figma-plugin/manifest.json

# Ensure absolute path is used
cat figma-plugin/manifest.json
```

### Issue: "API returns 500 error"

**Solution:**
```bash
# Check services
npm run dev

# View logs
tail -f .vercel/output.log

# Verify environment variables
env | grep DATABASE
```

---

## Production Checklist

- [ ] Database connection tested
- [ ] Environment variables configured
- [ ] Seeds run successfully
- [ ] Admin token generated and stored securely
- [ ] CORS headers configured
- [ ] SSL certificate installed
- [ ] Monitoring/alerting setup
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Figma plugin manifest updated with production URL

---

## Performance Optimization

### Database Indexes

```sql
-- Already configured in schema, but verify:
CREATE INDEX idx_item_sourceId ON "Item"("sourceId");
CREATE INDEX idx_item_createdAt ON "Item"("createdAt" DESC);
CREATE INDEX idx_item_type ON "Item"("type");
```

### Caching

Consider adding Redis for frequently accessed data:

```bash
# Install redis
brew install redis
redis-server

# Use in your app
const redis = require('redis');
```

### Image Optimization

Use `next/image` for thumbnail caching:

```jsx
import Image from 'next/image';

<Image
  src={item.thumbnail}
  alt={item.title}
  width={320}
  height={180}
  placeholder="blur"
/>
```

---

## Support

- **Issues**: https://github.com/pragmatize360/AI-designnews/issues
- **API Docs**: See `API.md`
- **Figma Plugin**: See `figma-plugin/README.md`

---

## Next Steps

1. ✅ Database configured
2. ✅ Environment variables set
3. ✅ Seeds run
4. ✅ Server running locally
5. 🎯 **Next**: Read `API.md` for API integration
6. 🎯 **Next**: Install Figma plugin from `figma-plugin/`
7. 🎯 **Next**: Deploy to production (Vercel preferred)
