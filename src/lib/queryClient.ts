import { QueryClient } from "@tanstack/react-query";
import { supabase } from './supabase';

// Environment detection for hybrid deployment
const isSupabaseConfigured = () => {
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Unified data fetching that works with both Express and Supabase
export async function fetchArticles() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-articles`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
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
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-market-data`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

export async function fetchInsights() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-insights`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
}

export async function getFearGreedIndex() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/fear-greed-index`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching fear greed index:', error);
    throw error;
  }
}

export async function getDailyPulse() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/daily-pulse`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching daily pulse:', error);
    throw error;
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
