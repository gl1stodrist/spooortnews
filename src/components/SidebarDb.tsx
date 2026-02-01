import { TrendingUp, Flame } from "lucide-react";
import { usePopularNews, useHotNews } from "@/hooks/useNews";
import { NewsCardDb } from "./NewsCardDb";
import { Skeleton } from "./ui/skeleton";

export const SidebarDb = () => {
  const { data: popularNews = [], isLoading: loadingPopular } = usePopularNews(5);
  const { data: hotNews = [], isLoading: loadingHot } = useHotNews(3);

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
          {loadingHot ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-4">
                  <Skeleton className="h-20 w-28 flex-shrink-0 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </>
          ) : hotNews.length > 0 ? (
            hotNews.map((article) => (
              <NewsCardDb key={article.id} article={article} variant="compact" />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Нет горячих новостей</p>
          )}
        </div>
      </div>

      {/* Popular News */}
      <div className="rounded-lg bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold uppercase text-foreground">
          <TrendingUp className="h-5 w-5 text-sport-blue" />
          Популярное
        </h3>
        <div className="space-y-0">
          {loadingPopular ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </>
          ) : popularNews.length > 0 ? (
            popularNews.map((article, index) => (
              <div key={article.id} className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-secondary font-display text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <NewsCardDb article={article} variant="compact" />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Нет популярных новостей</p>
          )}
        </div>
      </div>

      {/* Another Ad Space */}
      <div className="sticky top-24 flex h-[600px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Рекламный блок 300x600
      </div>
    </aside>
  );
};
