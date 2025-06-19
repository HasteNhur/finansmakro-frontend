import { createClient } from '@supabase/supabase-js'

// For development, use placeholder values if env vars are missing
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching the original schema
export interface Article {
  id: number
  title: string
  summary: string
  content: string
  author: string
  source: string
  url: string
  imageUrl: string
  publishedAt: string
  category: string
  featured: boolean
  sentiment: string
  readingTime: string
  createdAt: string
}

export interface MarketData {
  id: number
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: string
  category: string
  lastUpdate: string
  createdAt: string
}

export interface Insight {
  id: number
  articleTitle: string
  content: string
  sentiment: string
  relevantSymbols: string[]
  createdAt: string
}