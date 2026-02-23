import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useParams, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'

const WINLINE_LINK =
  import.meta.env.VITE_WINLINE_LINK ||
  'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

const DEFAULT_LOGO =
  'https://via.placeholder.com/120?text=Team'

/* ================= HEADER ================= */

function Header({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-wider">
          SPOOORT
        </Link>

        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-[#1a1a1a] text-sm pl-9 pr-3 py-2 rounded-xl border border-gray-800 focus:border-red-600 outline-none"
          />
        </div>
      </div>
    </div>
  )
}

/* ================= STICKY CTA ================= */

function StickyCTA() {
  const location = useLocation()

  // ❗ показываем ТОЛЬКО на главной
  if (location.pathname !== '/') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-black via-black/95 to-transparent py-4 px-4 border-t border-red-600/30">
      <a
        href={WINLINE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl text-center text-lg transition-all active:scale-95"
      >
        СДЕЛАТЬ СТАВКУ →
      </a>
    </div>
  )
}

/* ================= ГЛАВНАЯ ================= */

function Home({
  searchQuery
}: {
  searchQuery: string
}) {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      setPosts(data || [])
      setFilteredPosts(data || [])
      setLoading(false)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    let result = posts

    if (selectedSport !== 'all') {
      result = result.filter(p => p.sport === selectedSport)
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredPosts(result)
  }, [selectedSport, searchQuery, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20">
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
            className={`px-6 py-2.5 rounded-full text-sm font-medium ${
              selectedSport === item.value
                ? 'bg-red-600'
                : 'bg-[#1f1f1f] text-gray-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="text-center text-4xl md:text-5xl font-black mb-12">
        СВЕЖИЕ ПРОГНОЗЫ
      </h2>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          Загрузка...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -6 }}>
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <img
                          src={post.team_logo1 || DEFAULT_LOGO}
                          className="w-20 h-20 mx-auto rounded-full"
                        />
                        <p className="mt-3 text-sm">
                          {post.title.split('—')[0]}
                        </p>
                      </div>

                      <div className="text-red-500 font-black text-3xl">
                        VS
                      </div>

                      <div className="text-center flex-1">
                        <img
                          src={post.team_logo2 || DEFAULT_LOGO}
                          className="w-20 h-20 mx-auto rounded-full"
                        />
                        <p className="mt-3 text-sm">
                          {post.title.split('—')[1]}
                        </p>
                      </div>
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

/* ================= ДЕТАЛЬНАЯ ================= */

function PrognozPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      setPost(data)
    }

    fetchPost()
  }, [id])

  if (!post)
    return <div className="text-center py-40">Загрузка...</div>

  const teams = post.title.split('—')

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-black text-center mb-12">
          {post.title}
        </h1>

        <div className="flex justify-center items-center gap-12 mb-12">
          <div className="text-center">
            <img
              src={post.team_logo1 || DEFAULT_LOGO}
              className="w-28 h-28 rounded-full mx-auto border-4 border-red-600"
            />
            <p className="mt-4 font-bold text-xl">
              {teams[0]}
            </p>
          </div>

          <div className="text-5xl font-black text-red-500">
            VS
          </div>

          <div className="text-center">
            <img
              src={post.team_logo2 || DEFAULT_LOGO}
              className="w-28 h-28 rounded-full mx-auto border-4 border-red-600"
            />
            <p className="mt-4 font-bold text-xl">
              {teams[1]}
            </p>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>
    </div>
  )
}

/* ================= APP ================= */

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Routes>
        <Route
          path="/"
          element={<Home searchQuery={searchQuery} />}
        />
        <Route
          path="/prognoz/:id"
          element={<PrognozPage />}
        />
      </Routes>
    </>
  )
}

export default App
