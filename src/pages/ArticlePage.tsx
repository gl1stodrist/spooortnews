import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Share2, Calendar, User } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { mockNews, categoryLabels, categoryColors } from "@/data/newsData";
import { cn } from "@/lib/utils";

const ArticlePage = () => {
  const { id } = useParams();
  const article = mockNews.find((n) => n.id === id);

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

  const relatedNews = mockNews
    .filter((n) => n.category === article.category && n.id !== article.id)
    .slice(0, 3);

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-secondary/20 py-3">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span>/</span>
            <Link
              to={`/category/${article.category}`}
              className="transition-colors hover:text-foreground"
            >
              {categoryLabels[article.category]}
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
              <span className={cn("category-badge text-primary-foreground", categoryColors[article.category])}>
                {categoryLabels[article.category]}
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
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} мин чтения
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
                src={article.image}
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
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {article.content}
              </p>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Матч привлёк огромное внимание болельщиков по всему миру. Стадион был заполнен до отказа, а телевизионная аудитория превысила 500 миллионов человек. Это событие стало одним из самых ярких моментов сезона.
              </p>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Эксперты отмечают высокий уровень игры обеих команд, однако разница в классе оказалась очевидной. Победители продемонстрировали тактическую гибкость и превосходную физическую подготовку.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Следующий матч состоится через неделю, и болельщики с нетерпением ждут продолжения захватывающего сезона.
              </p>
            </div>

            {/* Tags */}
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

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-6 font-display text-2xl font-bold uppercase text-foreground">
                  Похожие новости
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedNews.map((news) => (
                    <NewsCard key={news.id} article={news} />
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticlePage;
