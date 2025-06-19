import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MarketSentiment {
  overall: number; // 0-100 scale
  sentiment: 'Ekstrem frykt' | 'Frykt' | 'Nøytral' | 'Optimisme' | 'Ekstrem optimisme';
  components: {
    osebx: { value: number; change: number; weight: number };
    oil: { value: number; change: number; weight: number };
    nok: { value: number; change: number; weight: number };
    banking: { value: number; change: number; weight: number };
  };
  lastUpdate: string;
}

function SentimentMeter({ value, sentiment }: { value: number; sentiment: string }) {
  const getColor = (val: number) => {
    if (val <= 25) return 'bg-red-500';
    if (val <= 50) return 'bg-orange-500';
    if (val <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBgColor = (val: number) => {
    if (val <= 25) return 'bg-red-50';
    if (val <= 50) return 'bg-orange-50';
    if (val <= 75) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  return (
    <div className={`p-4 rounded-lg ${getBgColor(value)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Markedssentiment</span>
        <span className="text-lg font-bold text-gray-900">{value}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-600 text-center font-medium">{sentiment}</p>
    </div>
  );
}

function ComponentIndicator({ 
  name, 
  value, 
  change, 
  weight 
}: { 
  name: string; 
  value: number; 
  change: number; 
  weight: number; 
}) {
  const isPositive = change >= 0;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-500">({weight}%)</span>
      </div>
      <div className="flex items-center space-x-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export default function SentimentDashboard() {
  const { data: marketData } = useQuery({
    queryKey: ['/api/market-data'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: fearGreedData } = useQuery({
    queryKey: ['/api/fear-greed'],
    refetchInterval: 60000, // Update every minute
  });

  // Calculate real-time sentiment from actual Norwegian market data
  const calculateSentiment = (): MarketSentiment => {
    // Initialize with neutral values - will be overridden by real data
    const components = {
      osebx: { value: 0, change: 0, weight: 35 },
      oil: { value: 0, change: 0, weight: 25 },
      nok: { value: 0, change: 0, weight: 20 },
      banking: { value: 0, change: 0, weight: 20 },
    };

    if (marketData && Array.isArray(marketData)) {
      // Extract real market data when available
      const osebxData = marketData.find((item: any) => item.symbol === 'OSEBX');
      const oilData = marketData.find((item: any) => item.symbol === 'BRENT_OIL');
      const nokData = marketData.find((item: any) => item.symbol === 'NOK_USD');
      const dnbData = marketData.find((item: any) => item.symbol === 'DNB');

      if (osebxData) {
        components.osebx.value = osebxData.price || components.osebx.value;
        components.osebx.change = osebxData.changePercent || components.osebx.change;
      }
      if (oilData) {
        components.oil.value = oilData.price || components.oil.value;
        components.oil.change = oilData.changePercent || components.oil.change;
      }
      if (nokData) {
        components.nok.value = nokData.price || components.nok.value;
        components.nok.change = nokData.changePercent || components.nok.change;
      }
      if (dnbData) {
        components.banking.value = dnbData.price || components.banking.value;
        components.banking.change = dnbData.changePercent || components.banking.change;
      }
    }

    // Calculate weighted sentiment
    const weightedScore = (
      (components.osebx.change * components.osebx.weight) +
      (components.oil.change * components.oil.weight) +
      (components.nok.change * components.nok.weight) +
      (components.banking.change * components.banking.weight)
    ) / 100;

    // Convert to 0-100 scale and incorporate fear/greed index
    let overall = 50 + (weightedScore * 10); // Base calculation
    if (fearGreedData && typeof fearGreedData === 'object' && 'index' in fearGreedData) {
      overall = (overall + (fearGreedData as any).index) / 2; // Blend with fear/greed
    }
    
    overall = Math.max(0, Math.min(100, overall)); // Clamp to 0-100

    const getSentimentLabel = (score: number): MarketSentiment['sentiment'] => {
      if (score <= 20) return 'Ekstrem frykt';
      if (score <= 40) return 'Frykt';
      if (score <= 60) return 'Nøytral';
      if (score <= 80) return 'Optimisme';
      return 'Ekstrem optimisme';
    };

    return {
      overall: Math.round(overall),
      sentiment: getSentimentLabel(overall),
      components,
      lastUpdate: new Date().toISOString(),
    };
  };

  const sentiment = calculateSentiment();

  return (
    <div className="space-y-4">
      <SentimentMeter value={sentiment.overall} sentiment={sentiment.sentiment} />
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Markedskomponenter</h4>
        <ComponentIndicator 
          name="OSEBX" 
          value={sentiment.components.osebx.value}
          change={sentiment.components.osebx.change}
          weight={sentiment.components.osebx.weight}
        />
        <ComponentIndicator 
          name="Olje (Brent)" 
          value={sentiment.components.oil.value}
          change={sentiment.components.oil.change}
          weight={sentiment.components.oil.weight}
        />
        <ComponentIndicator 
          name="NOK/USD" 
          value={sentiment.components.nok.value}
          change={sentiment.components.nok.change}
          weight={sentiment.components.nok.weight}
        />
        <ComponentIndicator 
          name="Banking (DNB)" 
          value={sentiment.components.banking.value}
          change={sentiment.components.banking.change}
          weight={sentiment.components.banking.weight}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
        <span>Oppdatert: {new Date(sentiment.lastUpdate).toLocaleTimeString('no-NO')}</span>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Live data</span>
        </div>
      </div>
    </div>
  );
}