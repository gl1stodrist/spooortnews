import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useParams } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const DEFAULT_LOGO = '/assets/default-team.png' // локальный placeholder для команд

// ==================== ФОРМАТ ДАТЫ ====================
function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// ==================== КАРТОЧКА ПРОГНОЗА ====================
function PredictionCard({ post }: { post: any }) {
  const slug = post.slug || `prognoz-${post.id}`
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/prognoz/${slug}`}>
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <img
                src={post.team_logo1 || DEFAULT_LOGO}
                className="w-20 h-20 mx-auto rounded-full"
                alt={`${post.title?.split('—')[0]} логотип`}
              />
              <p className="mt-3 text-sm text-white font-semibold">
                {post.title?.split('—')[0]}
              </p>
            </div>

            <div className="text-red-500 font-black text-3xl">VS</div>

            <div className="text-center flex-1">
              <img
                src={post.team_logo2 || DEFAULT_LOGO}
                className="w-20 h-20 mx-auto rounded-full"
                alt={`${post.title?.split('—')[1]} логотип`}
              />
              <p className="mt-3 text-sm text-white font-semibold">
                {post.title?.split('—')[1]}
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-sm">
            {formatDate(post.created_at)}
          </div>
        </CardContent>
      </Link>
    </motion.div>
  )
}

// ==================== ГЛАВНАЯ ====================
function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data) {
        setPosts(data)
        setFilteredPosts(data)
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
    if (searchTerm.trim() !== '') {
      result = result.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredPosts(result)
  }, [selectedSport, searchTerm, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-24">
      <Helmet>
        <title>Прогнозы на спорт от нейросети — spooort.ru</title>
        <meta
          name="description"
          content="Свежие прогнозы на спорт от нейросети. Анализ футбола, хоккея, баскетбола и киберспорта."
        />
        <meta
          name="keywords"
          content="прогнозы, спорт, ставки, нейросеть, футбол, хоккей, баскетбол, киберспорт"
        />
      </Helmet>

      {/* ПОИСК */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <input
          type="text"
          placeholder="Поиск прогноза..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600"
        />
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="flex justify-center gap-3 pb-8 overflow-x-auto px-4">
        {[
          { value: 'all', label: 'Все' },
          { value: 'soccer', label: '⚽ Футбол' },
          { value: 'cs2', label: '🎮 Киберспорт' },
          { value: 'hockey', label: '🏒 Хоккей' },
          { value: 'basketball', label: '🏀 Баскетбол' },
        ].map(item => (
          <button
            key={item.value}
            onClick={() => setSelectedSport(item.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedSport === item.value
                ? 'bg-red-600 text-white'
                : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h1 className="text-center text-4xl font-black mb-12">СВЕЖИЕ ПРОГНОЗЫ</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {filteredPosts.map(post => (
            <PredictionCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== СТРАНИЦА ПРОГНОЗА ====================
function PrognozPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()
      if (data) setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) return <div className="text-center py-40">Загрузка...</div>
  if (!post)
    return (
      <div className="text-center py-40 text-red-500">Прогноз не найден</div>
    )

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-24 px-6">
      <Helmet>
        <title>{post.title} — spooort.ru</title>
        <meta name="description" content={`Прогноз на матч ${post.title}.`} />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="text-sm text-gray-500 mb-4">Главная → {post.title}</div>
        <h1 className="text-4xl font-black mb-6">{post.title}</h1>
        <div className="text-gray-400 mb-8">{formatDate(post.created_at)}</div>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}

// ==================== APP ====================
function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prognoz/:slug" element={<PrognozPage />} />
        <Route path="*" element={<Home />} /> {/* перехват всех остальных URL */}
      </Routes>
    </HelmetProvider>
  )
}

export default App
