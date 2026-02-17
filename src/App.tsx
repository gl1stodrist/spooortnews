import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'

function Home() {
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
        .limit(12)

      if (error) console.error('Ошибка:', error)
      else {
        setPosts(data || [])
        setFilteredPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedSport === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.sport === selectedSport))
    }
  }, [selectedSport, posts])

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* Баннер */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 md:py-28 bg-gradient-to-b from-[#1a0000] to-transparent text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
          ПРОГНОЗЫ С ПРИБЫЛЬЮ
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300">Точные прогнозы + бонус 15 000 ₽ в Winline</p>
        <Button size="lg" className="bg-red-600 hover:bg-red-500 text-white font-bold px-12 py-7 text-xl rounded-2xl" asChild>
          <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
            ЗАБРАТЬ БОНУС 15 000 ₽ →
          </a>
        </Button>
      </motion.section>

      {/* Фильтры */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
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
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedSport === item.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-center mb-12 text-white">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-20 text-xl">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-400">Нет прогнозов</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -10 }}
              >
                <Link to={`/prognoz/${post.id}`} className="block">
                  <Card className="bg-gray-900 border border-gray-700 hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden h-full group">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-3">
                        <img src={post.team_logo1 || DEFAULT_LOGO} alt="" className="w-14 h-14 rounded-full border-2 border-white/80" />
                        <img src={post.team_logo2 || DEFAULT_LOGO} alt="" className="w-14 h-14 rounded-full border-2 border-white/80" />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="text-sm text-gray-400 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 180) + '...' }} />
                      <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold">
                        СДЕЛАТЬ СТАВКУ
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Детальная страница (оставляем как была)
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

  if (loading) return <div className="text-center py-40 text-2xl">Загрузка...</div>
  if (!post) return <div className="text-center py-40 text-2xl text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-8">{post.title}</h1>
        <div className="text-center text-gray-400 mb-10">
          {new Date(post.created_at).toLocaleString('ru-RU')} • {post.sport?.toUpperCase()}
        </div>

        <img src={post.image_url} alt="" className="w-full rounded-2xl mb-12" />

        <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-invert max-w-none" />

        <div className="text-center mt-16">
          <Button size="lg" className="bg-red-600 hover:bg-red-500 text-white px-12 py-7 text-xl" asChild>
            <a href={WINLINE_LINK} target="_blank">СДЕЛАТЬ СТАВКУ</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-red-500">PRO-SPORTS</Link>
          <div className="flex gap-8 text-lg">
            <Link to="/" className={location.pathname === '/' ? 'text-red-500' : 'hover:text-red-400'}>Главная</Link>
            <Link to="/football" className={location.pathname === '/football' ? 'text-red-500' : 'hover:text-red-400'}>Футбол</Link>
            <Link to="/cybersport" className={location.pathname === '/cybersport' ? 'text-red-500' : 'hover:text-red-400'}>Киберспорт</Link>
            <Link to="/hockey" className={location.pathname === '/hockey' ? 'text-red-500' : 'hover:text-red-400'}>Хоккей</Link>
            <Link to="/basketball" className={location.pathname === '/basketball' ? 'text-red-500' : 'hover:text-red-400'}>Баскетбол</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<div className="pt-32 text-center text-4xl">Футбол</div>} />
        <Route path="/cybersport" element={<div className="pt-32 text-center text-4xl">Киберспорт</div>} />
        <Route path="/hockey" element={<div className="pt-32 text-center text-4xl">Хоккей</div>} />
        <Route path="/basketball" element={<div className="pt-32 text-center text-4xl">Баскетбол</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}
