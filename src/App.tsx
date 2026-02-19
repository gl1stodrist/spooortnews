import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'

// ==================== STICKY CTA ====================
function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-black via-black/95 to-transparent py-4 px-4 border-t border-red-600/30">
      <a
        href={WINLINE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl text-center text-lg transition-all active:scale-95"
      >
        СДЕЛАТЬ СТАВКУ В WINLINE →
      </a>
    </div>
  )
}

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
function Home({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (v: string) => void }) {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) console.error(error)
      else {
        setPosts(data || [])
        setFilteredPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    let result = posts

    if (selectedSport !== 'all') {
      result = result.filter(post => post.sport === selectedSport)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(post => post.title.toLowerCase().includes(q))
    }

    setFilteredPosts(result)
  }, [selectedSport, searchQuery, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
      {/* Фильтры */}
      <div className="flex justify-center gap-3 pt-6 pb-8 overflow-x-auto px-4">
        {[
          { value: 'all', label: 'Все' },
          { value: 'soccer', label: '⚽ Футбол' },
          { value: 'cs2', label: '🎮 Киберспорт' },
          { value: 'hockey', label: '🏒 Хоккей' },
          { value: 'basketball', label: '🏀 Баскетбол' }
        ].map(item => (
          <button
            key={item.value}
            onClick={() => setSelectedSport(item.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedSport === item.value
                ? 'bg-red-600 text-white'
                : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="text-center text-4xl md:text-5xl font-black tracking-wider mb-12">
        СВЕЖИЕ ПРОГНОЗЫ
      </h2>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-400">Загрузка...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-32 text-xl text-gray-500">
          Пока нет прогнозов<br />Бот скоро добавит новые
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -10, scale: 1.02 }} className="group">
                <Card className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800 hover:border-red-600 transition-all duration-300 rounded-3xl overflow-hidden h-full shadow-xl group-hover:shadow-2xl group-hover:shadow-red-900/20">
                  <div className="px-5 pt-5 pb-3 text-xs text-gray-400 border-b border-gray-800">
                    {post.title.split('|')[0] || 'Топ-матч'}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-center flex-1">
                        <img src={post.team_logo1 || DEFAULT_LOGO} className="w-24 h-24 mx-auto rounded-full transition-transform duration-300 group-hover:scale-110" alt="" />
                        <p className="mt-4 font-semibold text-base leading-tight line-clamp-2">
                          {post.title.split('—')[0]?.trim()}
                        </p>
                      </div>

                      <div className="text-center px-6">
                        <div className="text-red-500 font-black text-[46px] leading-none tracking-tighter mb-1 drop-shadow-md">
                          VS
                        </div>
                        <div className="text-[10px] text-red-400/80 font-medium">ПРОГНОЗ</div>
                      </div>

                      <div className="text-center flex-1">
                        <img src={post.team_logo2 || DEFAULT_LOGO} className="w-24 h-24 mx-auto rounded-full transition-transform duration-300 group-hover:scale-110" alt="" />
                        <p className="mt-4 font-semibold text-base leading-tight line-clamp-2">
                          {post.title.split('—')[1]?.trim()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1a1a1a] text-center py-3.5 rounded-2xl text-sm font-medium text-gray-300 border border-gray-700">
                      {new Date(post.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })},&nbsp;
                      {new Date(post.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} МСК
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      <StickyCTA />
    </div>
  )
}

// ==================== ДЕТАЛЬНАЯ СТРАНИЦА ====================
function PrognozPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  const teams = post.title.split('—').map((t: string) => t.trim())

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center text-sm text-gray-500 mb-3">
          {post.title.split('|')[0] || 'Топ-матч'}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-center mb-10">
          {post.title}
        </h1>

        <div className="flex justify-center items-center gap-16 mb-12">
          <div className="text-center">
            <img src={post.team_logo1 || DEFAULT_LOGO} className="w-32 h-32 mx-auto rounded-full border-4 border-red-600 shadow-2xl" alt="" />
            <p className="mt-5 font-bold text-2xl">{teams[0]}</p>
          </div>

          <div className="text-6xl font-black text-red-500">VS</div>

          <div className="text-center">
            <img src={post.team_logo2 || DEFAULT_LOGO} className="w-32 h-32 mx-auto rounded-full border-4 border-red-600 shadow-2xl" alt="" />
            <p className="mt-5 font-bold text-2xl">{teams[1]}</p>
          </div>
        </div>

        <div className="text-center text-xl text-gray-400 mb-16">
          {new Date(post.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })} МСК
        </div>

        <div className="prose prose-invert max-w-none text-lg leading-relaxed mb-16" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Таблица коэффициентов */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Лучшие коэффициенты</h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-800">
            <table className="w-full border-collapse bg-[#121212]">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="px-6 py-4 text-left">Букмекер</th>
                  <th className="px-6 py-4 text-center">П1</th>
                  <th className="px-6 py-4 text-center">X</th>
                  <th className="px-6 py-4 text-center">П2</th>
                  <th className="px-6 py-4 text-center">ТБ 2.5</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t border-gray-800 hover:bg-zinc-900/70">
                  <td className="px-6 py-4 font-medium">Winline</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">2.15</td>
                  <td className="px-6 py-4 text-center">3.40</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">3.10</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">1.85</td>
                </tr>
                <tr className="border-t border-gray-800 hover:bg-zinc-900/70">
                  <td className="px-6 py-4 font-medium">Betsxwin</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">2.18</td>
                  <td className="px-6 py-4 text-center">3.35</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">3.05</td>
                  <td className="px-6 py-4 text-center text-green-400 font-bold">1.88</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <a
            href={WINLINE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all"
          >
            СДЕЛАТЬ СТАВКУ В WINLINE →
          </a>
        </div>
      </div>

      <StickyCTA />
    </div>
  )
}

// ==================== ЭКСПОРТ ====================
export default App
import { BrowserRouter } from 'react-router-dom'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
        />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </>
  )
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

