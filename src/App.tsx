import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Search, Flame, Eye, CalendarDays, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "./lib/supabase";

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'   // ← Добавлено
const WINLINE_LINK =
  import.meta.env.VITE_WINLINE_LINK ||
  "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

const DEFAULT_IMAGE = "/placeholder.svg";

type SportFilter = "all" | "soccer" | "cs2" | "hockey" | "basketball";

const sportOptions: { value: SportFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "soccer", label: "⚽ Футбол" },
  { value: "cs2", label: "🎮 Киберспорт" },
  { value: "hockey", label: "🏒 Хоккей" },
  { value: "basketball", label: "🏀 Баскетбол" },
];

export default function App() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-red-500">PRO-SPORTS</Link>

          {/* Поиск */}
          <div className="flex-1 max-w-xl mx-6 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск матча или команды..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 pl-11 py-3 rounded-full text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="flex gap-7 text-base">
            <Link to="/" className={location.pathname === '/' ? 'text-red-500' : 'hover:text-red-400'}>Главная</Link>
            <Link to="/football" className={location.pathname === '/football' ? 'text-red-500' : 'hover:text-red-400'}>Футбол</Link>
            <Link to="/cybersport" className={location.pathname === '/cybersport' ? 'text-red-500' : 'hover:text-red-400'}>Киберспорт</Link>
            <Link to="/hockey" className={location.pathname === '/hockey' ? 'text-red-500' : 'hover:text-red-400'}>Хоккей</Link>
            <Link to="/basketball" className={location.pathname === '/basketball' ? 'text-red-500' : 'hover:text-red-400'}>Баскетбол</Link>
          </div>
        </div>
      </nav>
    <div className="min-h-screen bg-[#07070b] text-white">
      <TopNavigation
        pathname={location.pathname}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/football" element={<div className="pt-32 text-center text-4xl text-red-400">Футбол</div>} />
        <Route path="/cybersport" element={<div className="pt-32 text-center text-4xl text-red-400">Киберспорт</div>} />
        <Route path="/hockey" element={<div className="pt-32 text-center text-4xl text-red-400">Хоккей</div>} />
        <Route path="/basketball" element={<div className="pt-32 text-center text-4xl text-red-400">Баскетбол</div>} />
        <Route
          path="/"
          element={
            <HomePage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          }
        />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
  );
}

function Home({ searchQuery, setSearchQuery }) {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [loading, setLoading] = useState(true)
function TopNavigation({
  pathname,
  searchQuery,
  onSearch,
}: {
  pathname: string;
  searchQuery: string;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="text-2xl font-black tracking-tight">
          SPOOORT<span className="text-red-500">NEWS</span>
        </Link>

        <div className="relative ml-auto hidden w-full max-w-lg md:block">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full rounded-full border border-zinc-700 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-red-500"
            placeholder="Поиск по заголовку..."
          />
        </div>

        <nav className="hidden items-center gap-4 text-sm font-semibold md:flex">
          <Link className={pathname === "/" ? "text-red-400" : "text-zinc-300"} to="/">
            Главная
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HomePage({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<SportFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) console.error('Ошибка:', error)
      else {
        setPosts(data || [])
        setFilteredPosts(data || [])
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        console.error("Ошибка загрузки:", error.message);
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    let result = posts
      setPosts(data || []);
      setLoading(false);
    };

    loadPosts();
  }, []);

    if (selectedSport !== 'all') {
      result = result.filter(post => post.sport === selectedSport)
    }
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(post => post.title.toLowerCase().includes(q))
    }
    return posts.filter((post) => {
      const sportMatch = selectedSport === "all" || post.sport === selectedSport;
      const searchMatch = query.length === 0 || post.title?.toLowerCase().includes(query);
      return sportMatch && searchMatch;
    });
  }, [posts, selectedSport, searchQuery]);

    setFilteredPosts(result)
  }, [selectedSport, searchQuery, posts])
  const highlightedPost = filteredPosts[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Фильтры */}
      <div className="flex justify-center gap-3 pt-6 pb-8 overflow-x-auto px-4">
        {[
          { value: 'all', label: 'Все' },
          { value: 'soccer', label: '⚽ Футбол' },
          { value: 'cs2', label: '🎮 Киберспорт' },
          { value: 'hockey', label: '🏒 Хоккей' },
          { value: 'basketball', label: '🏀 Баскетбол' }
        ].map(item => (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 md:px-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 md:p-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">
              <Flame className="h-4 w-4" /> Обновлённый дизайн
            </p>
            <h1 className="mb-4 text-4xl font-black uppercase leading-tight md:text-5xl">
              Быстрые новости и прогнозы в новом визуальном стиле
            </h1>
            <p className="max-w-2xl text-zinc-300">
              Контрастный тёмный интерфейс, акцентные карточки и удобная навигация по
              видам спорта — всё в одном экране.
            </p>
          </div>

          <a
            href={WINLINE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
          >
            Перейти к партнёру <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mt-8 flex flex-wrap gap-2">
        {sportOptions.map((option) => (
          <button
            key={item.value}
            onClick={() => setSelectedSport(item.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedSport === item.value
                ? 'bg-red-600 text-white'
                : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'
            key={option.value}
            onClick={() => setSelectedSport(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedSport === option.value
                ? "border-red-500 bg-red-600 text-white"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {item.label}
            {option.label}
          </button>
        ))}
      </div>

      <h2 className="text-center text-4xl md:text-5xl font-black tracking-wider mb-10">
        СВЕЖИЕ ПРОГНОЗЫ
      </h2>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-400">Загрузка...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-32 text-xl text-gray-500">
          Пока нет прогнозов<br />Бот скоро добавит новые
        <div className="relative ml-auto w-full md:hidden">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-full border border-zinc-700 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500"
            placeholder="Поиск по заголовку..."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -6 }} className="group">
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden h-full">
                  <div className="px-5 pt-4 pb-2 text-xs text-gray-500 border-b border-gray-800">
                    {post.title.split('|')[0] || 'Топ-матч'}
                  </div>
      </section>

                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center flex-1">
                        <img src={post.team_logo1 || DEFAULT_LOGO} className="w-20 h-20 mx-auto rounded-full" alt="" />
                        <p className="mt-3 font-semibold text-sm line-clamp-2">{post.title.split('—')[0]?.trim()}</p>
                      </div>

                      <div className="text-center px-4">
                        <div className="text-red-500 font-black text-4xl mb-1">VS</div>
                        <div className="text-[10px] text-gray-500">Прогноз от PRO-SPORTS</div>
                      </div>

                      <div className="text-center flex-1">
                        <img src={post.team_logo2 || DEFAULT_LOGO} className="w-20 h-20 mx-auto rounded-full" alt="" />
                        <p className="mt-3 font-semibold text-sm line-clamp-2">{post.title.split('—')[1]?.trim()}</p>
                      </div>
                    </div>

                    <div className="bg-[#1a1a1a] text-center py-3 rounded-xl text-sm font-medium text-gray-300">
                      {new Date(post.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })},&nbsp;
                      {new Date(post.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} МСК
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      {highlightedPost && (
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900/70 p-4 md:p-6">
          <Link to={`/prognoz/${highlightedPost.id}`} className="grid gap-5 md:grid-cols-[280px_1fr]">
            <img
              src={highlightedPost.image_url || DEFAULT_IMAGE}
              alt={highlightedPost.title}
              className="h-52 w-full rounded-2xl object-cover md:h-full"
            />
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-red-300">Главный материал</p>
              <h2 className="text-2xl font-black uppercase leading-tight md:text-3xl">
                {highlightedPost.title}
              </h2>
              <p className="mt-4 line-clamp-3 text-zinc-300">{highlightedPost.content}</p>
              <div className="mt-5 flex items-center gap-4 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(highlightedPost.created_at).toLocaleDateString("ru-RU")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {Math.floor(Math.random() * 2000) + 300}
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  )

      <section className="mt-8">
        <h2 className="mb-5 text-3xl font-black uppercase">Свежие материалы</h2>

        {loading ? (
          <div className="py-20 text-center text-zinc-400">Загрузка данных...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center text-zinc-400">
            Ничего не найдено. Попробуйте другой фильтр или запрос.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70"
              >
                <Link to={`/prognoz/${post.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url || DEFAULT_IMAGE}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-lg font-bold uppercase leading-tight group-hover:text-red-300">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{post.content}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Детальная страница
function PrognozPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (error) console.error(error)
      else setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) return <div className="text-center py-40">Загрузка...</div>
  if (!post) return <div className="text-center py-40 text-red-500">Прогноз не найден</div>
    const loadPost = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      setPost(data);
      setLoading(false);
    };

    loadPost();
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-zinc-400">Загрузка...</div>;
  }

  if (!post) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-zinc-400">Материал не найден.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-center mb-8">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-invert max-w-none" />
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-10 md:px-6">
      <Link to="/" className="mb-6 inline-flex text-sm text-zinc-400 hover:text-white">
        ← Назад
      </Link>
      <h1 className="text-4xl font-black uppercase leading-tight">{post.title}</h1>
      <img
        src={post.image_url || DEFAULT_IMAGE}
        alt={post.title}
        className="mt-6 h-[360px] w-full rounded-3xl object-cover"
      />
      <div className="prose prose-invert mt-8 max-w-none text-zinc-200 whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  )
    </article>
  );
}
