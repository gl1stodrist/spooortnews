import React, { useState, useEffect } from 'react';

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

// ==================== ←←← ВСТАВЬ СВОЙ ANON KEY СЮДА ←←← ====================
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXRxdm1la2F2c2FxdW9zc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Nzc5NTIsImV4cCI6MjA4NjE1Mzk1Mn0.8Tl64Uo5iBOTdAnJzf3RSUZRnc8D1NHnc8QDYdKTP14"; // ←←← ТВОЙ ANON КЛЮЧ ИЗ SUPABAS

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}?select=*&status=eq.published&order=created_at.desc&limit=30`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Post[] = await res.json();
        setPosts(data.length ? data : staticFallback);
      } catch (e) {
        console.error('Supabase fetch error → fallback', e);
        setPosts(staticFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.title + (p.bet || '')).toLowerCase().includes(q)
      );
    }
    if (activeFilter !== 'all') {
      result = result.filter(p => p.sport === activeFilter);
    }
    setFilteredPosts(result);
  }, [posts, searchTerm, activeFilter]);

  const parseMatch = (post: Post) => {
    const main = post.title.split(' | ')[0];
    const [home = 'Команда 1', away = 'Команда 2'] = main.includes(' — ') 
      ? main.split(' — ') 
      : [main, ''];
    const date = new Date(post.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    return { home, away, date: `${date} г.` };
  };

  const staticFallback: Post[] = [
    {
      id: 1,
      title: 'Atleti — Club Brugge | Обе забьют @ 1.85',
      content: '<p>Полный лонгрид из Supabase...</p>',
      image_url: '',
      team_logo1: '',
      team_logo2: '',
      sport: 'football',
      bet: 'Обе забьют',
      odds: 1.85,
      created_at: '2026-02-24T00:00:00Z',
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500 text-2xl">Загрузка прогнозов...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* HEADER — точно как на твоём скрине */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* ЛОГОТИП — красный круг с белой S */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white text-4xl font-black tracking-[-4px]">S</span>
            </div>
            <div className="leading-none">
              <div className="text-3xl font-black tracking-tighter">spooort</div>
              <div className="text-[10px] text-zinc-500 -mt-1">.ru</div>
            </div>
          </div>

          {/* Поиск */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Поиск прогноза..."
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 rounded-3xl py-3.5 pl-14 pr-6 text-base placeholder:text-zinc-500 focus:outline-none"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Фильтры — точно как на скрине */}
        <div className="max-w-7xl mx-auto px-6 pb-6 flex gap-3 flex-wrap">
          {[
            { key: 'all', label: 'Все', emoji: '' },
            { key: 'football', label: 'Футбол', emoji: '⚽' },
            { key: 'esports', label: 'Киберспорт', emoji: '🎮' },
            { key: 'hockey', label: 'Хоккей', emoji: '🏒' },
            { key: 'basketball', label: 'Баскетбол', emoji: '🏀' },
            { key: 'tennis', label: 'Теннис', emoji: '🎾' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-6 py-2.5 rounded-3xl text-sm font-medium flex items-center gap-2 transition ${
                activeFilter === f.key 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <h1 className="text-center text-6xl font-black tracking-tighter mb-16">СВЕЖИЕ ПРОГНОЗЫ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => {
            const { home, away, date } = parseMatch(post);
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/70 cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    {post.team_logo1 ? <img src={post.team_logo1} className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 bg-red-600 rounded-full" />}
                    <div className="font-bold text-xl">{home}</div>
                  </div>
                  <div className="text-red-600 font-black text-5xl">VS</div>
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="font-bold text-xl text-right">{away}</div>
                    {post.team_logo2 ? <img src={post.team_logo2} className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 bg-blue-600 rounded-full" />}
                  </div>
                </div>

                <div className="p-7 bg-zinc-950">
                  <div className="uppercase text-red-500 text-xs tracking-[2px]">НАШ ПРОГНОЗ</div>
                  <div className="text-4xl font-bold mt-3">{post.bet}</div>
                  {post.odds && <div className="text-emerald-400 text-3xl font-semibold mt-2">@{post.odds}</div>}
                </div>

                <div className="px-7 py-5 text-sm text-zinc-400 flex justify-between border-t border-zinc-800">
                  <div>{date}</div>
                  <div className="font-mono">актуально</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* О НАС */}
        <div className="mt-32 text-center">
          <div className="inline-block bg-zinc-900 px-8 py-2 rounded-3xl text-red-400 text-sm border border-red-500/20 mb-6">О НАС</div>
          <h2 className="text-5xl font-black tracking-tighter mb-4">SPOOORT.RU — ПРОГНОЗЫ ОТ НЕЙРОСЕТИ</h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
            Современный спортивный портал с прогнозами от нейросети. Мы анализируем футбольные, хоккейные, баскетбольные и киберспортивные матчи, чтобы дать пользователям актуальные и точные прогнозы. Всё просто, удобно и доступно каждому.
          </p>
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЬНОГО ПРОСМОТРА */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Шапка модалки */}
            {(() => {
              const { home, away } = parseMatch(selectedPost);
              return (
                <div className="p-10 border-b border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      {selectedPost.team_logo1 && <img src={selectedPost.team_logo1} className="w-16 h-16 rounded-full" />}
                      <div className="text-4xl font-bold">{home}</div>
                    </div>
                    <div className="text-red-600 font-black text-7xl">VS</div>
                    <div className="flex items-center gap-6 flex-row-reverse">
                      <div className="text-4xl font-bold">{away}</div>
                      {selectedPost.team_logo2 && <img src={selectedPost.team_logo2} className="w-16 h-16 rounded-full" />}
                    </div>
                  </div>
                  <div className="mt-10 bg-zinc-950 rounded-3xl p-10 text-center">
                    <div className="uppercase text-red-500 text-sm tracking-widest">НАШ ПРОГНОЗ</div>
                    <div className="text-6xl font-bold mt-4">{selectedPost.bet}</div>
                    {selectedPost.odds && <div className="text-emerald-400 text-5xl font-semibold mt-3">@{selectedPost.odds}</div>}
                  </div>
                </div>
              );
            })()}

            <div className="p-10 overflow-auto max-h-[65vh] prose prose-invert" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 bg-zinc-800 hover:bg-red-600 w-14 h-14 rounded-2xl text-4xl">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
