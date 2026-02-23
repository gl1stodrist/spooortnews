import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useParams } from 'react-router-dom'

const WINLINE_LINK =
  import.meta.env.VITE_WINLINE_LINK ||
  'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

const DEFAULT_LOGO =
  'https://via.placeholder.com/120?text=Team'

// ================= STICKY CTA =================

function StickyCTA() {
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

// ================= ГЛАВНАЯ =================

function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [search, setSearch] = useState('')
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
      result = result.filter(post => post.sport === selectedSport)
    }

    if (search) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredPosts(result)
  }, [selectedSport, search, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">

      {/* ПОИСК */}
      <div className="max-w-xl mx-auto px-4 mb-8">
        <input
          type="text"
          placeholder="Поиск прогноза..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-gray-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-red-600"
        />
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="flex justify-center gap-3 pb-8 overflow-x-auto px-4">
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
        <div className="text-center py-20 text-xl text-gray-400">
          Загрузка...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -8 }}>
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 rounded-3xl overflow-hidden transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center flex-1">
                        <img
                          src={post.team_logo1 || DEFAULT_LOGO}
                          className="w-20 h-20 mx-auto rounded-full"
                          alt=""
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
                          alt=""
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

// ================= СТРАНИЦА ПРОГНОЗА =================

function PrognozPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      setPost(data)
      setLoading(false)

      if (data?.title) {
        document.title = `${data.title} | Spooort`
      }
    }

    fetchPost()
  }, [id])

  if (loading)
    return <div className="text-center py-40">Загрузка...</div>

  if (!post)
    return (
      <div className="text-center py-40 text-red-500">
        Прогноз не найден
      </div>
    )

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-24 px-6">

      <div className="max-w-4xl mx-auto">

        {/* ЗАГОЛОВОК */}
        <div className="bg-[#121212] p-8 rounded-3xl border border-gray-800 mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            {post.title}
          </h1>

          <p className="text-gray-400 text-sm">
            Опубликовано {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* КОНТЕНТ */}
        <div
          className="prose prose-invert max-w-none bg-[#121212] p-8 rounded-3xl border border-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href={WINLINE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-500 px-10 py-4 rounded-2xl font-bold text-lg transition-all"
          >
            СДЕЛАТЬ СТАВКУ →
          </a>
        </div>
      </div>

      <StickyCTA />
    </div>
  )
}

// ================= ROUTES =================

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prognoz/:id" element={<PrognozPage />} />
    </Routes>
  )
}

export default App
