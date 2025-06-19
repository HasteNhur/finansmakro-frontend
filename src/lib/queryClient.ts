import { QueryClient } from "@tanstack/react-query";
import { supabase } from './supabase';

// Environment detection for hybrid deployment
const isSupabaseConfigured = () => {
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
};

// Unified data fetching that works with both Express and Supabase
export async function fetchArticles() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('Failed to fetch articles');
    return await res.json();
  }
}

export async function fetchFeaturedArticles() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/articles/featured');
    if (!res.ok) throw new Error('Failed to fetch featured articles');
    return await res.json();
  }
}

export async function fetchMarketData() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .order('last_update', { ascending: false });
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/market-data');
    if (!res.ok) throw new Error('Failed to fetch market data');
    return await res.json();
  }
}

export async function fetchInsights() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/insights');
    if (!res.ok) throw new Error('Failed to fetch insights');
    return await res.json();
  }
}

export async function getFearGreedIndex() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.functions.invoke('fear-greed-index');
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/fear-greed');
    if (!res.ok) throw new Error('Failed to fetch fear greed index');
    return await res.json();
  }
}

export async function getDailyPulse() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.functions.invoke('daily-pulse');
    if (error) throw error;
    return data;
  } else {
    const res = await fetch('/api/daily-pulse');
    if (!res.ok) throw new Error('Failed to fetch daily pulse');
    return await res.json();
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
