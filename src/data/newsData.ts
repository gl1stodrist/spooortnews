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
  image: string;
  category: SportCategory;
  author: string;
  date: string;
  readTime: number;
  isHot?: boolean;
  isLive?: boolean;
  tags: string[];
  views: number;
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

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Реал Мадрид разгромил Барселону в Эль-Класико со счётом 4:0",
    excerpt: "Исторический матч на Сантьяго Бернабеу завершился полным доминированием хозяев поля.",
    content: "В очередном противостоянии двух испанских гигантов 'Реал Мадрид' одержал убедительную победу над 'Барселоной'. Хет-трик Винисиуса Жуниора и гол Беллингема принесли 'Королевскому клубу' важнейшие три очка в борьбе за чемпионство Ла Лиги.",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    category: "football",
    author: "Александр Петров",
    date: "2026-01-31",
    readTime: 5,
    isHot: true,
    tags: ["Эль-Класико", "Ла Лига", "Реал Мадрид"],
    views: 125000,
  },
  {
    id: "2",
    title: "НБА: Леброн Джеймс установил новый рекорд результативности",
    excerpt: "Легенда баскетбола продолжает переписывать историю лиги.",
    content: "Леброн Джеймс в матче против 'Голден Стэйт Уорриорз' набрал 45 очков, обновив свой личный рекорд сезона. Это 103-й матч в карьере Джеймса, в котором он набрал более 40 очков.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    category: "basketball",
    author: "Михаил Сидоров",
    date: "2026-01-31",
    readTime: 4,
    isLive: true,
    tags: ["НБА", "Леброн Джеймс", "Рекорды"],
    views: 89000,
  },
  {
    id: "3",
    title: "Формула-1: Ферстаппен выиграл Гран-при Монако",
    excerpt: "Голландский пилот одержал пятую победу в сезоне подряд.",
    content: "Макс Ферстаппен продемонстрировал безупречную гонку на улицах Монако, опередив ближайшего преследователя более чем на 20 секунд. Red Bull Racing укрепляет лидерство в Кубке конструкторов.",
    image: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800",
    category: "motorsport",
    author: "Дмитрий Волков",
    date: "2026-01-30",
    readTime: 6,
    isHot: true,
    tags: ["Формула-1", "Ферстаппен", "Гран-при"],
    views: 67000,
  },
  {
    id: "4",
    title: "СКА обыграл ЦСКА в дерби КХЛ",
    excerpt: "Питерская команда одержала волевую победу в овертайме.",
    content: "В захватывающем поединке КХЛ СКА вырвал победу у ЦСКА со счётом 4:3 в овертайме. Решающую шайбу забросил Никита Кучеров на 63-й минуте матча.",
    image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800",
    category: "hockey",
    author: "Андрей Козлов",
    date: "2026-01-30",
    readTime: 4,
    tags: ["КХЛ", "СКА", "ЦСКА", "Дерби"],
    views: 54000,
  },
  {
    id: "5",
    title: "UFC 300: Махачев защитил титул в полулёгком весе",
    excerpt: "Российский боец одержал победу удушающим приёмом в третьем раунде.",
    content: "Ислам Махачев успешно защитил свой чемпионский пояс UFC в легчайшем весе, победив Дастина Порье удушающим приёмом. Это уже третья защита титула для дагестанского бойца.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
    category: "mma",
    author: "Руслан Магомедов",
    date: "2026-01-29",
    readTime: 5,
    isHot: true,
    tags: ["UFC", "Махачев", "Единоборства"],
    views: 98000,
  },
  {
    id: "6",
    title: "Медведев вышел в финал Australian Open",
    excerpt: "Российский теннисист обыграл Синнера в пяти сетах.",
    content: "Даниил Медведев продемонстрировал невероятную выносливость и волю к победе в полуфинале Australian Open, одолев итальянца Янника Синнера в пятисетовом триллере. В финале россиянин встретится с Новаком Джоковичем.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    category: "tennis",
    author: "Елена Иванова",
    date: "2026-01-29",
    readTime: 4,
    tags: ["Теннис", "Australian Open", "Медведев"],
    views: 72000,
  },
  {
    id: "7",
    title: "Олимпийские игры 2028: представлен официальный талисман",
    excerpt: "Организаторы Лос-Анджелеса показали символ предстоящих Игр.",
    content: "Оргкомитет Олимпийских игр 2028 года в Лос-Анджелесе представил официального талисмана соревнований. Им стал калифорнийский медведь по имени 'Санни', символизирующий дух Калифорнии.",
    image: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800",
    category: "olympics",
    author: "Мария Соколова",
    date: "2026-01-28",
    readTime: 3,
    tags: ["Олимпиада", "Лос-Анджелес 2028"],
    views: 45000,
  },
  {
    id: "8",
    title: "Манчестер Сити подписал контракт с юной звездой",
    excerpt: "17-летний вундеркинд перешёл из академии за рекордную сумму.",
    content: "Манчестер Сити объявил о подписании контракта с молодым полузащитником сборной Бразилии. Сумма трансфера составила 75 миллионов евро, что является рекордом для игрока до 18 лет.",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    category: "football",
    author: "Александр Петров",
    date: "2026-01-28",
    readTime: 4,
    tags: ["Трансферы", "АПЛ", "Манчестер Сити"],
    views: 83000,
  },
];

export const getNewsByCategory = (category: SportCategory): NewsArticle[] => {
  return mockNews.filter((news) => news.category === category);
};

export const getHotNews = (): NewsArticle[] => {
  return mockNews.filter((news) => news.isHot);
};

export const getPopularNews = (): NewsArticle[] => {
  return [...mockNews].sort((a, b) => b.views - a.views).slice(0, 5);
};

export const searchNews = (query: string): NewsArticle[] => {
  const lowerQuery = query.toLowerCase();
  return mockNews.filter(
    (news) =>
      news.title.toLowerCase().includes(lowerQuery) ||
      news.excerpt.toLowerCase().includes(lowerQuery) ||
      news.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
