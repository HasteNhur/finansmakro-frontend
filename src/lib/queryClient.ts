import { QueryClient } from "@tanstack/react-query";
import { supabase } from './supabase';

// Supabase-based data fetching functions
export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchFeaturedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  
  if (error) throw error;
  return data;
}

export async function fetchArticlesByCategory(category: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchMarketData() {
  const { data, error } = await supabase
    .from('market_data')
    .select('*')
    .order('last_update', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchInsights() {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  return data;
}

// Edge Function calls for AI processing
export async function generateInsights() {
  const { data, error } = await supabase.functions.invoke('generate-insights');
  if (error) throw error;
  return data;
}

export async function updateMarketData() {
  const { data, error } = await supabase.functions.invoke('update-market-data');
  if (error) throw error;
  return data;
}

export async function getFearGreedIndex() {
  const { data, error } = await supabase.functions.invoke('fear-greed-index');
  if (error) throw error;
  return data;
}

export async function getDailyPulse() {
  const { data, error } = await supabase.functions.invoke('daily-pulse');
  if (error) throw error;
  return data;
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
