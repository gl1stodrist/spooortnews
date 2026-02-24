// src/App.tsx
import { PredictionDetail } from './components/PredictionDetail';
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
  created_at: string;
}

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXRxdm1la2F2c2FxdW9zc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Nzc5NTIsImV4cCI6MjA4NjE1Mzk1Mn0.8Tl64Uo5iBOTdAnJzf3RSUZRnc8D1NHnc8QDYdKTP14';

const DEFAULT_LOGO = 'data:image/svg+xml;base64,...';

const sportEmojis: Record<string, string> = {
  football: '⚽',
  esports: '🎮',
  hockey: '🏒',
  basketball: '🏀',
  tennis: '🎾',
};

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prognoz/:id" element={<PredictionDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center">
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
      © 2026 spooort.ru
    </footer>
  );
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}?select=*&status=eq.published&order=created_at.desc&limit=50`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const data = await res.json();
      setPosts(data.length ? data : []);
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...posts];
    if (searchTerm)
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (activeFilter !== 'all')
      result = result.filter(p => p.sport === activeFilter);
    setFilteredPosts(result);
  }, [posts, searchTerm, activeFilter]);

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-3xl text-red-500">
        Загрузка прогнозов...
      </div>
    );

  return (
    <>
      <Helmet>
        <title>spooort.ru — Прогнозы от нейросети</title>
      </Helmet>

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-7xl font-black tracking-tighter">
          СВЕЖИЕ ПРОГНОЗЫ
        </h1>
      </header>

      {/* ПОИСК */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 justify-center mb-12">
        <div className="relative w-full max-w-md">
          <label htmlFor="search" className="sr-only">
            Поиск матча
          </label>

          <input
            type="text"
            id="search"
            name="search"
            placeholder="Поиск матча..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoComplete="off"
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-3xl py-4 pl-14 pr-6 text-lg"
          />

          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400">
            🔍
          </div>
        </div>

        {['all', 'football', 'esports', 'hockey', 'basketball', 'tennis'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-3 rounded-3xl text-sm font-medium transition ${
              activeFilter === f
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {f === 'all' ? 'Все' : sportEmojis[f]}{' '}
            {f === 'all' ? '' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* СПИСОК */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(p => (
            <PredictionCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {/* О НАС */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-800">
        <div className="text-center mb-16">
          <div className="inline-block bg-zinc-900 text-red-400 text-sm px-8 py-2 rounded-3xl mb-4 border border-red-500/20">
            О НАС
          </div>
          <h2 className="text-5xl font-black tracking-tighter">
            spooort.ru — прогнозы от нейросети
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: '🤖', title: 'Нейросеть', desc: 'Прогнозы генерируются мощной ИИ-моделью' },
            { icon: '⚡', title: 'Скорость', desc: 'Обновление каждые 4 часа' },
            { icon: '🏆', title: 'Все виды спорта', desc: 'Футбол • Хоккей • Баскетбол • Теннис • CS2' },
            { icon: '💰', title: 'Бесплатно', desc: 'Никакой регистрации. Revshare 20%' },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-red-500/40 transition-all"
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

export default App;
