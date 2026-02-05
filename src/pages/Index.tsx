import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { NewsCardDb } from "@/components/NewsCardDb";
import { NewsCard } from "@/components/NewsCard";
import { SidebarDb } from "@/components/SidebarDb";
import { Sidebar } from "@/components/Sidebar";
import { useAllNews } from "@/hooks/useNews";
import { mockNews, categoryLabels, SportCategory } from "@/data/newsData";
import { Link } from "react-router-dom";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const categories: SportCategory[] = [
  "football",
  "basketball",
  "hockey",
  "tennis",
  "motorsport",
  "mma",
];

const Index = () => {
  const { data: news = [], isLoading, refetch } = useAllNews(20);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  // Use database news if available, otherwise fall back to mock data
  const hasDbNews = news.length > 0;
  const featuredNews = hasDbNews ? news[0] : mockNews[0];
  const latestNews = hasDbNews ? news.slice(1, 5) : mockNews.slice(1, 5);
  const moreNews = hasDbNews ? news.slice(5) : mockNews.slice(5);

  const handleParseNews = async () => {
    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-sports-news');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Успешно",
        description: data?.message || `Загружено ${data?.count || 0} новостей`,
      });
      
      refetch();
    } catch (err) {
      console.error('Parse error:', err);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  // SEO data from featured news
  const seoTitle = !isLoading && featuredNews ? featuredNews.title : "Главные спортивные новости";
  const seoDescription = !isLoading && featuredNews 
    ? featuredNews.excerpt 
    : "Оперативное освещение спортивных новостей со всего мира. Футбол, баскетбол, хоккей, теннис, автоспорт, единоборства.";
  const seoImage = !isLoading && featuredNews ? featuredNews.image : undefined;

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage || undefined}
        url="/"
        type="website"
      />
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/20 py-6">
        <div className="container">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase text-muted-foreground">
              Главные новости
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleParseNews}
              disabled={isParsing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isParsing ? 'animate-spin' : ''}`} />
              {isParsing ? 'Загрузка...' : 'Обновить новости'}
            </Button>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <Skeleton className="h-[500px] w-full rounded-lg" />
              ) : hasDbNews ? (
                <NewsCardDb article={featuredNews as any} variant="featured" />
              ) : (
                <NewsCard article={featuredNews as any} variant="featured" />
              )}
            </div>

            {/* Secondary News */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-[240px] w-full rounded-lg" />
                  <Skeleton className="h-[240px] w-full rounded-lg" />
                </>
              ) : (
                latestNews.slice(0, 2).map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative h-[240px] overflow-hidden rounded-lg"
                  >
                    <Link to={`/article/${article.id}`} className="absolute inset-0">
                      <img
                        src={article.image || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="line-clamp-2 font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="border-b border-border py-4">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {categoryLabels[cat]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* News Feed */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                  Последние новости
                </h2>
                <Link
                  to="/category/football"
                  className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
                >
                  Все новости
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                    ))}
                  </>
                ) : (
                  latestNews.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {hasDbNews ? (
                        <NewsCardDb article={article as any} />
                      ) : (
                        <NewsCard article={article as any} />
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* More News */}
              {moreNews.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-6 font-display text-2xl font-bold uppercase text-foreground">
                    Ещё новости
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {moreNews.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {hasDbNews ? (
                          <NewsCardDb article={article as any} />
                        ) : (
                          <NewsCard article={article as any} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="rounded-md border border-primary bg-transparent px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                  Загрузить ещё
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              {hasDbNews ? <SidebarDb /> : <Sidebar />}
            </div>
          </div>
        </div>
      </section>

      {/* Sports Sections Preview */}
      <section className="border-t border-border bg-secondary/20 py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {categories.slice(0, 3).map((cat) => {
              const categoryNews = hasDbNews
                ? news.filter((n) => n.category === cat).slice(0, 1)[0]
                : mockNews.filter((n) => n.category === cat).slice(0, 1)[0];
              
              if (!categoryNews) return null;
              
              return (
                <div key={cat}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold uppercase text-foreground">
                      {categoryLabels[cat]}
                    </h3>
                    <Link
                      to={`/category/${cat}`}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      Все →
                    </Link>
                  </div>
                  {hasDbNews ? (
                    <NewsCardDb article={categoryNews as any} />
                  ) : (
                    <NewsCard article={categoryNews as any} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
