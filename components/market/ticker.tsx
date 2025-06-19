import { useQuery } from "@tanstack/react-query";
import type { MarketData } from "@shared/schema";

export default function MarketTicker() {
  const { data: marketData } = useQuery<MarketData[]>({
    queryKey: ["/api/market-data"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (!marketData) {
    return (
      <div className="bg-charcoal text-white py-2">
        <div className="flex justify-center">
          <div className="text-sm text-gray-300">Laster markedsdata...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal text-white py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        <div className="flex space-x-8 px-4">
          {marketData.map((item, index) => (
            <span key={`${item.symbol}-${index}`} className="text-sm">
              <strong>{item.symbol}:</strong>{" "}
              <span className={item.isPositive ? "text-success-green" : "text-error-red"}>
                {item.price} ({item.changePercent})
              </span>
            </span>
          ))}
          {/* Duplicate for seamless scrolling */}
          {marketData.map((item, index) => (
            <span key={`${item.symbol}-duplicate-${index}`} className="text-sm">
              <strong>{item.symbol}:</strong>{" "}
              <span className={item.isPositive ? "text-success-green" : "text-error-red"}>
                {item.price} ({item.changePercent})
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
