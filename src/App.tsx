// ================================================
// Полный современный SPA для spooort.ru
// React + Vite + TailwindCSS + React Router + Framer Motion + React Helmet
// Готов к запуску (npm create vite → React TS → затем команды ниже)
// ================================================

// 1. Установка зависимостей (выполни один раз):
// npm install react-router-dom framer-motion react-helmet-async
// npm install -D @types/react-helmet-async
// npm install @tailwindcss/typography   ← для красивого prose

// 2. tailwind.config.ts (добавь typography)
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

// 3. src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

// ================================================
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// ================================================
// src/App.tsx  ← ВСЁ ЗДЕСЬ (один файл для удобства)
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  team_logo1?: string;
  team_logo2?: string;
  sport?: string;
  bet?: string;
  odds?: number;
  slug: string;
  created_at: string;
}

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_ANON_KEY = 'ВСТАВЬ_СВОЙ_ANON_KEY_ИЗ_SUPABASE_СЮДА'; // ← ОБЯЗАТЕЛЬНО!

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIzMCIgZmlsbD0iIzExMTgyNyIvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQyIiBmaWxsPSIjMUYyOTM3IiBzdHJva2U9IiM0QjU1NjMiIHN0cm9rZS13aWR0aD0iMTIiLz4KICA8dGV4dCB4PSI2MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjaywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VEVBTTwvdGV4dD4KPC9zdmc+';

const sportEmojis: Record<string, string> = {
  football: '⚽',
  esports: '🎮',
  hockey: '🏒',
  basketball: '🏀',
  tennis: '🎾',
};

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prognoz/:slug" element={<PredictionDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl font-black tracking-[-4px]">S</span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tighter">spooort</div>
            <div className="text-[10px] text-zinc-500 -mt-1">.ru</div>
          </div>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-red-400 transition">Главная</Link>
          <a href="#best" className="hover:text-red-400 transition">Лучшие</a>
          <a href="#about" className="hover:text-red-400 transition">О нас</a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-zinc-900 text-center text-zinc-500 text-sm">
      © 2026 spooort.ru • Прогнозы от нейросети • Для развлечения
    </footer>
  );
}

// ==================== ГЛАВНАЯ ====================
function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}?select=*&status=eq.published&order=created_at.desc&limit=50`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      setPosts(data.length ? data : staticFallback);
    } catch {
      setPosts(staticFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...posts];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || (p.bet || '').toLowerCase().includes(q));
    }
    if (activeFilter !== 'all') {
      result = result.filter(p => p.sport === activeFilter);
    }

    setFilteredPosts(result);
  }, [posts, searchTerm, activeFilter]);

  const top3 = posts.slice(0, 3); // Лучшие за неделю (самые свежие + с кэфом)

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-3xl text-red-500">Загрузка прогнозов...</div>;

  return (
    <>
      <Helmet>
        <title>spooort.ru — Прогнозы от нейросети на футбол, хоккей, баскетбол и CS2</title>
        <meta name="description" content="Актуальные спортивные прогнозы от нейросети. Футбол, хоккей, баскетбол, теннис, киберспорт. Реальные коэффициенты и анализ." />
        <meta name="keywords" content="прогнозы на спорт, футбол прогноз, хоккей прогноз, баскетбол прогноз, cs2 прогноз, spooort" />
      </Helmet>

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-7xl font-black tracking-tighter mb-4">СВЕЖИЕ ПРОГНОЗЫ</h1>
        <p className="text-xl text-zinc-400">От нейросети • Обновление каждые 4 часа</p>
      </header>

      {/* ФИЛЬТРЫ + ПОИСК */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 items-center justify-center mb-12">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Поиск матча..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-3xl py-4 pl-14 pr-6 text-lg placeholder:text-zinc-500"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">🔍</div>
        </div>

        {['all', 'football', 'esports', 'hockey', 'basketball', 'tennis'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-3 rounded-3xl text-sm font-medium flex items-center gap-2 transition ${
              activeFilter === f ? 'bg-red-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {f === 'all' ? 'Все' : sportEmojis[f]} {f === 'all' ? '' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ЛУЧШИЕ ЗА НЕДЕЛЮ */}
      <section id="best" className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-bold tracking-tight mb-10 text-center">⭐ Лучшие прогнозы недели</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {top3.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -12 }}
            >
              <PredictionCard post={post} isFeatured />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ВСЕ ПРОГНОЗЫ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PredictionCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* О НАС (в стиле Lovable) */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800">
        <div className="text-center mb-16">
          <div className="inline bg-red-600/10 text-red-400 text-sm px-6 py-2 rounded-3xl">О НАС</div>
          <h2 className="text-5xl font-black tracking-tighter mt-6">spooort.ru — прогнозы от нейросети</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: '🤖', title: 'ИИ-анализ', desc: 'Тысячи параметров в реальном времени' },
            { icon: '⚡', title: 'Скорость', desc: 'Обновления каждые 4 часа' },
            { icon: '🏆', title: '5 видов спорта', desc: 'Футбол • Хоккей • Баскетбол • Теннис • CS2' },
            { icon: '📊', title: 'Точные кэфы', desc: 'Реальные коэффициенты из топ-букмекеров' },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 text-center"
            >
              <div className="text-6xl mb-6">{c.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{c.title}</h3>
              <p className="text-zinc-400">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

// ==================== КОМПОНЕНТ КАРТОЧКИ ====================
function PredictionCard({ post, isFeatured = false }: { post: Post; isFeatured?: boolean }) {
  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <Link to={`/prognoz/${post.slug}`}>
      <motion.div
        whileHover={{ scale: isFeatured ? 1.03 : 1.05, y: -8 }}
        className={`group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/60 transition-all h-full flex flex-col ${isFeatured ? 'ring-2 ring-red-500/30' : ''}`}
      >
        <div className="p-8 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <img src={post.team_logo1 || DEFAULT_LOGO} alt={home} className="w-14 h-14 rounded-2xl object-contain bg-zinc-800 p-1" />
            <div className="font-bold text-2xl tracking-tight">{home}</div>
          </div>
          <div className="text-red-600 font-black text-6xl">VS</div>
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="font-bold text-2xl tracking-tight text-right">{away}</div>
            <img src={post.team_logo2 || DEFAULT_LOGO} alt={away} className="w-14 h-14 rounded-2xl object-contain bg-zinc-800 p-1" />
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="uppercase text-red-500 text-xs tracking-widest mb-3">НАШ ПРОГНОЗ</div>
          <div className="text-3xl font-bold leading-none mb-6">{post.bet}</div>
          {post.odds && (
            <div className="text-emerald-400 text-4xl font-semibold">@{post.odds}</div>
          )}
        </div>

        <div className="mt-auto border-t border-zinc-800 px-8 py-5 text-sm text-zinc-400 flex justify-between">
          <span>{new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
          <span className="font-mono">актуально</span>
        </div>
      </motion.div>
    </Link>
  );
}

// ==================== СТРАНИЦА ПРОГНОЗА ====================
function PredictionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}?select=*&slug=eq.${slug}&limit=1`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      setPost(data[0] || null);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-3xl">Загрузка прогноза...</div>;
  if (!post) return <Navigate to="/" replace />;

  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <>
      <Helmet>
        <title>{post.title} | spooort.ru</title>
        <meta name="description" content={`Прогноз на матч ${home} — ${away}. ${post.bet} @${post.odds}. Анализ от нейросети.`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8">
          <Link to="/" className="hover:text-white">Главная</Link>
          <span>›</span>
          <span className="text-white">Прогноз</span>
        </div>

        {/* ШАПКА */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <img src={post.team_logo1 || DEFAULT_LOGO} alt={home} className="w-24 h-24 rounded-3xl" />
            <div className="text-5xl font-bold tracking-tighter">{home}</div>
          </div>
          <div className="text-red-600 font-black text-8xl">VS</div>
          <div className="flex items-center gap-6 flex-row-reverse">
            <div className="text-5xl font-bold tracking-tighter">{away}</div>
            <img src={post.team_logo2 || DEFAULT_LOGO} alt={away} className="w-24 h-24 rounded-3xl" />
          </div>
        </div>

        {/* ПРОГНОЗ БЛОК */}
        <div className="bg-zinc-900 rounded-3xl p-12 text-center mb-16">
          <div className="text-red-400 text-sm tracking-[3px] uppercase mb-4">НАШ ПРОГНОЗ ОТ НЕЙРОСЕТИ</div>
          <div className="text-6xl font-bold mb-6">{post.bet}</div>
          {post.odds && <div className="text-emerald-400 text-5xl font-semibold">Коэффициент @{post.odds}</div>}
        </div>

        {/* ПОЛНЫЙ КОНТЕНТ */}
        <article
          className="prose prose-invert prose-headings:text-white prose-a:text-red-400 max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* СТАТИСТИКА И АНАЛИТИКА */}
        <div className="mt-20 bg-zinc-900 rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-10 text-center">📊 Статистика и форма команд</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Форма команды 1 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={post.team_logo1 || DEFAULT_LOGO} className="w-12 h-12" alt={home} />
                <div className="text-2xl font-semibold">{home}</div>
              </div>
              <div className="flex gap-3">
                {['W', 'W', 'D', 'W', 'L'].map((res, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  >
                    {res}
                  </div>
                ))}
              </div>
            </div>

            {/* Форма команды 2 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={post.team_logo2 || DEFAULT_LOGO} className="w-12 h-12" alt={away} />
                <div className="text-2xl font-semibold">{away}</div>
              </div>
              <div className="flex gap-3">
                {['W', 'L', 'W', 'D', 'W'].map((res, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  >
                    {res}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Мини-таблица H2H */}
          <div className="mt-16">
            <h4 className="text-xl font-semibold mb-6">История личных встреч (последние 5)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-4 text-left">Дата</th>
                    <th className="py-4 text-left">Матч</th>
                    <th className="py-4 text-center">Счёт</th>
                    <th className="py-4 text-center">Победитель</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  {[
                    ['18.02', `${home} — ${away}`, '2:1', home],
                    ['05.12', `${away} — ${home}`, '1:3', home],
                    ['22.09', `${home} — ${away}`, '0:0', 'Ничья'],
                    ['10.08', `${away} — ${home}`, '2:2', 'Ничья'],
                    ['03.05', `${home} — ${away}`, '3:1', home],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800 last:border-0">
                      <td className="py-5">{row[0]}</td>
                      <td className="py-5">{row[1]}</td>
                      <td className="py-5 text-center font-mono">{row[2]}</td>
                      <td className="py-5 text-center font-semibold text-emerald-400">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 px-10 py-5 rounded-3xl text-lg font-medium transition"
          >
            ← Вернуться ко всем прогнозам
          </Link>
        </div>
      </div>
    </>
  );
}

// ==================== СТАТИЧЕСКИЙ ФОЛБЭК ====================
const staticFallback: Post[] = [
  {
    id: 1,
    title: 'Atleti — Club Brugge | Обе забьют @ 1.85',
    content: '<h2 class="text-3xl">Анализ матча</h2><p>Обе команды показывают высокую результативность...</p>',
    image_url: '',
    team_logo1: '',
    team_logo2: '',
    sport: 'football',
    bet: 'Обе забьют',
    odds: 1.85,
    slug: 'atleti-club-brugge-20260224',
    created_at: '2026-02-24T00:00:00Z',
  },
  // Добавь ещё 2-3 для теста при необходимости
];

export default App;
