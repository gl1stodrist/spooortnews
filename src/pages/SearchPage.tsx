import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { NewsCardDb } from "@/components/NewsCardDb";
import { NewsCard } from "@/components/NewsCard";
import { SidebarDb } from "@/components/SidebarDb";
import { Sidebar } from "@/components/Sidebar";
import { useSearchNews } from "@/hooks/useNews";
import { searchNews } from "@/data/newsData";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data: dbResults = [], isLoading } = useSearchNews(query);
  
  // Fallback to mock data search
  const mockResults = searchNews(query);
  const hasDbResults = dbResults.length > 0;
  const results = hasDbResults ? dbResults : mockResults;

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border bg-secondary/20 py-8">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span>/</span>
            <span className="text-foreground">Поиск</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Search className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold uppercase text-foreground md:text-4xl">
              Результаты поиска
            </h1>
          </motion.div>
          {query && (
            <p className="mt-2 text-muted-foreground">
              По запросу <span className="text-foreground font-medium">"{query}"</span> найдено{" "}
              {results.length} {results.length === 1 ? "результат" : results.length < 5 ? "результата" : "результатов"}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Results */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {results.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {hasDbResults ? (
                      <NewsCardDb article={article as any} />
                    ) : (
                      <NewsCard article={article as any} />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-card p-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 font-display text-xl font-bold text-foreground">
                  Ничего не найдено
                </h2>
                <p className="text-muted-foreground">
                  Попробуйте изменить поисковый запрос
                </p>
                <Link
                  to="/"
                  className="mt-4 inline-block text-primary hover:text-primary/80"
                >
                  Вернуться на главную
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            {hasDbResults ? <SidebarDb /> : <Sidebar />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
