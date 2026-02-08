import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryBar } from "@/components/home/CategoryBar";
import { NewsFeed } from "@/components/home/NewsFeed";
import { SportsSections } from "@/components/home/SportsSections";
import { useAllNews } from "@/hooks/useNews";
import { mockNews } from "@/data/newsData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE_INCREMENT = 10;

const Index = () => {
  const [pageSize, setPageSize] = useState(PAGE_SIZE_INCREMENT);
  const { data: news = [], isLoading, refetch } = useAllNews(pageSize);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  // Use DB news if available, fall back to mock data
  const displayNews = useMemo(
    () => (news.length > 0 ? news : mockNews),
    [news]
  );

  const featuredNews = useMemo(() => displayNews[0] ?? null, [displayNews]);
  const latestNews = useMemo(() => displayNews.slice(1, 5), [displayNews]);
  const moreNews = useMemo(() => displayNews.slice(5), [displayNews]);
  const isEmpty = !isLoading && displayNews.length === 0;
  const hasMore = news.length > 0 && news.length >= pageSize;

  const handleLoadMore = useCallback(() => {
    setPageSize((prev) => prev + PAGE_SIZE_INCREMENT);
  }, []);

  const handleParseNews = useCallback(async () => {
    setIsParsing(true);
    try {
      // ИСПРАВЛЕНО: Теперь вызываем smart-api
      const { data, error } = await supabase.functions.invoke(
        "smart-api"
      );

      if (error) throw error;

      toast({
        title: "Успешно",
        description: data?.message || `Загружено ${data?.count || 0} новостей`,
      });

      refetch();
    } catch (err) {
      console.error("Parse error:", err);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  }, [refetch, toast]);

  // SEO
  const seoTitle =
    !isLoading && featuredNews
      ? featuredNews.title
      : "Главные спортивные новости";
  const seoDescription =
    !isLoading && featuredNews
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

      <HeroSection
        featuredNews={featuredNews}
        secondaryNews={latestNews.slice(0, 2)}
        isLoading={isLoading}
        isParsing={isParsing}
        onRefresh={handleParseNews}
      />

      <CategoryBar />

      <section className="py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <NewsFeed
              latestNews={latestNews}
              moreNews={moreNews}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isEmpty={isEmpty}
              onRetry={handleParseNews}
              isRetrying={isParsing}
            />
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      <SportsSections news={displayNews} />
    </Layout>
  );
};

export default Index;
