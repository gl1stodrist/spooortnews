// src/App.tsx
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
const SUPABASE_ANON_KEY = 'ВСТАВЬ_СВОЙ_ANON_KEY_ЗДЕСЬ'; // ←←← ИЗ SUPABASE (anon public)

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIzMCIgZmlsbD0iIzExMTgyNyIvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQyIiBmaWxsPSIjMUYyOTM3IiBzdHJva2U9IiM0QjU1NjMiIHN0cm9rZS13aWR0aD0iMTIiLz4KICA8dGV4dCB4PSI2MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjaywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VEVBTTwvdGV4dD4KPC9zdmc+';

const sportEmojis: Record<string, string> = { football: '⚽', esports: '🎮', hockey: '🏒', basketball: '🏀', tennis: '🎾' };

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
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
  const [activeFilter, setActiveFilter] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${SUPABASE_URL}?select=*&status=eq.published&order=created_at.desc&limit=50`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then(r => r.json())
      .then(data => setPosts(data.length ? data : staticFallback))
      .catch(() => setPosts(staticFallback));
  }, []);

  useEffect(() => {
    let result = [...posts];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (activeFilter !== 'all') result = result.filter(p => p.sport === activeFilter);
    setFilteredPosts(result);
  }, [posts, searchTerm, activeFilter]);

  const top3 = posts.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>spooort.ru — Прогнозы от нейросети</title>
        <meta name="description" content="Актуальные прогнозы на спорт от нейросети. Футбол, хоккей, баскетбол, CS2 и теннис." />
      </Helmet>

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-7xl font-black tracking-tighter mb-4">СВЕЖИЕ ПРОГНОЗЫ</h1>
      </header>

      {/* Поиск + фильтры */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 justify-center mb-12">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Поиск матча..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-3xl py-4 pl-14 pr-6 text-lg"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">🔍</div>
        </div>

        {['all', 'football', 'esports', 'hockey', 'basketball', 'tennis'].map(f => (
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

      {/* Лучшие 3 */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-bold text-center mb-10">⭐ Лучшие прогнозы недели</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {top3.map((p, i) => (
            <motion.div key={p.id} whileHover={{ scale: 1.04 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PredictionCard post={p} featured />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Все прогнозы */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(p => (
            <PredictionCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}

// ==================== КАРТОЧКА (точно как на твоём скрине) ====================
function PredictionCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <Link to={`/prognoz/${post.slug}`}>
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        className={`bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/70 transition-all ${featured ? 'ring-2 ring-red-500/30' : ''}`}
      >
        {/* Верхняя часть — точно как на скрине */}
        <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-red-600 rounded-full flex-shrink-0" />
            <div className="font-bold text-xl tracking-tight">{home}</div>
          </div>

          <div className="text-red-600 font-black text-5xl">VS</div>

          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="font-bold text-xl tracking-tight text-right">{away}</div>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex-shrink-0" />
          </div>
        </div>

        {/* Прогноз */}
        <div className="p-7 bg-zinc-950">
          <div className="uppercase text-red-500 text-xs tracking-[2px] font-medium">НАШ ПРОГНОЗ</div>
          <div className="text-4xl font-bold mt-3 leading-none">{post.bet}</div>
          {post.odds && <div className="text-emerald-400 text-3xl font-semibold mt-2">@{post.odds}</div>}
        </div>

        {/* Дата */}
        <div className="px-7 py-5 text-sm text-zinc-400 flex justify-between border-t border-zinc-800">
          <div>{new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} г.</div>
          <div className="font-mono">актуально</div>
        </div>
      </motion.div>
    </Link>
  );
}

// ==================== СТРАНИЦА ПРОГНОЗА ====================
function PredictionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${SUPABASE_URL}?select=*&slug=eq.${slug}&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then(r => r.json())
      .then(data => setPost(data[0] || null));
  }, [slug]);

  if (!post) return <Navigate to="/" replace />;

  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <>
      <Helmet>
        <title>{post.title} | spooort.ru</title>
        <meta name="description" content={`Прогноз: ${post.bet} @${post.odds}. ${home} — ${away}`} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-10">
          <Link to="/" className="hover:text-white">Главная</Link> › Прогноз
        </div>

        {/* Большая шапка */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
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

        {/* Прогноз блок */}
        <div className="bg-zinc-900 rounded-3xl p-12 text-center mb-16">
          <div className="uppercase text-red-500 tracking-[3px] text-sm mb-4">НАШ ПРОГНОЗ</div>
          <div className="text-6xl font-bold mb-6">{post.bet}</div>
          {post.odds && <div className="text-emerald-400 text-5xl font-semibold">@{post.odds}</div>}
        </div>

        {/* Полный контент из Supabase */}
        <article
          className="prose prose-invert prose-headings:text-white max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-20 text-center">
          <Link to="/" className="inline-block bg-zinc-800 hover:bg-zinc-700 px-12 py-6 rounded-3xl text-xl font-medium transition">
            ← Все прогнозы
          </Link>
        </div>
      </div>
    </>
  );
}

// Фолбэк на случай пустого Supabase
const staticFallback: Post[] = [
  {
    id: 1,
    title: 'Atleti — Club Brugge | Обе забьют @ 1.85',
    content: '<h2>Анализ матча</h2><p>Обе команды в отличной форме...</p>',
    image_url: '',
    team_logo1: '',
    team_logo2: '',
    sport: 'football',
    bet: 'Обе забьют',
    odds: 1.85,
    slug: 'atleti-club-brugge-20260224',
    created_at: '2026-02-24T00:00:00Z',
  },
];

export default App;
