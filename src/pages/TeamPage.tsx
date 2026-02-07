import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Sidebar } from "@/components/Sidebar";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { useTeamBySlug, useTeamNews } from "@/hooks/useTeams";
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

const TeamPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: team, isLoading: loadingTeam } = useTeamBySlug(slug || "");
  const { data: rawNews = [], isLoading: loadingNews } = useTeamNews(team?.name || "", 20);

  const news = rawNews.map(transformRow);
  const isLoading = loadingTeam || loadingNews;

  if (!loadingTeam && !team) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">Команда не найдена</h1>
          <Link to="/football/rpl" className="text-primary hover:text-primary/80">
            Вернуться к РПЛ
          </Link>
        </div>
      </Layout>
    );
  }

  const teamName = team?.name || "Команда";
  const title = `${teamName} — последние новости, матчи и события сегодня`;
  const description = `Свежие новости о ${teamName}: матчи, трансферы, результаты и события сегодня. Читайте на spooort.ru`;

  const breadcrumbs = [
    { label: "Футбол", href: "/football" },
    { label: "РПЛ", href: "/football/rpl" },
    { label: teamName },
  ];

  const seoTexts = team
    ? [
        team.description || `${teamName} — один из ведущих клубов российского футбола.`,
        `На этой странице вы найдёте самые свежие новости о ${teamName}: результаты матчей, трансферные слухи, интервью с игроками и тренерами. Следите за выступлениями команды в Российской Премьер-Лиге и кубковых турнирах.`,
        `Все материалы обновляются автоматически — вы всегда будете в курсе последних событий из жизни ${teamName}.`,
      ]
    : [];

  const jsonLd = team
    ? {
        "@context": "https://schema.org",
        "@type": "SportsTeam",
        name: teamName,
        sport: "Football",
        memberOf: {
          "@type": "SportsOrganization",
          name: "Российская Премьер-Лига",
        },
        url: `https://spooort.ru/football/rpl/teams/${slug}`,
      }
    : null;

  return (
    <Layout>
      <SEO title={title} description={description} url={`/football/rpl/teams/${slug}`} type="website" />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <Breadcrumbs items={breadcrumbs} />

      <section className="py-8">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Новости {teamName}
          </h1>
          <p className="mb-8 text-muted-foreground">{description}</p>

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

export default TeamPage;
