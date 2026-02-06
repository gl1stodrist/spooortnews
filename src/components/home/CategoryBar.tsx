import { Link } from "react-router-dom";
import { SPORT_CATEGORIES, categoryLabels } from "@/types/news";

export const CategoryBar = () => {
  const handleCategoryClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="sticky top-0 z-10 border-b border-border bg-background/95 py-4 backdrop-blur-sm lg:static">
      <div className="container">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {SPORT_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              onClick={handleCategoryClick}
              className="whitespace-nowrap rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {categoryLabels[cat]}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
