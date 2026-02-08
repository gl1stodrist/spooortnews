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
      // Прямой вызов твоей рабочей функции (игнорируем старый конфиг)
      const response = await fetch('https://yamtqvmekavsaquossah.supabase.co/functions/v1/smart-api', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Ошибка при вызове Edge Function');

      toast({
        title: "Успешно",
        description: "Новости обновлены! Сейчас данные загрузятся.",
      });

      // Небольшая задержка перед обновлением списка
      setTimeout(() => {
        refetch();
      }, 1000);

    } catch (err) {
      console.error("Parse error:", err);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить новости. Проверь логи в Supabase.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  }, [refetch, toast]);

  const seoTitle = !isLoading && featuredNews ? featuredNews.title : "Главные спортивные новости";
  const seoDescription = !isLoading && featuredNews ? featuredNews.excerpt : "Оперативное освещение спортивных новостей.";
  const seoImage = !isLoading && featuredNews ? featuredNews.image : undefined;

  return (
    <Layout>
      <SEO title={seoTitle} description={seoDescription} image={seoImage || undefined} url="/" type="website" />
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
