import { useQuery } from "@tanstack/react-query";
import { Bitcoin, TrendingUp, TrendingDown } from "lucide-react";

export default function CryptoInsightsCard() {
  const { data: insights, isLoading } = useQuery<string[]>({
    queryKey: ['/api/crypto-insights'],
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bitcoin className="w-5 h-5 text-orange-600 animate-pulse" />
            <h3 className="font-semibold text-gray-900">Analyserer kryptomarkedet...</h3>
          </div>
          <p className="text-gray-700">AI-systemet analyserer aktuelle kryptovaluta-priser i NOK...</p>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bitcoin className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Krypto-analyse utilgjengelig</h3>
          </div>
          <p className="text-gray-700">
            AI-systemet genererer kryptovaluta-analyser basert på sanntidsdata. 
            Analyser vil være tilgjengelige etter at markedsdata er lastet.
          </p>
        </div>
      </div>
    );
  }

  const getIconForInsight = (insight: string) => {
    if (insight.startsWith('▲')) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (insight.startsWith('▼')) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Bitcoin className="w-4 h-4 text-orange-600" />;
  };

  const getTitleForInsight = (insight: string, index: number) => {
    const titles = [
      'Markedsoversikt',
      'Prisutvikling og volatilitet', 
      'Institusjonell aktivitet'
    ];
    return titles[index] || 'Krypto-analyse';
  };

  return (
    <div className="space-y-4">
      {insights.slice(0, 3).map((insight, index) => (
        <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            {getIconForInsight(insight)}
            <h3 className="font-semibold text-gray-900">{getTitleForInsight(insight, index)}</h3>
          </div>
          
          <p className="text-gray-800 leading-relaxed mb-3" dangerouslySetInnerHTML={{ 
            __html: typeof insight === "string"
              ? insight
                  .replace(/(▲)/g, '<span class="font-medium text-lg text-green-600">$1</span>')
                  .replace(/(▼)/g, '<span class="font-medium text-lg text-red-600">$1</span>')
                  .replace(/(◆)/g, '<span class="font-medium text-lg text-gray-600">$1</span>')
              : ""
          }} />
          

        </div>
      ))}
    </div>
  );
}