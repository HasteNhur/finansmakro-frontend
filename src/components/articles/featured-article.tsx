import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@shared/schema";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="relative">
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-80 object-cover rounded-xl shadow-lg"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <Badge 
            className={`px-3 py-1 text-xs font-medium ${
              article.category === "Oslo Børs" ? "bg-finance-blue" :
              article.category === "Krypto" ? "bg-warning-gold" :
              article.category === "Valuta" ? "bg-success-green" :
              "bg-gray-600"
            }`}
          >
            {article.category}
          </Badge>
          <span className="text-sm opacity-90">{formatDate(article.publishedAt)}</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 line-clamp-2">{article.title}</h2>
        <p className="text-lg opacity-90 line-clamp-2">{article.summary}</p>
      </div>
    </article>
  );
}
