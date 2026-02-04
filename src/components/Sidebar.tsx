import { TrendingUp, Flame } from "lucide-react";
import { getPopularNews, getHotNews } from "@/data/newsData";
import { NewsCard } from "./NewsCard";

export const Sidebar = () => {
  const popularNews = getPopularNews();
  const hotNews = getHotNews();

  const adLink = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

  return (
    <aside className="space-y-8">
      {/* Ad Space */}
      <a href={adLink} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg transition-transform hover:scale-[1.02]">
        <img src="/assets/winline-banner-2.png" alt="Winline - Фрибет 3000" className="w-full" />
      </a>

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
      <a href={adLink} target="_blank" rel="noopener noreferrer" className="sticky top-24 block overflow-hidden rounded-lg transition-transform hover:scale-[1.02]">
        <img src="/assets/winline-banner-1.png" alt="Winline - Верни азарт в футбол" className="w-full" />
      </a>
    </aside>
  );
};
