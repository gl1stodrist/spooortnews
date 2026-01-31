import { Link } from "react-router-dom";
import { categoryLabels, SportCategory } from "@/data/newsData";

const categories: SportCategory[] = [
  "football",
  "basketball",
  "hockey",
  "tennis",
  "motorsport",
  "mma",
  "olympics",
];

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
                <span className="font-display text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                SPORT<span className="text-primary">NEWS</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Главные спортивные новости со всего мира. Футбол, баскетбол, хоккей и другие виды спорта.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Разделы
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Ещё
            </h4>
            <ul className="space-y-2">
              {categories.slice(4).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Информация
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Редакция
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Реклама
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 SportNews. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Политика конфиденциальности
            </Link>
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Условия использования
            </Link>
          </div>
        </div>
      </div>

      {/* Ad Space Placeholder */}
      <div className="border-t border-border bg-muted/30 py-4">
        <div className="container">
          <div className="flex h-20 items-center justify-center rounded border border-dashed border-border text-sm text-muted-foreground">
            Рекламное место
          </div>
        </div>
      </div>
    </footer>
  );
};
