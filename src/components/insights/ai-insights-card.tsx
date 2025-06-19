import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Insight {
  id: number;
  articleTitle: string;
  insightText: string;
  source: string;
  createdAt: string;
}

export default function AIInsightsCard() {
  const { data: insights, isLoading } = useQuery<Insight[]>({
    queryKey: ['/api/insights'],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <p>Analyserer markedsdata...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-gray-900">AI Markedsanalyse</h3>
          </div>
          <p className="text-gray-700">
            Ingen innsikter tilgjengelig ennå. AI-systemet analyserer kontinuerlig norske finansnyheter for å generere relevante markedsinnsikter.
          </p>
        </div>
      </div>
    );
  }

  // Show the 3 most recent insights
  const recentInsights = insights.slice(0, 3);

  return (
    <div className="space-y-4">
      {recentInsights.map((insight) => (
        <div key={insight.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {insight.articleTitle.substring(0, 80)}
              {insight.articleTitle.length > 80 ? '...' : ''}
            </h3>
          </div>
          
          <p className="text-gray-800 leading-relaxed mb-3" dangerouslySetInnerHTML={{ 
            __html: insight.insightText
              .replace(/(▲)/g, '<span class="font-medium text-green-600">$1</span>')
              .replace(/(▼)/g, '<span class="font-medium text-red-600">$1</span>')
              .replace(/(◆)/g, '<span class="font-medium text-gray-600">$1</span>')
          }} />
          

        </div>
      ))}
      

    </div>
  );
}