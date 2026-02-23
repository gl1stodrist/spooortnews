import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useParams } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

const WINLINE_LINK =
  import.meta.env.VITE_WINLINE_LINK ||
  'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

const DEFAULT_LOGO =
  'https://via.placeholder.com/120?text=Team'

/* ================= FORMAT DATE ================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/* ================= RATING ================= */

function Rating({ value = 4 }: { value?: number }) {
  return (
    <div className="flex gap-1 justify-center mt-4">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={18}
          className={i <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
        />
      ))}
    </div>
  )
}

/* ================= STICKY (ONLY HOME) ================= */

function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/95 border-t border-red-600/30 p-4 z-50">
      <a
        href={WINLINE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl text-center text-lg transition"
      >
        СДЕЛАТЬ СТАВКУ →
      </a>
    </div>
  )
}

/* ================= HOME ================= */

function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [sport, setSport] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setPosts(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let result = posts

    if (sport !== 'all') {
      result = result.filter(p => p.sport === sport)
    }

    if (search.trim() !== '') {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(result)
  }, [sport, search, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">

      <Helmet>
        <title>Бесплатные прогнозы на спорт | Spooort</title>
        <meta name="description" content="Лучшие бесплатные прогнозы на футбол, хоккей, киберспорт и баскетбол." />
      </Helmet>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto mb-8 px-4">
        <div className="flex items-center bg-[#1a1a1a] rounded-2xl px-4 py-3">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Поиск прогнозов..."
            className="bg-transparent outline-none w-full text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-center text-5xl font-black mb-12 tracking-wider">
        СВЕЖИЕ ПРОГНОЗЫ
      </h2>

      {loading ? (
        <div className="text-center py-20">Загрузка...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          {filtered.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -6 }}>
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-gray-400 mb-3">
                      {formatDate(post.created_at)}
                    </p>
                    <h3 className="font-bold text-lg mb-4">
                      {post.title}
                    </h3>
                    <Rating value={post.rating || 4} />
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

/* ================= DETAIL ================= */

function PrognozPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      setPost(data)
    }
    load()
  }, [id])

  if (!post) return <div className="text-center py-40">Загрузка...</div>

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: post.title,
    startDate: post.created_at,
    description: post.content.replace(/<[^>]*>?/gm, '').slice(0, 200),
    eventStatus: "https://schema.org/EventScheduled"
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-20 pb-24 px-6">

      <Helmet>
        <title>{post.title} | Spooort</title>
        <meta name="description" content={post.content.slice(0, 150)} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* BREADCRUMBS */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-white">Главная</Link> → {post.title}
      </div>

      <h1 className="text-4xl font-black text-center mb-4">
        {post.title}
      </h1>

      <p className="text-center text-gray-400 mb-6">
        {formatDate(post.created_at)}
      </p>

      <Rating value={post.rating || 4} />

      <div
        className="prose prose-invert max-w-4xl mx-auto mt-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* LIVE ODDS BLOCK */}
      {post.odds && (
        <div className="max-w-2xl mx-auto mt-12 bg-[#121212] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4 text-center">
            Лучшие коэффициенты
          </h3>
          {post.odds.map((odd: any, index: number) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-700">
              <span>{odd.bookmaker}</span>
              <span className="text-green-400 font-bold">{odd.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <a
          href={WINLINE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-500 px-10 py-4 rounded-2xl font-bold text-lg"
        >
          СДЕЛАТЬ СТАВКУ →
        </a>
      </div>

    </div>
  )
}

/* ================= APP ================= */

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prognoz/:id" element={<PrognozPage />} />
    </Routes>
  )
}

export default App
