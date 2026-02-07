import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { EmptyState } from "@/components/EmptyState";
import { useAllNews } from "@/hooks/useNews";

const PAGE_SIZE = 10;

const AllNewsPage = () => {
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const { data: news = [], isLoading } = useAllNews(pageSize);
  const hasMore = news.length >= pageSize;

  const handleLoadMore = useCallback(() => {
    setPageSize((prev) => prev + PAGE_SIZE);
  }, []);

  const breadcrumbs = useMemo(() => [{ label: "Все новости" }], []);

  return (
    <Layout>
      <SEO
        title="Новости спорта сегодня — все последние события"
        description="Все свежие спортивные новости сегодня: футбол, хоккей, баскетбол, теннис, UFC и автоспорт. Читайте на spooort.ru"
        url="/news"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Новости спорта сегодня
          </h1>
          <p className="mb-8 text-muted-foreground">
            Все свежие спортивные новости: футбол, хоккей, баскетбол, теннис, единоборства и автоспорт.
          </p>

          <WinlineBanner variant="horizontal" className="mb-8" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              ) : news.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {news.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleLoadMore}
                        aria-label="Загрузить ещё новости"
                        className="rounded-md border border-primary bg-transparent px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                      >
                        Загрузить ещё
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState onRetry={() => {}} isRetrying={false} />
              )}
            </div>
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      <SeoText
        paragraphs={[
          "Spooort.ru — ваш главный источник спортивных новостей на русском языке. Мы собираем и публикуем самые важные события из мира спорта каждый час.",
          "На нашем сайте вы найдёте новости футбола, хоккея, баскетбола, тенниса, единоборств и автоспорта. Все материалы проходят редакторскую обработку и дополняются экспертными комментариями.",
          "Подписывайтесь на обновления и будьте в курсе всех спортивных событий дня.",
        ]}
      />
    </Layout>
  );
};

export default AllNewsPage;
