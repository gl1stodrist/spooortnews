import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://spooort.ru/" },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://spooort.ru${item.href}` } : {}),
      })),
    ],
  };

  return (
    <nav aria-label="Хлебные крошки" className="border-b border-border bg-secondary/20 py-3">
      <div className="container">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Главная</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {item.href && index < items.length - 1 ? (
                <Link to={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="line-clamp-1 text-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </nav>
  );
};
