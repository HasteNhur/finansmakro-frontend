# FinansMakro.no - Frontend (Vercel + Supabase)

This is the frontend-only version of FinansMakro.no, designed to run on Vercel with Supabase as the backend.

## Architecture

- **Frontend**: React + Vite (deployed to Vercel)
- **Database**: Supabase PostgreSQL
- **Backend Logic**: Supabase Edge Functions
- **AI Processing**: OpenAI GPT-4o (via Edge Functions)

## Quick Setup

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in Supabase SQL Editor:
   ```sql
   -- Copy content from supabase/migrations/001_initial_schema.sql
   ```
3. Deploy Edge Functions:
   ```bash
   npm install -g supabase
   supabase login
   supabase functions deploy generate-insights
   supabase functions deploy update-market-data
   supabase functions deploy fear-greed-index
   supabase functions deploy daily-pulse
   ```

### 2. Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Add secrets to Supabase for Edge Functions:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SUPABASE_SERVICE_ROLE_KEY` - For Edge Functions database access

### 3. Local Development

```bash
npm install
npm run dev
```

### 4. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically via GitHub integration

## API Endpoints (Edge Functions)

- `generate-insights` - AI-powered article analysis
- `update-market-data` - Fetch Norwegian stocks and crypto data
- `fear-greed-index` - Calculate Norwegian market sentiment
- `daily-pulse` - Generate daily market summary

## Data Sources

- **Norwegian Stocks**: Yahoo Finance API
- **Cryptocurrency**: CoinGecko API
- **Currency Rates**: ExchangeRate API
- **AI Insights**: OpenAI GPT-4o

## Features

- Real-time Norwegian market data in NOK
- AI-generated market insights in Norwegian
- Fear & Greed Index for Norwegian markets
- Daily market pulse/summary
- Responsive design optimized for mobile
- Automatic data refresh via Edge Functions

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Edge Functions deployed
- [ ] Environment variables configured
- [ ] OpenAI API key added to Supabase secrets
- [ ] Vercel project connected
- [ ] Domain configured (optional)

## Monitoring

- Check Supabase Dashboard for database status
- Monitor Edge Functions logs in Supabase
- Use Vercel Analytics for frontend performance
- Set up Supabase alerts for API usage

## Scaling

- Edge Functions auto-scale with usage
- Database can be upgraded in Supabase dashboard
- Vercel handles frontend scaling automatically
- Consider implementing caching for high-traffic scenarios