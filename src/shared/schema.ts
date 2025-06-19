// Shared types for both Express and Supabase compatibility
export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  url: string;
  image_url?: string;
  published_at: string;
  category: string;
  featured: boolean;
  sentiment: string;
  reading_time: string;
  insight_generated: boolean;
  created_at: string;
}

export interface MarketData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  category: string;
  last_update: string;
  created_at: string;
}

export interface Insight {
  id: number;
  article_title: string;
  content: string;
  sentiment: string;
  relevant_symbols: string[];
  created_at: string;
}