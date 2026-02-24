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
  created_at: string;
}

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_ANON_KEY = 'ТВОЙ_КЛЮЧ_ОСТАВЛЯЮ_КАК_ЕСТЬ';

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

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(p => (
            <PredictionCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}

/* PredictionCard и PredictionDetail оставлены без изменений */

export default App;
