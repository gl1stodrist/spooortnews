import { Link } from "react-router-dom";
import { categoryLabels, type SportCategory } from "@/types/news";
import { WinlineBanner } from "./WinlineBanner";

const categories: SportCategory[] = [
  "football",
  "basketball",
  "hockey",
  "tennis",
  "motorsport",
  "mma",
];

const seoPages = [
  { label: "Новости спорта", href: "/news" },
  { label: "Футбол", href: "/football" },
  { label: "Трансферы", href: "/transfers" },
  { label: "Матчи сегодня", href: "/matches/today" },
  { label: "Матчи завтра", href: "/matches/tomorrow" },
];

const tournaments = [
  { label: "РПЛ", href: "/football/rpl" },
  { label: "Лига чемпионов", href: "/football/liga-chempionov" },
  { label: "Кубок России", href: "/football/kubok-rossii" },
];

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
                <span className="font-display text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                SPOOORT<span className="text-primary">.RU</span>
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
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={cat === "football" ? "/football" : `/category/${cat}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SEO Pages */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Популярное
            </h4>
            <ul className="space-y-2">
              {seoPages.map((page) => (
                <li key={page.href}>
                  <Link to={page.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tournaments */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Турниры
            </h4>
            <ul className="space-y-2">
              {tournaments.map((t) => (
                <li key={t.href}>
                  <Link to={t.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {t.label}
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
                <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  О проекте
                </Link>
              </li>
              <li>
                <a href="https://t.me/ivan_nogdanov" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Контакты
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Spooort.ru — Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="border-t border-border bg-muted/30 py-4">
        <div className="container">
          <WinlineBanner variant="horizontal" />
        </div>
      </div>
    </footer>
  );
};
