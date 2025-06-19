import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketData } from "@shared/schema";

interface MarketOverviewProps {
  viewMode: 'makro' | 'krypto';
}

export default function MarketOverview({ viewMode }: MarketOverviewProps) {
  const { data: allMarketData, isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/market-data"],
    refetchInterval: 30000,
  });

  // Filter data based on mode
  const marketData = allMarketData?.filter(item => {
    if (viewMode === 'krypto') {
      return ["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol);
    } else {
      return !["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol);
    }
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-navy">Markedsoversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketData || marketData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-navy">Markedsoversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Ingen markedsdata tilgjengelig</p>
        </CardContent>
      </Card>
    );
  }

  // Group data for better presentation
  const stockData = marketData.filter(item => 
    ["OSEBX", "EQNR", "DNB", "TEL", "ANDF", "MOWI", "YAR"].includes(item.symbol)
  );
  const cryptoData = marketData.filter(item => 
    ["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol)
  );
  const currencyData = marketData.filter(item => 
    item.symbol.includes("/NOK") && 
    !["BTC/NOK", "ETH/NOK", "ADA/NOK", "XRP/NOK", "SOL/NOK", "DOT/NOK", "AVAX/NOK", "MATIC/NOK", "LINK/NOK", "UNI/NOK"].includes(item.symbol)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-navy">Markedsoversikt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stock Market */}
        {stockData.map((item) => (
          <div key={item.symbol} className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.symbol}</span>
            <div className="text-right">
              <div className="text-sm font-mono">{item.price}</div>
              <div className={`text-xs ${item.isPositive ? "text-success-green" : "text-error-red"}`}>
                {item.changePercent}
              </div>
            </div>
          </div>
        ))}

        {/* Currencies */}
        {currencyData.length > 0 && (
          <>
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Valuta</h4>
              {currencyData.map((item) => (
                <div key={item.symbol} className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.symbol}</span>
                  <div className="text-right">
                    <div className="text-sm font-mono">{item.price}</div>
                    <div className={`text-xs ${item.isPositive ? "text-success-green" : "text-error-red"}`}>
                      {item.changePercent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Crypto */}
        {cryptoData.length > 0 && (
          <>
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Krypto</h4>
              {cryptoData.map((item) => (
                <div key={item.symbol} className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.symbol}</span>
                  <div className="text-right">
                    <div className="text-sm font-mono">{item.price}</div>
                    <div className={`text-xs ${item.isPositive ? "text-success-green" : "text-error-red"}`}>
                      {item.changePercent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
