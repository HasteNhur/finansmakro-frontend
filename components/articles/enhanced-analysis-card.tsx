import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Article } from '@shared/schema';

interface MarketImpact {
  symbol: string;
  company: string;
  priceChange: number;
  direction: 'up' | 'down' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
}

interface EnhancedArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
  readingTime: string;
  marketCorrelation: {
    hasMarketData: boolean;
    impacts: MarketImpact[];
  };
}

function CompanyTag({ impact }: { impact: MarketImpact }) {
  const isPositive = impact.direction === 'up';
  const isNegative = impact.direction === 'down';
  
  const bgColor = isPositive ? 'bg-green-100' : isNegative ? 'bg-red-100' : 'bg-gray-100';
  const textColor = isPositive ? 'text-green-800' : isNegative ? 'text-red-800' : 'text-gray-800';
  const borderColor = isPositive ? 'border-green-300' : isNegative ? 'border-red-300' : 'border-gray-300';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}>
      {isPositive && <TrendingUp className="w-3 h-3" />}
      {isNegative && <TrendingDown className="w-3 h-3" />}
      {impact.company}
      {impact.direction !== 'neutral' && (
        <span className="ml-1">
          {isPositive ? '+' : ''}{impact.priceChange.toFixed(1)}%
        </span>
      )}
    </span>
  );
}

interface EnhancedAnalysisCardProps {
  viewMode: 'makro' | 'krypto';
}

export default function EnhancedAnalysisCard({ viewMode }: EnhancedAnalysisCardProps) {
  const { data: allArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  if (isLoading || !allArticles || allArticles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Laster {viewMode === 'makro' ? 'norske finansnyheter' : 'kryptovaluta-nyheter'}...</p>
        </div>
      </div>
    );
  }

  // Filter articles based on viewMode
  const filteredArticles = allArticles.filter(article => {
    if (viewMode === 'krypto') {
      // Show crypto articles
      const cryptoKeywords = [
        'bitcoin', 'ethereum', 'cryptocurrency', 'blockchain', 'btc', 'eth', 'crypto',
        'coindesk', 'cointelegraph', 'cryptonews', 'defi', 'nft', 'web3', 'blackrock',
        'solana', 'cardano', 'ripple', 'polkadot', 'avalanche', 'polygon', 'chainlink', 'uniswap',
        'whale', 'hodl', 'staking', 'yield farming', 'liquidated', 'outflow', 'inflow', 'pepe'
      ];
      const contentLower = `${article.title} ${article.summary} ${article.author}`.toLowerCase();
      return cryptoKeywords.some(keyword => contentLower.includes(keyword));
    } else {
      // Show Norwegian financial articles, exclude crypto
      const cryptoKeywords = [
        'bitcoin', 'ethereum', 'cryptocurrency', 'blockchain', 'btc', 'eth', 'crypto',
        'coindesk', 'cointelegraph', 'cryptonews', 'defi', 'nft', 'web3', 'blackrock',
        'solana', 'cardano', 'ripple', 'polkadot', 'avalanche', 'polygon', 'chainlink', 'uniswap',
        'whale', 'hodl', 'staking', 'yield farming', 'liquidated', 'outflow', 'inflow', 'pepe'
      ];
      
      // Norwegian sources
      const norwegianSources = ['E24', 'Dagens Næringsliv', 'Teknisk Ukeblad', 'Kapital', 'Hegnar'];
      const isNorwegianSource = norwegianSources.includes(article.author);
      
      const contentLower = `${article.title} ${article.summary} ${article.author}`.toLowerCase();
      const hasCryptoContent = cryptoKeywords.some(keyword => contentLower.includes(keyword));
      
      // Show Norwegian articles that are not crypto-related
      return isNorwegianSource && !hasCryptoContent;
    }
  });

  // Take the first 3 unique articles
  const displayArticles = filteredArticles
    .filter((article, index, self) => 
      self.findIndex(a => a.title === article.title) === index
    )
    .slice(0, 3)
    .map(article => ({
      ...article,
      marketCorrelation: {
        hasMarketData: false,
        impacts: []
      }
    }));

  return (
    <div className="space-y-4">
      {displayArticles.map((article) => (
        <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-black mb-3 leading-tight">
              {article.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {article.summary}
            </p>
            
            {/* Show much more detailed content */}
            {article.content && article.content !== article.summary && (
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {article.content.length > 400 ? `${article.content.substring(0, 400)}...` : article.content}
              </p>
            )}
            
            {/* If content is same as summary, show more from summary */}
            {(!article.content || article.content === article.summary) && article.summary.length > 100 && (
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Les mer om denne saken som påvirker norske markeder og investorer. Denne utviklingen kan ha betydning for både privat- og institusjonelle investorer i Norge.
              </p>
            )}
            
            {/* Company Impact Tags */}
            {article.marketCorrelation.impacts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.marketCorrelation.impacts.map((impact, index) => (
                  <CompanyTag key={index} impact={impact} />
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{article.author}</span>
              <div className="flex items-center space-x-4">
                <span>{article.readingTime}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('no-NO')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {displayArticles.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            Analyserer norske finansnyheter for markedskorrelasjon...
          </p>
        </div>
      )}
    </div>
  );
}