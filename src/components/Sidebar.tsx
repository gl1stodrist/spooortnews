import { TrendingUp, Flame } from "lucide-react";
import { getPopularNews, getHotNews } from "@/data/newsData";
import { NewsCard } from "./NewsCard";

export const Sidebar = () => {
  const popularNews = getPopularNews();
  const hotNews = getHotNews();

  return (
    <aside className="space-y-8">
      {/* Ad Space */}
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Рекламный блок 300x250
      </div>

      {/* Hot News */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold uppercase text-foreground">
          <Flame className="h-5 w-5 text-primary" />
          Горячее
        </h3>
        <div className="space-y-0">
          {hotNews.slice(0, 3).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Popular News */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold uppercase text-foreground">
          <TrendingUp className="h-5 w-5 text-sport-blue" />
          Популярное
        </h3>
        <div className="space-y-0">
          {popularNews.map((article, index) => (
            <div key={article.id} className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-secondary font-display text-lg font-bold text-muted-foreground">
                {index + 1}
              </span>
              <NewsCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* Another Ad Space */}
      <div className="sticky top-24 flex h-[600px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Рекламный блок 300x600
      </div>
    </aside>
  );
};
