import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { EmptyState } from "@/components/EmptyState";
import { useNewsByCategory } from "@/hooks/useNews";
import { useAllTournaments } from "@/hooks/useTournaments";

const FootballPage = () => {
  const { data: news = [], isLoading } = useNewsByCategory("football", 20);
  const { data: tournaments = [] } = useAllTournaments("football");

  const breadcrumbs = useMemo(() => [{ label: "Футбол" }], []);

  return (
    <Layout>
      <SEO
        title="Футбол — новости сегодня, матчи и трансферы"
        description="Футбольные новости сегодня: РПЛ, Лига чемпионов, трансферы, результаты матчей. Читайте на spooort.ru"
        url="/football"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Футбол — новости сегодня
          </h1>
          <p className="mb-8 text-muted-foreground">
            Все последние новости из мира футбола: РПЛ, европейские лиги, трансферы, результаты и аналитика.
          </p>

          {/* Tournaments */}
          {tournaments.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">Турниры</h2>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                {tournaments.map((t) => (
                  <Link
                    key={t.id}
                    to={`/football/${t.slug}`}
                    className="flex-shrink-0 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

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
          "Футбол — самый популярный вид спорта в мире, и мы освещаем его максимально полно. На spooort.ru вы найдёте новости РПЛ, Лиги чемпионов, чемпионатов Англии, Испании, Италии и Германии.",
          "Мы следим за трансферами, анализируем матчи, публикуем интервью с игроками и тренерами. Все новости обновляются автоматически каждый час.",
          "Раздел футбольных новостей — самый полный русскоязычный источник информации о мировом и российском футболе.",
        ]}
      />
    </Layout>
  );
};

export default FootballPage;
