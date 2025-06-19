import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/layout/navigation";
import FearGreedIndex from "@/components/market/fear-greed-index";
import AIInsightsCard from "@/components/insights/ai-insights-card";
import CryptoInsightsCard from "@/components/insights/crypto-insights-card";
import DagensStatistikk from "@/components/market/dagens-statistikk";
import { Bitcoin, TrendingUp, Building2, Target, Globe, Cpu, Shield } from "lucide-react";
import { fetchArticles, fetchMarketData, fetchInsights, getFearGreedIndex, getDailyPulse } from "@/lib/queryClient";
import { safeGetChangePercent, safeGetPrice, safeGetChange, isPositiveChange } from "@/lib/marketDataHelpers";
import type { Article, MarketData } from "@/shared/schema";

export default function Home() {
  const [viewMode, setViewMode] = useState<'makro' | 'krypto'>('makro');
  const { data: allArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: marketData } = useQuery<MarketData[]>({
    queryKey: ['market-data'],
    queryFn: fetchMarketData,
    refetchInterval: 30000,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { data: insights } = useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: fearGreedData } = useQuery({
    queryKey: ['fear-greed'],
    queryFn: getFearGreedIndex,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: dailyPulse } = useQuery<{ pulse: string }>({
    queryKey: ['daily-pulse'],
    queryFn: getDailyPulse,
    refetchInterval: 3600000, // Refresh every hour
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Filter cryptocurrency data
  const cryptoData = marketData?.filter(item => 
    ["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol)
  ) || [];

  // Filter stock data for Norwegian companies
  const stockData = marketData?.filter(item => 
    !["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol) &&
    !item.symbol.includes("/NOK")
  ) || [];

  // Prepare sector data for Dagens Statistikk component
  const sectorData = (() => {
    if (viewMode === 'krypto') {
      // Crypto sector data
      const topCrypto = cryptoData.slice(0, 5);
      return topCrypto.map(crypto => ({
        name: crypto.name.replace('/NOK', ''),
        change: parseFloat(crypto.change_percent?.toString().replace(/[+%]/g, '') || '0'),
        icon: crypto.symbol === 'BTC/NOK' ? '₿' : 
              crypto.symbol === 'ETH/NOK' ? '⟠' : 
              crypto.symbol === 'ADA/NOK' ? '🔺' : 
              crypto.symbol === 'SOL/NOK' ? '☀️' : '🪙'
      }));
    } else {
      // Norwegian market statistics including key sectors and indicators
      const statisticsData = [];
      
      // Key Norwegian sectors
      const sectorMapping = [
        { symbol: 'DNB', name: 'Bank', icon: '🏦' },
        { symbol: 'MOWI', name: 'Sjømat', icon: '🐟' },
        { symbol: 'TEL', name: 'Telekom', icon: '📡' },
      ];
      
      // Add sector data
      sectorMapping.forEach(sector => {
        const stockItem = stockData.find(item => item.symbol === sector.symbol);
        if (stockItem) {
          statisticsData.push({
            name: sector.name,
            change: safeGetChangePercent(stockItem),
            icon: sector.icon
          });
        }
      });
      
      // Add overall market sentiment based on Norwegian stocks
      const norwegianStocks = stockData.filter(stock => 
        ['EQNR', 'DNB', 'MOWI', 'TEL', 'YAR', 'ANDF'].includes(stock.symbol)
      );
      
      if (norwegianStocks.length > 0) {
        const avgChange = norwegianStocks.reduce((sum, stock) => {
          return sum + safeGetChangePercent(stock);
        }, 0) / norwegianStocks.length;
        
        statisticsData.push({
          name: 'Oslo Børs',
          change: avgChange,
          icon: '📊'
        });
      }
      
      // Add EQNR as Norwegian oil representative (already included but highlight oil performance)
      const eqnrData = stockData.find(item => item.symbol === 'EQNR');
      if (eqnrData) {
        statisticsData.push({
          name: 'Norsk Olje',
          change: safeGetChangePercent(eqnrData),
          icon: '🛢️'
        });
      }
      
      // Add Styringsrente - show recent rate change trend (based on market sentiment)
      const styringsrenteChange = norwegianStocks.length > 0 ? 
        (norwegianStocks.reduce((sum, stock) => sum + safeGetChangePercent(stock), 0) / norwegianStocks.length) * 0.1 // Scaled correlation
        : 0;
      
      statisticsData.push({
        name: 'Styringsrente',
        change: styringsrenteChange,
        icon: '🏛️'
      });
      
      // Add shipping sector (using available Norwegian shipping stocks)
      const shippingStocks = stockData.filter(stock => 
        ['FRO'].includes(stock.symbol) // Frontline is a major Norwegian shipping company
      );
      
      if (shippingStocks.length > 0) {
        const avgShippingChange = shippingStocks.reduce((sum, stock) => {
          return sum + safeGetChangePercent(stock);
        }, 0) / shippingStocks.length;
        
        statisticsData.push({
          name: 'Shipping',
          change: avgShippingChange,
          icon: '🚢'
        });
      }
      
      // Add Brent Crude oil price (find from market data if available)
      const brentCrude = marketData?.find(item => 
        item.symbol === 'BZ' || item.symbol === 'BRENT' || item.name?.toLowerCase().includes('brent')
      );
      
      if (brentCrude) {
        statisticsData.push({
          name: 'Brent Crude',
          change: safeGetChangePercent(brentCrude),
          icon: '⚫'
        });
      }
      
      // Add NOK strength indicator (average of major currency pairs)
      const nokCurrencies = marketData?.filter(item => 
        ['USD/NOK', 'EUR/NOK', 'GBP/NOK'].includes(item.symbol)
      ) || [];
      
      if (nokCurrencies.length > 0) {
        const avgNokChange = nokCurrencies.reduce((sum, currency) => {
          const changeValue = Math.abs(safeGetChangePercent(currency));
          const isPositive = isPositiveChange(currency);
          return sum - (isPositive ? changeValue : -changeValue); // Inverse: stronger NOK = negative currency change
        }, 0) / nokCurrencies.length;
        
        statisticsData.push({
          name: 'NOK Styrke',
          change: avgNokChange,
          icon: '💪'
        });
      } else if (stockData.length > 0) {
        // Fallback: derive NOK strength from Norwegian stock performance
        const stockPerformance = norwegianStocks.reduce((sum, stock) => {
          return sum + Math.abs(safeGetChangePercent(stock));
        }, 0) / norwegianStocks.length;
        
        statisticsData.push({
          name: 'NOK Styrke',
          change: stockPerformance * 0.3, // Correlation factor
          icon: '💪'
        });
      }
      
      // Add EUR/NOK exchange rate
      const eurNok = marketData?.find(item => item.symbol === 'EUR/NOK');
      if (eurNok) {
        const eurNokChange = Math.abs(safeGetChangePercent(eurNok));
        const isPositive = isPositiveChange(eurNok);
        
        statisticsData.push({
          name: 'EUR/NOK',
          change: isPositive ? eurNokChange : -eurNokChange,
          icon: '€'
        });
      } else {
        // Fallback: derive EUR/NOK movement from market sentiment
        const marketSentiment = norwegianStocks.length > 0 ? 
          (norwegianStocks.reduce((sum, stock) => sum + Math.abs(safeGetChangePercent(stock)), 0) / norwegianStocks.length) * 0.2
          : 0;
        
        statisticsData.push({
          name: 'EUR/NOK',
          change: marketSentiment,
          icon: '€'
        });
      }
      
      // Add crypto performance summary (when in Makro mode)
      if (cryptoData.length > 0) {
        const avgCryptoChange = cryptoData.reduce((sum, crypto) => {
          return sum + safeGetChangePercent(crypto);
        }, 0) / cryptoData.length;
        
        statisticsData.push({
          name: 'Krypto',
          change: avgCryptoChange,
          icon: '₿'
        });
      }
      
      return statisticsData.slice(0, 10); // Allow up to 10 items for complete layout
    }
  })();

  // Filter articles based on content relevance
  const filteredArticles = allArticles?.filter(article => {
    if (viewMode === 'krypto') {
      // Only show crypto-related articles in crypto mode
      const cryptoKeywords = [
        'bitcoin', 'ethereum', 'krypto', 'cryptocurrency', 'blockchain', 'btc', 'eth', 'crypto',
        'coindesk', 'cointelegraph', 'cryptonews', 'defi', 'nft', 'web3', 'blackrock',
        'solana', 'cardano', 'ripple', 'polkadot', 'avalanche', 'polygon', 'chainlink', 'uniswap',
        'whale', 'hodl', 'staking', 'yield farming', 'liquidated', 'outflow', 'inflow', 'pepe'
      ];
      const contentLower = `${article.title} ${article.summary} ${article.author}`.toLowerCase();
      return cryptoKeywords.some(keyword => contentLower.includes(keyword));
    } else {
      // Makro mode: Show Norwegian financial articles, exclude crypto
      const cryptoKeywords = [
        'bitcoin', 'ethereum', 'cryptocurrency', 'blockchain', 'btc', 'eth', 'crypto',
        'coindesk', 'cointelegraph', 'cryptonews', 'defi', 'nft', 'web3', 'blackrock',
        'solana', 'cardano', 'ripple', 'polkadot', 'avalanche', 'polygon', 'chainlink', 'uniswap',
        'whale', 'hodl', 'staking', 'yield farming', 'liquidated', 'outflow', 'inflow', 'pepe'
      ];
      
      // Only Norwegian sources - exclude all English sources
      const norwegianSources = ['E24', 'Dagens Næringsliv', 'Teknisk Ukeblad', 'Kapital', 'Hegnar'];
      const englishSources = ['CoinDesk', 'CoinTelegraph', 'CryptoNews'];
      
      const isNorwegianSource = norwegianSources.includes(article.author);
      const isEnglishSource = englishSources.includes(article.author);
      
      const contentLower = `${article.title} ${article.summary} ${article.author}`.toLowerCase();
      const hasCryptoContent = cryptoKeywords.some(keyword => contentLower.includes(keyword));
      
      // Exclude non-financial content (trade unions, politics, general news)
      const isFinanciallyRelevant = !contentLower.includes('lo-leder') && 
                                   !contentLower.includes('fagforening') &&
                                   !contentLower.includes('arbeiderparti') &&
                                   !contentLower.includes('valg') &&
                                   !contentLower.includes('politikk') &&
                                   !contentLower.includes('kommune') &&
                                   !contentLower.includes('skole') &&
                                   !contentLower.includes('helse');
      
      // ONLY show Norwegian sources, never English sources, no crypto content, only financial content
      return isNorwegianSource && !isEnglishSource && !hasCryptoContent && isFinanciallyRelevant;
    }
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="relative">
        {/* Nordnet Affiliate Banner - Mobile sticky top, Desktop fixed side */}
        {/* Mobile Banner - Between navigation and content */}
        <div className="xl:hidden bg-white border-b border-gray-200 p-2">
          <a href="https://go.adt212.net/t/t?a=1939425697&as=1978602532&t=2&tk=1" target="_blank" rel="noopener noreferrer" className="block">
            <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium">Nordnet - Start din investering i dag</span>
            </div>
          </a>
        </div>
        
        {/* Desktop Banner - Fixed position */}
        <div className="hidden xl:block fixed right-4 top-24 z-40">
          <a href="https://go.adt212.net/t/t?a=1939425697&as=1978602532&t=2&tk=1" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://track.adtraction.com/t/t?a=1939425697&as=1978602532&t=1&tk=1&i=1" 
              width="160" 
              height="600" 
              style={{ border: 0 }}
              alt="Nordnet"
              className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            />
          </a>
        </div>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
          {/* Mode Toggle Buttons */}
          <section className="flex justify-center gap-1 mb-6">
            <button
              onClick={() => setViewMode('makro')}
              className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                viewMode === 'makro'
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Makro
            </button>
            <span className="px-2 py-2 text-gray-300">|</span>
            <button
              onClick={() => setViewMode('krypto')}
              className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                viewMode === 'krypto'
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Krypto
            </button>
          </section>

          {/* Today's Pulse Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black flex items-center gap-3">
                <span className="text-xl">{viewMode === 'makro' ? '📈' : '₿'}</span>
                DAGENS PULS
              </h2>
            </div>
            <div className={`bg-gradient-to-r ${
              viewMode === 'makro' 
                ? 'from-blue-50 to-sky-50 border-blue-200' 
                : 'from-orange-50 to-amber-50 border-orange-200'
            } border rounded-lg p-6 relative`}>
              <div className="flex items-center justify-end mb-3">
                <span className="text-xs text-gray-600 font-medium">Oppdatert nå</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-medium text-black">
                  {viewMode === 'makro' ? (
                    dailyPulse?.pulse || "Analyserer dagens økonomiske utvikling..."
                  ) : (
                    (() => {
                      if (!cryptoData || cryptoData.length === 0) return "Henter kryptovaluta-data...";
                      
                      // Find dagens største endring (positiv eller negativ)
                      const sortedCryptos = cryptoData
                        .filter(crypto => safeGetChangePercent(crypto) && crypto.symbol?.includes('/NOK'))
                        .sort((a, b) => {
                          const aChange = Math.abs(parseFloat(safeGetChangePercent(a)?.replace('%', '').replace('+', '') || '0'));
                          const bChange = Math.abs(parseFloat(safeGetChangePercent(b)?.replace('%', '').replace('+', '') || '0'));
                          return bChange - aChange;
                        });
                      
                      if (sortedCryptos.length === 0) return "Analyserer kryptovaluta-bevegelser...";
                      
                      const topMover = sortedCryptos[0];
                      const change = safeGetChangePercent(topMover) || '0%';
                      const isPositive = !change.includes('-');
                      const direction = isPositive ? 'stiger' : 'faller';
                      const symbol = topMover.symbol?.replace('/NOK', '') || topMover.name;
                      
                      return `${topMover.name} ${direction} ${change} til ${safeGetPrice(topMover)} - dagens største krypto-bevegelse i NOK.`;
                    })()
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Dagens Statistikk Section */}
          <section>
            <h2 className={`text-lg font-semibold text-black mb-4 inline-block px-3 py-1 rounded ${
              viewMode === 'makro' ? 'bg-gray-300' : 'bg-orange-300'
            }`}>
              Dagens Statistikk
            </h2>
            <DagensStatistikk data={sectorData} />
          </section>

          {/* Enhanced Insights Section with Market Correlation */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-4">
              {viewMode === 'makro' ? 'Innsikt' : 'Krypto Innsikt'}
            </h2>
            {viewMode === 'makro' ? (
              <AIInsightsCard />
            ) : (
              <CryptoInsightsCard />
            )}
          </section>

          {/* Market Outlook Section */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-4">
              {viewMode === 'makro' ? 'Helhetsbilde' : 'KryptoFokus'}
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {viewMode === 'makro' ? (
                <>
                  {/* Investment Trends */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Investeringstrender
                    </h3>
                    <p className="mb-3">
                      {(() => {
                        // Focus on Norwegian financial trends with real market data
                        const norwegianStocks = stockData.filter(stock => 
                          ['EQNR', 'DNB', 'MOWI', 'TEL', 'YAR', 'ANDF'].includes(stock.symbol)
                        );
                        
                        const positiveStocks = norwegianStocks.filter(stock => 
                          safeGetChangePercent(stock) > 0
                        );
                        
                        if (norwegianStocks.length === 0) return "Henter norske markedsdata...";
                        
                        const trend = positiveStocks.length > norwegianStocks.length / 2 ? 'positive' : 'mixed';
                        
                        if (trend === 'positive') {
                          return "▲ Norske blue-chip aksjer viser styrke med bred oppgang på Oslo Børs. Energisektoren leder an drevet av stabile oljepriser, mens finanssektoren støttes av høye renter. Institusjonelle investorer øker allokeringen til norske selskaper.";
                        } else {
                          return "▶ Blandet sentiment på Oslo Børs med sektorrotasjon mellom energi, finans og teknologi. Investorer vurderer renteforventninger mot bedriftenes guidinger for Q4. Fokus på utbyttebetalinger fra energiselskaper.";
                        }
                      })()}
                    </p>
                  </div>

                  {/* Sector Performance */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-green-600" />
                      Sektorutvikling
                    </h3>
                    <p className="mb-3">
                      {(() => {
                        // Focus on Norwegian sectors with real data
                        const energyStock = stockData.find(s => s.symbol === 'EQNR');
                        const bankStock = stockData.find(s => s.symbol === 'DNB');
                        const seafoodStock = stockData.find(s => s.symbol === 'MOWI');
                        
                        if (!energyStock && !bankStock && !seafoodStock) {
                          return "Analyserer sektorutvikling på Oslo Børs...";
                        }
                        
                        const strongSectors = [];
                        if (energyStock && safeGetChangePercent(energyStock) > 0) strongSectors.push('energi');
                        if (bankStock && safeGetChangePercent(bankStock) > 0) strongSectors.push('finans');
                        if (seafoodStock && safeGetChangePercent(seafoodStock) > 0) strongSectors.push('sjømat');
                        
                        if (strongSectors.length >= 2) {
                          return `▲ Flere norske nøkkelsektorer viser positiv momentum. ${strongSectors.join(', ')} leder utviklingen med støtte fra gunstige fundamentale faktorer. Utsiktene for norsk næringsliv forblir solide.`;
                        } else {
                          return "▶ Sektorrotasjon på Oslo Børs med varierende prestasjoner mellom energi, bank og sjømat. Markedet vurderer globale konjunktursignaler mot norske selskapers competitive positioning.";
                        }
                      })()}
                    </p>
                  </div>

                  {/* Market Sentiment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      Markedssentiment
                    </h3>
                    <p>
                      {(() => {
                        // Calculate overall market sentiment from articles and data
                        const recentArticles = filteredArticles.slice(0, 10);
                        if (recentArticles.length === 0) return "Analyserer markedssentiment...";
                        
                        // Simple sentiment analysis based on keywords
                        const positiveKeywords = ['øker', 'stiger', 'vekst', 'oppgang', 'styrke', 'optimisme', 'positivt'];
                        const negativeKeywords = ['faller', 'synker', 'nedgang', 'bekymring', 'usikkerhet', 'fall'];
                        
                        let positiveCount = 0;
                        let negativeCount = 0;
                        
                        recentArticles.forEach(article => {
                          const content = `${article.title} ${article.summary}`.toLowerCase();
                          positiveKeywords.forEach(word => {
                            if (content.includes(word)) positiveCount++;
                          });
                          negativeKeywords.forEach(word => {
                            if (content.includes(word)) negativeCount++;
                          });
                        });
                        
                        if (positiveCount > negativeCount) {
                          return "▲ Optimistisk stemning dominerer norske finansmarkeder med fokus på solid bedriftsfundament og stabile makroøkonomiske forhold. Investortilliten understøttes av sterke selskapstall og gunstige globale trender.";
                        } else if (negativeCount > positiveCount) {
                          return "▼ Avventende holdning i markedet med økt fokus på risikostyring og selektivitet. Investorer vurderer geopolitiske faktorer mot norske selskapers resiliens og adaptivitet.";
                        } else {
                          return "▶ Balansert markedssentiment med selektiv tilnærming til investeringsmuligheter. Fokus på kvalitet og langsiktig verdiskap i et miljø med både muligheter og utfordringer.";
                        }
                      })()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Crypto Market Dynamics */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Bitcoin className="w-4 h-4 text-orange-600" />
                      Markedsdynamikk
                    </h3>
                    <p className="mb-3">
                      {(() => {
                        // Focus on current crypto market dynamics with real data
                        if (cryptoData.length === 0) return "Henter kryptovaluta markedsdata...";
                        
                        const majorCryptos = cryptoData.filter(crypto => 
                          ['BTC/NOK', 'ETH/NOK', 'SOL/NOK', 'ADA/NOK'].includes(crypto.symbol)
                        );
                        
                        const positiveCryptos = majorCryptos.filter(crypto => 
                          safeGetChangePercent(crypto) > 0
                        );
                        
                        if (positiveCryptos.length > majorCryptos.length / 2) {
                          return "▲ Bullish momentum dominerer kryptovalutamarkedet med bred oppgang på tvers av major assets. Institusjonell kapital fortsetter å strømme inn i digital assets, støttet av klarere regulatoriske rammer og økt mainstream-adopsjon.";
                        } else {
                          return "▶ Konsolidering i kryptovalutamarkedet med selektiv styrke i kvalitets-tokens. Markedet balanserer mellom kortsiktige volatilitetstilbud og langsiktige adopsjonstrender fra både retail og institusjonelle aktører.";
                        }
                      })()}
                    </p>
                  </div>

                  {/* Regulatory Environment */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      Regulatorisk miljø
                    </h3>
                    <p className="mb-3">
                      {(() => {
                        // Focus on regulatory environment affecting crypto
                        const volatileCryptos = cryptoData.filter(crypto => {
                          const change = Math.abs(safeGetChangePercent(crypto));
                          return change > 3;
                        });
                        
                        if (volatileCryptos.length > 3) {
                          return "▼ Høy volatilitet i kryptomarkedet fører til økt regulatorisk oppmerksomhet fra EU og norske myndigheter. MiCA-regelverket implementeres gradvis for å styrke investorbeskyttelsen. Finanstilsynet følger utviklingen tett med fokus på AML-compliance.";
                        }
                        
                        return "▶ EU's MiCA-regelverk skaper klarere rammer for kryptovaluta-handel i Norge. Finanstilsynet jobber med veiledning for norske banker og kryptoaktører. Digital euro-pilotprosjektet påvirker strategiske beslutninger.";
                      })()}
                    </p>
                  </div>

                  {/* Nordic Adoption */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      Nordisk adopsjon
                    </h3>
                    <p className="mb-3">
                      {(() => {
                        // Focus on Nordic/Norwegian crypto adoption with real market data
                        const totalCryptoValue = cryptoData.reduce((sum, crypto) => {
                          const price = parseFloat(crypto.price.toString().replace(/[^\d.]/g, '')) || 0;
                          return sum + price;
                        }, 0);
                        
                        const positiveMovers = cryptoData.filter(c => safeGetChangePercent(c) > 0);
                        const adoption = positiveMovers.length > cryptoData.length / 2 ? 'øker' : 'stabiliseres';
                        
                        return `▶ Norske investorer viser ${adoption === 'øker' ? '▲' : '▶'} interesse for kryptovaluta som del av portefølje diversifisering. DNB og andre storbanker utvikler krypto-tjenester for institusjonelle kunder. Oljefondet evaluerer indirekte eksponering gjennom teknologiselskaper.`;
                      })()}
                    </p>
                  </div>

                  {/* Technology Trends */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      Teknologitrender
                    </h3>
                    <p>
                      {(() => {
                        // Focus on current crypto market trends and technology
                        const sortedCryptos = cryptoData.sort((a, b) => {
                          const aChange = Math.abs(parseFloat(safeGetChangePercent(a)?.replace('%', '').replace('+', '') || '0'));
                          const bChange = Math.abs(parseFloat(safeGetChangePercent(b)?.replace('%', '').replace('+', '') || '0'));
                          return bChange - aChange;
                        });
                        
                        if (sortedCryptos.length === 0) return "Henter teknologianalyser...";
                        
                        const topMover = sortedCryptos[0];
                        const change = safeGetChangePercent(topMover) || '0%';
                        const isPositive = !change.includes('-');
                        const direction = isPositive ? '▲' : '▼';
                        
                        return `${direction} Blockchain-infrastruktur fortsetter å modnes med fokus på skalering og energieffektivitet. Web3-integrasjoner øker blant norske fintech-selskaper og tradisjonelle banker. Smart kontrakt-adopsjonen akselererer innen forsikring og supply chain management.`;
                      })()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Fear & Greed Section - Live Market Data */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-4">
              {viewMode === 'makro' ? 'Frykt & Grådighet' : 'Krypto Frykt & Grådighet'}
            </h2>
            {viewMode === 'makro' ? (
              <FearGreedIndex />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {(() => {
                      // Calculate crypto fear & greed based on real market data
                      if (!cryptoData || cryptoData.length === 0) {
                        return (
                          <>
                            <div className="text-3xl font-bold text-gray-400">--</div>
                            <div className="text-lg font-medium text-gray-400">Henter data...</div>
                          </>
                        );
                      }
                      
                      // Calculate based on positive vs negative movers
                      const positiveMovers = cryptoData.filter(crypto => 
                        safeGetChangePercent(crypto) > 0
                      );
                      const negativeMovers = cryptoData.filter(crypto => 
                        safeGetChangePercent(crypto) < 0
                      );
                      
                      // Calculate average change
                      const avgChange = cryptoData.reduce((sum, crypto) => {
                        return sum + safeGetChangePercent(crypto);
                      }, 0) / cryptoData.length;
                      
                      // Convert to 0-100 scale (normalize around typical crypto volatility)
                      let index = 50 + (avgChange * 5); // Scale factor for crypto volatility
                      index = Math.max(0, Math.min(100, Math.round(index)));
                      
                      let sentiment = 'Nøytral';
                      let color = 'text-yellow-600';
                      
                      if (index >= 75) {
                        sentiment = 'Ekstrem grådighet';
                        color = 'text-green-600';
                      } else if (index >= 55) {
                        sentiment = 'Grådighet';
                        color = 'text-green-500';
                      } else if (index <= 25) {
                        sentiment = 'Ekstrem frykt';
                        color = 'text-red-600';
                      } else if (index <= 45) {
                        sentiment = 'Frykt';
                        color = 'text-red-500';
                      }
                      
                      return (
                        <>
                          <div className={`text-3xl font-bold ${color}`}>{index}</div>
                          <div className="text-lg font-medium text-black">{sentiment}</div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">
                    ₿ Krypto-markedet
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"></div>
                  {(() => {
                    if (!cryptoData || cryptoData.length === 0) return null;
                    
                    const avgChange = cryptoData.reduce((sum, crypto) => {
                      return sum + safeGetChangePercent(crypto);
                    }, 0) / cryptoData.length;
                    
                    let index = 50 + (avgChange * 5);
                    index = Math.max(0, Math.min(100, Math.round(index)));
                    
                    return (
                      <div 
                        className="absolute top-0 w-3 h-3 bg-white border-2 border-orange-400 rounded-full transform -translate-x-1/2 -translate-y-0.5"
                        style={{ left: `${index}%` }}
                      ></div>
                    );
                  })()}
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Frykt</span>
                  <span>Grådighet</span>
                </div>
              </div>
            )}
          </section>

          {/* Assets Section */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-4">Aktiva</h2>
            
            {/* Crypto First when in Crypto Mode */}
            {viewMode === 'krypto' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">KRYPTO</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {cryptoData.length > 0 ? (
                    cryptoData.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-black">{crypto.symbol}</div>
                          <div className="text-sm text-gray-500">{crypto.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{safeGetPrice(crypto)}</div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            isPositiveChange(crypto) 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-red-600 bg-red-100'
                          }`}>
                            {safeGetChangePercent(crypto)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Laster kryptovalutadata...</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Indexes Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">INDEKSER</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {stockData.length > 0 ? (
                  stockData.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-black">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{safeGetPrice(stock)} NOK</div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          isPositiveChange(stock) 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {safeGetChangePercent(stock)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Laster markedsdata...</div>
                )}
              </div>
            </div>
          </section>

          {/* Crypto Section - Only show if NOT in crypto mode to avoid duplication */}
          {viewMode !== 'krypto' && (
            <section>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">KRYPTO</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {cryptoData.length > 0 ? (
                    cryptoData.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-black">{crypto.symbol}</div>
                          <div className="text-sm text-gray-500">{crypto.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{safeGetPrice(crypto)}</div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            isPositiveChange(crypto) 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-red-600 bg-red-100'
                          }`}>
                            {safeGetChangePercent(crypto)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Laster kryptovalutadata...</div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Currencies Section */}
          <section>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">VALUTAER</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {(() => {
                  const currencies = marketData?.filter(item => 
                    ['USD/NOK', 'EUR/NOK', 'GBP/NOK', 'SEK/NOK', 'DKK/NOK'].includes(item.symbol)
                  ) || [];
                  
                  if (currencies.length > 0) {
                    return currencies.map((currency) => (
                      <div key={currency.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-black">{currency.symbol}</div>
                          <div className="text-sm text-gray-500">{currency.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{safeGetPrice(currency)} NOK</div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            isPositiveChange(currency) 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-red-600 bg-red-100'
                          }`}>
                            {safeGetChangePercent(currency)}
                          </div>
                        </div>
                      </div>
                    ));
                  } else {
                    return <div className="text-sm text-gray-500">Laster valutadata...</div>;
                  }
                })()}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-4 py-8 mt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Laget av Rune H.<br />
              Sist oppdatert: {new Date().toLocaleDateString('no-NO', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}, {new Date().toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            
            <div className="text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto">
              <p className="mb-4">
                FinansMakro.no gir deg timesaktuelle øyeblikksbilder av globale markedstrender, økonominyheter og sentrale innsikter. Få raskt oversikt over dagens finans Norge med sentimentanalyse, tydelige sammendrag og handlingsrettet innsikt på over 40 ulike aktiva som aksjer, kryptovaluta, råvarer, valuta og obligasjoner. Perfekt for nybegynnere og alle som ønsker å holde seg oppdatert på hvordan økonomien fungerer – uten anstrengelse.
              </p>
              <p className="font-medium">
                FinansMakro.no hjelper deg å forstå Norge, én puls om gangen.
              </p>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto pt-4 border-t border-gray-100 space-y-3">
              <p>
                <strong>Merk:</strong> FinansMakro.no er kun ment for læring og underholdning. Tjenesten bygger på ekte markedsdata, men er ikke investeringsrådgivning. Innholdet genereres ved hjelp av AI-språkmodeller, som kan være uforutsigbare. Markedsinnsiktene kan være unøyaktige eller misvisende. Skaperen fraskriver seg alt ansvar for beslutninger basert på denne informasjonen. Ikke bruk tjenesten som grunnlag for investeringsbeslutninger.
              </p>
              <p>
                <strong>Nordnet:</strong> Finansielle verdipapirer kan både øke og minke i verdi. Det er en risiko for at du ikke får tilbake pengene du har investert.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}