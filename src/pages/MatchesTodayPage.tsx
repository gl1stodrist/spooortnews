import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { EmptyState } from "@/components/EmptyState";
import { useSearchNews } from "@/hooks/useNews";

const MatchesTodayPage = () => {
  const location = useLocation();
  const period = location.pathname.includes("tomorrow") ? "tomorrow" : "today";
  const searchTerm = period === "tomorrow" ? "матч завтра" : "матч сегодня";
  const { data: news = [], isLoading } = useSearchNews(searchTerm);

  const isToday = period === "today";
  const pageTitle = isToday ? "Матчи сегодня" : "Матчи завтра";
  const seoTitle = `${pageTitle} — расписание и результаты матчей`;
  const seoDescription = `${pageTitle}: расписание, составы, прогнозы и результаты. Все спортивные матчи на spooort.ru`;

  const breadcrumbs = useMemo(() => [{ label: pageTitle }], [pageTitle]);

  return (
    <Layout>
      <SEO title={seoTitle} description={seoDescription} url={`/matches/${period}`} type="website" />

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">{pageTitle}</h1>
          <p className="mb-8 text-muted-foreground">{seoDescription}</p>

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
                <div className="grid gap-6 sm:grid-cols-2">
                  {news.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
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
          `${pageTitle} — полное расписание спортивных событий. Мы публикуем информацию о матчах футбола, хоккея, баскетбола, тенниса и других видов спорта.`,
          "Для каждого матча доступны составы команд, статистика очных встреч и экспертные прогнозы. Делайте ставки с Winline и следите за результатами в реальном времени.",
        ]}
      />
    </Layout>
  );
};

export default MatchesTodayPage;
