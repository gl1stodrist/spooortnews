import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye, Flame } from "lucide-react";
import { NewsArticle } from "@/hooks/useNews";
import { categoryLabels, categoryColors, SportCategory } from "@/data/newsData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";

interface NewsCardDbProps {
  article: NewsArticle;
  variant?: "default" | "featured" | "compact";
}

const formatPublishedDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Дата неизвестна";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Less than 1 hour ago
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "Только что";
    return `${diffMinutes} мин. назад`;
  }
  
  // Less than 24 hours ago
  if (diffHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  }
  
  // Yesterday
  if (isYesterday(date)) {
    return `Вчера в ${format(date, "HH:mm", { locale: ru })}`;
  }
  
  // Today (edge case)
  if (isToday(date)) {
    return `Сегодня в ${format(date, "HH:mm", { locale: ru })}`;
  }
  
  // Older than yesterday
  return format(date, "d MMMM yyyy", { locale: ru });
};

export const NewsCardDb = ({ article, variant = "default" }: NewsCardDbProps) => {
  const formattedDate = formatPublishedDate(article.published_at);
  const readTime = Math.max(1, Math.ceil((article.content?.length || 0) / 1500));
  const category = article.category as SportCategory;

  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative h-[500px] overflow-hidden rounded-lg"
      >
        <Link to={`/article/${article.id}`} className="absolute inset-0">
          <img
            src={article.image || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className={cn("category-badge text-primary-foreground", categoryColors[category])}>
                {categoryLabels[category]}
              </span>
              {article.is_hot && (
                <span className="flex items-center gap-1 text-xs font-bold uppercase text-primary">
                  <Flame className="h-3 w-3" />
                  Горячее
                </span>
              )}
              {article.is_live && (
                <span className="live-indicator text-primary">LIVE</span>
              )}
            </div>
            
            <h2 className="mb-3 font-display text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-4xl">
              {article.title}
            </h2>
            
            <p className="mb-4 line-clamp-2 text-muted-foreground">{article.excerpt}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{article.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime} мин
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.views >= 1000 ? `${(article.views / 1000).toFixed(0)}K` : article.views}
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="group flex gap-4 border-b border-border py-4 last:border-b-0"
      >
        <Link to={`/article/${article.id}`} className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded">
          <img
            src={article.image || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col justify-center">
          <span className={cn("category-badge mb-2 self-start text-[10px] text-primary-foreground", categoryColors[category])}>
            {categoryLabels[category]}
          </span>
          <Link to={`/article/${article.id}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
              {article.title}
            </h3>
          </Link>
          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {article.views >= 1000 ? `${(article.views / 1000).toFixed(0)}K` : article.views}
          </span>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-news group"
    >
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          
          {article.is_live && (
            <span className="live-indicator absolute right-3 top-3 rounded bg-background/80 px-2 py-1 text-primary">
              LIVE
            </span>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("category-badge text-primary-foreground", categoryColors[category])}>
              {categoryLabels[category]}
            </span>
            {article.is_hot && (
              <Flame className="h-4 w-4 text-primary" />
            )}
          </div>
          
          <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.views >= 1000 ? `${(article.views / 1000).toFixed(0)}K` : article.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
