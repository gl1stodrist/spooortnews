import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { NewsCardSkeleton } from "@/components/NewsCardSkeleton";
import { SeoText } from "@/components/SeoText";
import { WinlineBanner } from "@/components/WinlineBanner";
import { useNewsByCategory } from "@/hooks/useNews";
import { mockNews } from "@/data/newsData";
import { categoryLabels, type SportCategory } from "@/types/news";

const categorySeoTexts: Record<string, string[]> = {
  football: [
    "Футбол — самый популярный вид спорта в России и мире. На spooort.ru вы найдёте все главные новости российского и мирового футбола.",
    "Следите за чемпионатами РПЛ, Лиги чемпионов, АПЛ, Ла Лиги и других топ-лиг. Трансферы, результаты, аналитика и интервью.",
  ],
  basketball: [
    "Баскетбольные новости на spooort.ru: НБА, Евролига, чемпионат России. Результаты матчей, статистика и аналитика.",
    "Следите за выступлениями лучших баскетболистов мира и российских клубов на нашем портале.",
  ],
  hockey: [
    "Хоккейные новости: КХЛ, НХЛ, сборная России. Результаты матчей, трансферы, аналитика и прогнозы.",
    "Spooort.ru — ваш источник оперативных хоккейных новостей. Все события КХЛ и мирового хоккея.",
  ],
  tennis: [
    "Теннисные новости на spooort.ru: ATP, WTA, Grand Slam турниры. Результаты матчей и рейтинги игроков.",
    "Следите за выступлениями Медведева, Рублёва и других российских теннисистов на мировой арене.",
  ],
  motorsport: [
    "Автоспортивные новости: Формула-1, ралли, гонки на выносливость. Результаты Гран-при и квалификаций.",
    "Вся актуальная информация из мира автоспорта на spooort.ru — от пит-стопов до подиумов.",
  ],
  mma: [
    "Единоборства на spooort.ru: UFC, Bellator, ACA. Результаты боёв, рейтинги бойцов и анонсы турниров.",
    "Следите за выступлениями российских бойцов в UFC и других организациях смешанных единоборств.",
  ],
  olympics: [
    "Олимпийские новости на spooort.ru: подготовка к Играм, результаты соревнований, медальный зачёт.",
    "Все события Олимпийского движения — от квалификационных турниров до церемоний награждения.",
  ],
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const validCategory = category as SportCategory;

  const { data: dbNews = [], isLoading } = useNewsByCategory(validCategory, 20);

  const mockCategoryNews = mockNews.filter((n) => n.category === validCategory);
  const categoryNews = dbNews.length > 0 ? dbNews : mockCategoryNews;

  const categoryLabel = validCategory ? categoryLabels[validCategory] : "Категория";

  const title = `${categoryLabel} — последние новости сегодня`;
  const description = `Свежие новости ${categoryLabel.toLowerCase()}: результаты, трансферы и события сегодня. Читайте на spooort.ru`;

  const breadcrumbs = [{ label: categoryLabel }];
  const seoTexts = categorySeoTexts[validCategory] || [];

  return (
    <Layout>
      <SEO title={title} description={description} url={`/category/${category}`} type="website" />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="bg-secondary/20 py-8">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold uppercase text-foreground md:text-5xl"
          >
            {categoryLabel}
          </motion.h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <WinlineBanner variant="horizontal" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-3">
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
                    transition={{ delay: index * 0.05 }}
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-card p-12 text-center">
                <p className="text-muted-foreground">Новостей в этой категории пока нет</p>
                <Link to="/" className="mt-4 inline-block text-primary hover:text-primary/80">
                  Вернуться на главную
                </Link>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </div>

      <SeoText paragraphs={seoTexts} />
    </Layout>
  );
};

export default CategoryPage;
