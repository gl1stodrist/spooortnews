import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import type { NewsArticle } from "@/types/news";

interface NewsFeedProps {
  latestNews: NewsArticle[];
  moreNews: NewsArticle[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.95 },
};

export const NewsFeed = ({
  latestNews,
  moreNews,
  isLoading,
  onLoadMore,
  hasMore,
  isEmpty,
  onRetry,
  isRetrying,
}: NewsFeedProps) => {
  if (!isLoading && isEmpty) {
    return (
      <div className="lg:col-span-2">
        <EmptyState onRetry={onRetry} isRetrying={isRetrying} />
      </div>
    );
  }

  return (
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
        <AnimatePresence mode="popLayout">
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div key={`skeleton-${i}`}>
                  <NewsCardSkeleton />
                </div>
              ))
            : latestNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  layout
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {moreNews.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-6 font-display text-2xl font-bold uppercase text-foreground">
            Ещё новости
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {moreNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  layout
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            aria-label="Загрузить ещё новости"
            className="rounded-md border border-primary bg-transparent px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
};
