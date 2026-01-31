import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { mockNews, categoryLabels, SportCategory } from "@/data/newsData";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories: SportCategory[] = [
  "football",
  "basketball",
  "hockey",
  "tennis",
  "motorsport",
  "mma",
];

const Index = () => {
  const featuredNews = mockNews[0];
  const latestNews = mockNews.slice(1, 5);
  const moreNews = mockNews.slice(5);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/20 py-6">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <NewsCard article={featuredNews} variant="featured" />
            </div>

            {/* Secondary News */}
            <div className="flex flex-col gap-4">
              {latestNews.slice(0, 2).map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-[240px] overflow-hidden rounded-lg"
                >
                  <Link to={`/article/${article.id}`} className="absolute inset-0">
                    <img
                      src={article.image}
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
              ))}
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
                {latestNews.map((article, index) => (
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

              {/* More News */}
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
                      <NewsCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="rounded-md border border-primary bg-transparent px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                  Загрузить ещё
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Sports Sections Preview */}
      <section className="border-t border-border bg-secondary/20 py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {categories.slice(0, 3).map((cat) => {
              const categoryNews = mockNews.filter((n) => n.category === cat).slice(0, 1)[0];
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
                  <NewsCard article={categoryNews} />
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
