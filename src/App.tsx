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

/* ================== STICKY CTA ================== */

function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black border-t border-red-600/30 p-4">
      <a
        href={WINLINE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl text-center text-lg transition active:scale-95"
      >
        СДЕЛАТЬ СТАВКУ →
      </a>
    </div>
  )
}

/* ================== ГЛАВНАЯ ================== */

function Home() {
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
        .limit(30)

      setPosts(data || [])
      setFilteredPosts(data || [])
      setLoading(false)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedSport === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(
        posts.filter(p => p.sport === selectedSport)
      )
    }
  }, [selectedSport, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
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
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
              selectedSport === item.value
                ? 'bg-red-600 text-white'
                : 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="text-center text-5xl font-black tracking-wider mb-14">
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
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 rounded-3xl overflow-hidden transition">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
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

/* ================== СТРАНИЦА ПРОГНОЗА ================== */

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

  const team1 = post.title.split('—')[0]
  const team2 = post.title.split('—')[1]

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-28 px-4">

      {/* Карточка матча */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card className="bg-[#111] border border-gray-800 rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <img
                src={post.team_logo1 || DEFAULT_LOGO}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h2 className="text-xl font-bold">{team1}</h2>
            </div>

            <div className="text-4xl font-black text-red-500">
              VS
            </div>

            <div className="text-center flex-1">
              <img
                src={post.team_logo2 || DEFAULT_LOGO}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h2 className="text-xl font-bold">{team2}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Контент */}
      <div
        className="prose prose-invert max-w-3xl mx-auto prose-p:text-gray-300 prose-headings:text-white"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* CTA */}
      <div className="text-center mt-14">
        <a
          href={WINLINE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-red-600 hover:bg-red-500 px-10 py-5 rounded-2xl font-bold text-lg transition active:scale-95"
        >
          СДЕЛАТЬ СТАВКУ →
        </a>
      </div>

      <StickyCTA />
    </div>
  )
}

/* ================== APP ================== */

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prognoz/:id" element={<PrognozPage />} />
    </Routes>
  )
}

export default App
