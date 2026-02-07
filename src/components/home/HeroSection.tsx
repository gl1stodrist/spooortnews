import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsArticle } from "@/types/news";
import { DEFAULT_IMAGE } from "@/types/news";

interface HeroSectionProps {
  featuredNews: NewsArticle | null;
  secondaryNews: NewsArticle[];
  isLoading: boolean;
  isParsing: boolean;
  onRefresh: () => void;
}

export const HeroSection = ({
  featuredNews,
  secondaryNews,
  isLoading,
  isParsing,
  onRefresh,
}: HeroSectionProps) => (
  <section className="border-b border-border bg-secondary/20 py-6">
    <div className="container">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase text-muted-foreground">
          Главные новости
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isParsing}
          className="gap-2"
          aria-label={isParsing ? "Загрузка новостей" : "Обновить новости"}
        >
          <RefreshCw
            className={`h-4 w-4 ${isParsing ? "animate-spin" : ""}`}
          />
          {isParsing ? "Загрузка..." : "Обновить новости"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Featured Article */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <NewsCardSkeleton variant="featured" />
          ) : featuredNews ? (
            <NewsCard article={featuredNews} variant="featured" />
          ) : null}
        </div>

        {/* Secondary News */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[240px] w-full rounded-lg" />
              <Skeleton className="h-[240px] w-full rounded-lg" />
            </>
          ) : (
            secondaryNews.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[240px] overflow-hidden rounded-lg"
              >
                <Link
                  to={`/article/${article.id}`}
                  className="absolute inset-0"
                >
                  <img
                    src={article.image || DEFAULT_IMAGE}
                    alt={`${article.title} — spooort.ru`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
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
);
