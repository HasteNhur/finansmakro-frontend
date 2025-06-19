import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@shared/schema";

interface AnalysisCardProps {
  article: Article;
}

export default function AnalysisCard({ article }: AnalysisCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center space-x-2 mb-4">
        <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-xs font-medium">
          Dybdeanalyse
        </Badge>
        <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 hover:text-finance-blue line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {article.summary}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {article.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">{article.author}</span>
        </div>
        <span className="text-sm text-gray-500">{article.readingTime} lesing</span>
      </div>
    </article>
  );
}
