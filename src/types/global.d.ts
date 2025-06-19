// Global type overrides for production builds
declare global {
  interface MarketData {
    id: number;
    symbol: string;
    name: string;
    price: number;
    change: number;
    change_percent: number;
    changePercent: number; // Alias for compatibility
    currency: string;
    category: string;
    last_updated: string;
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
    image_url: string | null;
    published_at: string;
    category: string;
    reading_time: string;
    created_at: string;
    updated_at: string;
  }

  interface Insight {
    id: number;
    article_title: string;
    content: string;
    generated_at: string;
    created_at: string;
    updated_at: string;
  }
}

// Module augmentation for better type safety
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

export {};