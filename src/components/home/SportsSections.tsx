import { Link } from "react-router-dom";
import { NewsCard } from "@/components/NewsCard";
import {
  SPORT_CATEGORIES,
  categoryLabels,
  type NewsArticle,
} from "@/types/news";

interface SportsSectionsProps {
  news: NewsArticle[];
}

export const SportsSections = ({ news }: SportsSectionsProps) => {
  if (news.length === 0) return null;

  const sections = SPORT_CATEGORIES.slice(0, 3)
    .map((cat) => ({
      category: cat,
      article: news.find((n) => n.category === cat) ?? null,
    }))
    .filter((s) => s.article !== null);

  if (sections.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/20 py-8">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {sections.map(({ category, article }) => (
            <div key={category}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold uppercase text-foreground">
                  {categoryLabels[category]}
                </h3>
                <Link
                  to={`/category/${category}`}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Все →
                </Link>
              </div>
              <NewsCard article={article!} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
