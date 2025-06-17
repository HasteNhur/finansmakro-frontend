import { Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  showImage?: boolean;
}

export default function ArticleCard({ article, showImage = true }: ArticleCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Oslo Børs":
        return "bg-finance-blue text-white";
      case "Krypto":
        return "bg-warning-gold text-white";
      case "Valuta":
        return "bg-success-green text-white";
      case "Sentralbank":
        return "bg-success-green text-white";
      case "Bedrift":
        return "bg-error-red text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {showImage && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`px-2 py-1 text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </Badge>
          <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 hover:text-finance-blue line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Av: {article.author}</span>
          <div className="flex space-x-3">
            <Share2 className="h-4 w-4 text-gray-400 hover:text-finance-blue cursor-pointer" />
            <Bookmark className="h-4 w-4 text-gray-400 hover:text-finance-blue cursor-pointer" />
          </div>
        </div>
      </div>
    </article>
  );
}
