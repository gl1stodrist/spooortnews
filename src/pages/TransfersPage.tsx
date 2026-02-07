import { useMemo } from "react";
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

const TransfersPage = () => {
  const { data: news = [], isLoading } = useSearchNews("трансфер");

  const breadcrumbs = useMemo(() => [{ label: "Трансферы" }], []);

  return (
    <Layout>
      <SEO
        title="Трансферы сегодня — последние новости трансферов"
        description="Трансферные новости сегодня: покупки, продажи, аренды и слухи. Все трансферы футбола, баскетбола и хоккея на spooort.ru"
        url="/transfers"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Трансферы сегодня
          </h1>
          <p className="mb-8 text-muted-foreground">
            Все последние трансферные новости: покупки, продажи, свободные агенты и слухи из мира спорта.
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
          "Трансферное окно — одно из самых интересных периодов в спорте. На spooort.ru мы оперативно публикуем информацию о переходах игроков, контрактах и трансферных слухах.",
          "Следите за трансферами РПЛ, европейских лиг, НБА, КХЛ и UFC. Мы публикуем только проверенную информацию из надёжных источников.",
        ]}
      />
    </Layout>
  );
};

export default TransfersPage;
