export type SportCategory =
  | "football"
  | "basketball"
  | "hockey"
  | "tennis"
  | "motorsport"
  | "mma"
  | "olympics";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: SportCategory;
  author: string;
  published_at: string;
  views: number;
  is_hot: boolean;
  is_live: boolean;
  tags: string[];
  source_url?: string | null;
}

export const categoryLabels: Record<SportCategory, string> = {
  football: "Футбол",
  basketball: "Баскетбол",
  hockey: "Хоккей",
  tennis: "Теннис",
  motorsport: "Автоспорт",
  mma: "Единоборства",
  olympics: "Олимпиада",
};

export const categoryColors: Record<SportCategory, string> = {
  football: "bg-sport-green",
  basketball: "bg-orange-500",
  hockey: "bg-sport-blue",
  tennis: "bg-yellow-500",
  motorsport: "bg-sport-red",
  mma: "bg-purple-500",
  olympics: "bg-sport-gold",
};

export const SPORT_CATEGORIES: SportCategory[] = [
  "football",
  "basketball",
  "hockey",
  "tennis",
  "motorsport",
  "mma",
];

export const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800";

export const formatViews = (views: number): string =>
  views >= 1000 ? `${(views / 1000).toFixed(0)}K` : String(views);

export const getReadTime = (content: string): number =>
  Math.max(1, Math.ceil((content?.length || 0) / 1500));
