import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Share2, Calendar, User } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SidebarDb } from "@/components/SidebarDb";
import { Sidebar } from "@/components/Sidebar";
import { NewsCardDb } from "@/components/NewsCardDb";
import { NewsCard } from "@/components/NewsCard";
import { useNewsById, useRelatedNews } from "@/hooks/useNews";
import { mockNews, categoryLabels, categoryColors, SportCategory } from "@/data/newsData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const ArticlePage = () => {
  const { id } = useParams();
  const { data: dbArticle, isLoading } = useNewsById(id || "");
  
  // Fallback to mock data if not in database
  const mockArticle = mockNews.find((n) => n.id === id);
  const article = dbArticle || (mockArticle ? {
    ...mockArticle,
    published_at: mockArticle.date,
    is_hot: mockArticle.isHot || false,
    is_live: mockArticle.isLive || false,
    source_url: null,
  } : null);

  const { data: relatedNews = [] } = useRelatedNews(
    article?.category as SportCategory,
    id || "",
    3
  );

  // Fallback related news from mock
  const mockRelated = mockNews
    .filter((n) => n.category === article?.category && n.id !== id)
    .slice(0, 3);
  
  const displayRelated = relatedNews.length > 0 ? relatedNews : mockRelated;
  const hasDbNews = !!dbArticle;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">Статья не найдена</h1>
          <Link to="/" className="text-primary hover:text-primary/80">
            Вернуться на главную
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = format(
    new Date(article.published_at),
    "d MMMM yyyy",
    { locale: ru }
  );
  const readTime = Math.max(1, Math.ceil(article.content.length / 1500));
  const category = article.category as SportCategory;

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        image={article.image || undefined}
        url={`/article/${id}`}
        type="article"
        publishedTime={article.published_at}
        author={article.author}
        tags={article.tags || []}
      />
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-secondary/20 py-3">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span>/</span>
            <Link
              to={`/category/${category}`}
              className="transition-colors hover:text-foreground"
            >
              {categoryLabels[category]}
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-foreground">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к новостям
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <span className={cn("category-badge text-primary-foreground", categoryColors[category])}>
                {categoryLabels[category]}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readTime} мин чтения
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views.toLocaleString()} просмотров
              </span>
              <button className="ml-auto flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
                <Share2 className="h-4 w-4" />
                Поделиться
              </button>
            </div>

            {/* Featured Image */}
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={article.image || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}
                alt={article.title}
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <p className="mb-6 text-lg font-medium leading-relaxed text-foreground">
              {article.excerpt}
            </p>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h4 className="mb-3 font-display text-sm font-bold uppercase text-muted-foreground">
                  Теги:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related News */}
            {displayRelated.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-6 font-display text-2xl font-bold uppercase text-foreground">
                  Похожие новости
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayRelated.map((news: any) => (
                    hasDbNews ? (
                      <NewsCardDb key={news.id} article={news} />
                    ) : (
                      <NewsCard key={news.id} article={news} />
                    )
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            {hasDbNews ? <SidebarDb /> : <Sidebar />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticlePage;
