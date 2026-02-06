import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { useNewsByCategory } from "@/hooks/useNews";
import { mockNews } from "@/data/newsData";
import { categoryLabels, type SportCategory } from "@/types/news";

const CategoryPage = () => {
  const { category } = useParams<{ category: SportCategory }>();
  const validCategory = category as SportCategory;

  const { data: dbNews = [], isLoading } = useNewsByCategory(
    validCategory,
    20
  );

  // Fallback to mock data
  const mockCategoryNews = mockNews.filter(
    (n) => n.category === validCategory
  );
  const categoryNews = dbNews.length > 0 ? dbNews : mockCategoryNews;

  const categoryLabel = validCategory
    ? categoryLabels[validCategory]
    : "Категория";

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border bg-secondary/20 py-8">
        <div className="container">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoryLabel}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold uppercase text-foreground md:text-5xl"
          >
            {categoryLabel}
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Последние новости из мира {categoryLabel.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* News Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : categoryNews.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {categoryNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-card p-12 text-center">
                <p className="text-muted-foreground">
                  Новостей в этой категории пока нет
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
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
