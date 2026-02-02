import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top Bar */}
      <div className="border-b border-border bg-secondary/50">
        <div className="container flex h-8 items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>31 января 2026</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden items-center gap-1 sm:flex">
              <TrendingUp className="h-3 w-3 text-primary" />
              Топ: Эль-Класико
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
              О нас
            </Link>
            <a href="https://t.me/ivan_nogdanov" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              Контакты
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
            <span className="font-display text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="hidden font-display text-2xl font-bold tracking-tight sm:inline">
            SPORT<span className="text-primary">NEWS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {categoryLabels[cat]}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Поиск"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label="Меню"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-secondary/50"
          >
            <div className="container py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск новостей..."
                  className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Найти
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background lg:hidden"
          >
            <nav className="container flex flex-col py-4">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-b border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground last:border-b-0"
                >
                  {categoryLabels[cat]}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
