// src/App.tsx
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

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_KEY = 'sb_secret_vstmO-vB_bTrTSeIM4z7aA_Yz9Oo4lz'; // service_role (для чтения публично)

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // ==================== ЗАГРУЗКА ИЗ SUPABASE ====================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}?select=*&status=eq.published&order=created_at.desc&limit=30`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        const data: Post[] = await res.json();
        setPosts(data.length ? data : staticFallback);
      } catch (e) {
        console.error('Supabase fetch error → using fallback', e);
        setPosts(staticFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ==================== ФИЛЬТРАЦИЯ ====================
  useEffect(() => {
    let result = [...posts];

    // поиск
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p) =>
        (p.title + (p.bet || '')).toLowerCase().includes(q)
      );
    }

    // фильтр по спорту
    if (activeFilter !== 'all') {
      result = result.filter((p) => p.sport === activeFilter);
    }

    setFilteredPosts(result);
  }, [posts, searchTerm, activeFilter]);

  // ==================== ПАРСИНГ ДАННЫХ ДЛЯ КАРТОЧКИ ====================
  const parseMatch = (post: Post) => {
    const mainPart = post.title.split(' | ')[0];
    const [home = 'Команда 1', away = 'Команда 2'] = mainPart.includes(' — ')
      ? mainPart.split(' — ')
      : [mainPart, ''];
    const date = new Date(post.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return { home, away, date: `${date} г.` };
  };

  // ==================== СТАТИЧЕСКИЙ ФОЛБЭК (если Supabase пустой) ====================
  const staticFallback: Post[] = [
    {
      id: 1,
      title: 'Atleti — Club Brugge | Обе забьют @ 1.85',
      content: '<h1 style="...">Полный лонгрид...</h1>', // реальный контент будет из Supabase
      image_url: '',
      team_logo1: '',
      team_logo2: '',
      sport: 'football',
      bet: 'Обе забьют',
      odds: 1.85,
      created_at: '2026-02-24T00:00:00Z',
    },
    // ... остальные из предыдущего примера (можно добавить)
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500 text-2xl">Загрузка прогнозов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* HEADER — УБРАЛИ ВСЁ СПРАВА (колокольчик, профиль, "Войти") */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center">
          {/* ЛОГОТИП — красная S */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black rounded-2xl flex items-center justify-center border-2 border-red-500 shadow-xl">
              <span className="text-4xl font-black text-red-500 tracking-[-4px]">S</span>
            </div>
            <div className="leading-none">
              <div className="text-3xl font-black tracking-tighter">spooort</div>
              <div className="text-[10px] text-zinc-500 -mt-1">.ru</div>
            </div>
          </div>

          {/* ПОИСК с маленькой лупой */}
          <div className="flex-1 max-w-2xl mx-10 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* ФИЛЬТРЫ */}
        <div className="max-w-7xl mx-auto px-6 pb-6 flex gap-3 flex-wrap">
          {[
            { key: 'all', label: 'Все' },
            { key: 'football', label: '⚽ Футбол' },
            { key: 'esports', label: '🎮 Киберспорт' },
            { key: 'hockey', label: '🏒 Хоккей' },
            { key: 'basketball', label: '🏀 Баскетбол' },
            { key: 'tennis', label: '🎾 Теннис' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-7 py-2.5 rounded-3xl text-sm font-medium transition ${
                activeFilter === f.key
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <h1 className="text-center text-6xl font-black tracking-tighter mb-16">СВЕЖИЕ ПРОГНОЗЫ</h1>

        {/* СЕТКА КАРТОЧЕК */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const { home, away, date } = parseMatch(post);
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/70 cursor-pointer transition-all hover:-translate-y-1"
              >
                {/* ВЕРХНЯЯ ЧАСТЬ — как на втором скрине */}
                <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    {post.team_logo1 ? (
                      <img src={post.team_logo1} alt={home} className="w-9 h-9 rounded-full object-contain" />
                    ) : (
                      <div className="w-9 h-9 bg-red-600 rounded-full" />
                    )}
                    <div className="font-bold text-xl tracking-tight">{home}</div>
                  </div>

                  <div className="text-red-600 font-black text-5xl -mt-2">VS</div>

                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="font-bold text-xl tracking-tight text-right">{away}</div>
                    {post.team_logo2 ? (
                      <img src={post.team_logo2} alt={away} className="w-9 h-9 rounded-full object-contain" />
                    ) : (
                      <div className="w-9 h-9 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </div>

                {/* ПРОГНОЗ */}
                <div className="p-7 bg-zinc-950">
                  <div className="uppercase text-red-500 text-xs tracking-[2px] font-medium">НАШ ПРОГНОЗ</div>
                  <div className="text-4xl font-bold mt-3 leading-none">
                    {post.bet || 'Победа 1'}
                  </div>
                  {post.odds && (
                    <div className="text-emerald-400 text-3xl font-semibold mt-2">@{post.odds}</div>
                  )}
                </div>

                {/* ДАТА */}
                <div className="px-7 py-5 text-sm text-zinc-400 flex justify-between border-t border-zinc-800">
                  <div>{date}</div>
                  <div className="font-mono">актуально</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* О НАС — оставил как было (в стиле Lovable) */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block bg-zinc-900 text-red-400 text-sm px-8 py-2 rounded-3xl mb-4 border border-red-500/20">О НАС</div>
            <h2 className="text-5xl font-black tracking-tighter mb-4">spooort.ru — прогнозы от нейросети</h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
              Современный спортивный портал с прогнозами от нейросети. Мы анализируем футбольные, хоккейные, баскетбольные и киберспортивные матчи, чтобы дать пользователям актуальные и точные прогнозы. Всё просто, удобно и доступно каждому.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🤖', title: 'Нейросеть', desc: 'Прогнозы генерируются мощной ИИ-моделью, которая анализирует тысячи статистических показателей в реальном времени.' },
              { icon: '⚡', title: 'Скорость', desc: 'Обновление каждые 4 часа. Только самые актуальные матчи с реальными коэффициентами.' },
              { icon: '🏆', title: 'Все виды спорта', desc: 'Футбол, хоккей, баскетбол, теннис, CS2 и другие дисциплины — всё в одном месте.' },
              { icon: '💰', title: 'Бесплатно и удобно', desc: 'Никакой регистрации. Просто, красиво, доступно каждому. Revshare 20% для партнёров.' },
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-red-500/40 transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{card.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        © 2026 spooort.ru • Все прогнозы — для развлечения • Revshare 20% навсегда
      </footer>

      {/* ==================== МОДАЛЬНОЕ ОКНО ДЕТАЛЬНОГО ПРОСМОТРА ==================== */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-zinc-900 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-red-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ШАПКА МОДАЛКИ — точно как на втором скрине */}
            {(() => {
              const { home, away } = parseMatch(selectedPost);
              return (
                <div className="px-10 py-8 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {selectedPost.team_logo1 && (
                        <img src={selectedPost.team_logo1} alt={home} className="w-16 h-16 rounded-full" />
                      )}
                      <div className="text-4xl font-bold">{home}</div>
                    </div>

                    <div className="text-red-600 font-black text-7xl">VS</div>

                    <div className="flex items-center gap-6 flex-row-reverse">
                      <div className="text-4xl font-bold">{away}</div>
                      {selectedPost.team_logo2 && (
                        <img src={selectedPost.team_logo2} alt={away} className="w-16 h-16 rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="mt-10 bg-zinc-950 rounded-3xl p-10 text-center">
                    <div className="uppercase tracking-[3px] text-red-500 text-sm font-medium">НАШ ПРОГНОЗ</div>
                    <div className="text-6xl font-bold mt-4">{selectedPost.bet}</div>
                    {selectedPost.odds && (
                      <div className="text-emerald-400 text-5xl font-semibold mt-3">@{selectedPost.odds}</div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ПОЛНЫЙ ЛОНГРИД ИЗ SUPABASE */}
            <div className="p-10 overflow-auto max-h-[calc(92vh-280px)] prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            {/* КНОПКА ЗАКРЫТИЯ */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 bg-zinc-800 hover:bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
