import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { useTournamentBySlug, useTournamentNews } from "@/hooks/useTournaments";
import { useAllTeams, type Team } from "@/hooks/useTeams";
import { EmptyState } from "@/components/EmptyState";
import type { NewsArticle } from "@/types/news";

const transformRow = (row: Record<string, unknown>): NewsArticle => ({
  id: row.id as string,
  title: row.title as string,
  excerpt: row.excerpt as string,
  content: row.content as string,
  image: (row.image as string | null) ?? null,
  category: row.category as NewsArticle["category"],
  author: row.author as string,
  published_at: row.published_at as string,
  views: (row.views as number) ?? 0,
  is_hot: (row.is_hot as boolean) ?? false,
  is_live: (row.is_live as boolean) ?? false,
  tags: (row.tags as string[]) ?? [],
  source_url: (row.source_url as string | null) ?? null,
});

const TournamentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tournament, isLoading: loadingTournament } = useTournamentBySlug(slug || "");
  const { data: rawNews = [], isLoading: loadingNews } = useTournamentNews(tournament?.name || "", 20);
  const { data: teams = [] } = useAllTeams(slug === "rpl" ? "rpl" : undefined);

  const news = rawNews.map(transformRow);
  const isLoading = loadingTournament || loadingNews;

  // Show teams only for RPL
  const showTeams = slug === "rpl" && teams.length > 0;

  if (!loadingTournament && !tournament) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">Турнир не найден</h1>
          <Link to="/football" className="text-primary hover:text-primary/80">
            Вернуться к футболу
          </Link>
        </div>
      </Layout>
    );
  }

  const tournamentName = tournament?.name || "Турнир";
  const title = `${tournamentName} — последние новости, матчи и события сегодня`;
  const description = `Свежие новости ${tournamentName}: расписание матчей, результаты, таблица и трансферы. Читайте на spooort.ru`;

  const sportLabel = tournament?.sport === "football" ? "Футбол" : tournament?.sport || "Спорт";
  const breadcrumbs = [
    { label: sportLabel, href: `/${tournament?.sport || "football"}` },
    { label: tournamentName },
  ];

  const seoTexts = tournament
    ? [
        tournament.description || `${tournamentName} — один из главных спортивных турниров.`,
        `Следите за всеми событиями ${tournamentName} на spooort.ru. Мы публикуем оперативные новости, результаты матчей, аналитику и экспертные мнения. Обновления каждый час.`,
        `Все новости ${tournamentName} в одном месте — от трансферов до итогов последних туров.`,
      ]
    : [];

  const jsonLd = tournament
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: tournamentName,
        description: tournament.description,
        url: `https://spooort.ru/football/${slug}`,
      }
    : null;

  return (
    <Layout>
      <SEO title={title} description={description} url={`/football/${slug}`} type="website" />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Новости {tournamentName}
          </h1>
          <p className="mb-8 text-muted-foreground">{description}</p>

          {/* Teams grid for RPL */}
          {showTeams && (
            <div className="mb-8">
              <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">
                Команды РПЛ
              </h2>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                {teams.map((team: Team) => (
                  <Link
                    key={team.id}
                    to={`/football/rpl/teams/${team.slug}`}
                    className="flex-shrink-0 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {team.name}
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

      <SeoText paragraphs={seoTexts} />
    </Layout>
  );
};

export default TournamentPage;
