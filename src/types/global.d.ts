// Global type declarations for build compatibility

declare global {
  interface MarketData {
    id: number;
    symbol: string;
    name: string;
    price: number;
    change: number;
    change_percent: number;
    changePercent?: number; // Compatibility alias
    currency: string;
    category: string;
    created_at?: string;
    updated_at?: string;
    isPositive?: boolean; // Computed property
  }

  interface Article {
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
    reading_time: string;
    featured: boolean;
    created_at?: string;
    updated_at?: string;
  }

  interface Insight {
    id: number;
    article_title: string;
    insight_text: string;
    confidence_score: number;
    created_at?: string;
    updated_at?: string;
  }
}

export {};