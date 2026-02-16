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

      if (error) {
        console.error('Ошибка:', error)
      } else {
        setPosts(data || [])
        setFilteredPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Фильтрация при смене вида спорта
  useEffect(() => {
    if (selectedSport === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.sport === selectedSport))
    }
  }, [selectedSport, posts])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Баннер */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-red-900 to-black text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          ПРОГНОЗЫ С ПРИБЫЛЬЮ
        </h1>
        <p className="text-2xl mb-8">Точные прогнозы + бонус 15 000 ₽ в Winline</p>
        <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:scale-105 transition-all" asChild>
          <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
            ЗАБРАТЬ БОНУС 15 000 ₽ →
          </a>
        </Button>
        <p className="mt-6 text-lg text-gray-400">Revshare 20% — зарабатывай на каждом игроке</p>
      </motion.section>

      {/* ФИЛЬТРЫ ПО ВИДАМ СПОРТА */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
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
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                selectedSport === item.value
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* УЛУЧШЕННЫЕ КАРТОЧКИ С HOVER */}
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-32 text-2xl">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-400">
            Нет прогнозов по выбранному виду спорта — бот скоро добавит!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.04, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <Link to={`/prognoz/${post.id}`} className="block no-underline">
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 group-hover:border-yellow-500 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-yellow-500/30 h-full relative">
                    {/* Бейдж вида спорта */}
                    <div className="absolute top-4 left-4 bg-black/70 px-4 py-1 rounded-full text-sm font-bold text-yellow-400 z-10">
                      {post.sport === 'soccer' ? '⚽ Футбол' :
                       post.sport === 'cs2' ? '🎮 Киберспорт' :
                       post.sport === 'hockey' ? '🏒 Хоккей' :
                       post.sport === 'basketball' ? '🏀 Баскетбол' : post.sport?.toUpperCase()}
                    </div>

                    {/* Коэффициент */}
                    <div className="absolute top-4 right-4 bg-yellow-500/90 text-black px-4 py-1 rounded-full text-sm font-bold z-10 shadow-md">
                      {post.content.match(/(\d+\.\d+)/)?.[0] || 'Кэф'}
                    </div>

                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4 flex gap-3">
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          src={post.team_logo1 || DEFAULT_LOGO}
                          alt="Team 1"
                          className="w-16 h-16 rounded-full border-4 border-yellow-500 shadow-lg transition-transform duration-300"
                        />
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          src={post.team_logo2 || DEFAULT_LOGO}
                          alt="Team 2"
                          className="w-16 h-16 rounded-full border-4 border-yellow-500 shadow-lg transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-yellow-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-300 line-clamp-4 mb-6 text-sm" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 250) + '...' }} />
                      <p className="text-xs text-gray-500 mb-4">
                        {new Date(post.created_at).toLocaleString('ru-RU')}
                      </p>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold transition-colors">
                        СТАВКА В WINLINE
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

// Детальная страница прогноза (оставляем как есть)
function PrognozPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Ошибка загрузки прогноза:', error)
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white pt-20">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
        >
          {post.title}
        </motion.h1>

        <div className="text-center mb-10 text-gray-400 text-xl">
          {new Date(post.created_at).toLocaleString('ru-RU')} • {post.sport?.toUpperCase()}
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={post.image_url || 'https://via.placeholder.com/1200x600?text=Match'}
          alt={post.title}
          className="w-full rounded-2xl shadow-2xl mb-12 object-cover max-h-[500px]"
        />

        <div className="flex justify-center gap-16 mb-12 flex-wrap">
          <div className="text-center">
            <img src={post.team_logo1 || DEFAULT_LOGO} alt="Команда 1" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[0]?.trim()}</p>
          </div>
          <div className="self-center text-5xl font-black text-gray-600">VS</div>
          <div className="text-center">
            <img src={post.team_logo2 || DEFAULT_LOGO} alt="Команда 2" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[1]?.trim()}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="text-center mt-16">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:scale-105 transition-all" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              СДЕЛАТЬ СТАВКУ В WINLINE → БОНУС 15 000 ₽
            </a>
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
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            PRO-SPORTS
          </Link>
          <div className="flex gap-6">
            <Link to="/" className={`text-lg font-medium ${location.pathname === '/' ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}>
              Главная
            </Link>
            <Link to="/football" className={`text-lg font-medium ${location.pathname === '/football' ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}>
              ⚽ Футбол
            </Link>
            <Link to="/cybersport" className={`text-lg font-medium ${location.pathname === '/cybersport' ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}>
              🎮 Киберспорт
            </Link>
            <Link to="/hockey" className={`text-lg font-medium ${location.pathname === '/hockey' ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}>
              🏒 Хоккей
            </Link>
            <Link to="/basketball" className={`text-lg font-medium ${location.pathname === '/basketball' ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}>
              🏀 Баскетбол
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-yellow-400 bg-black">Футбол — прогнозы скоро добавятся!</div>} />
        <Route path="/cybersport" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-yellow-400 bg-black">Киберспорт — прогнозы скоро добавятся!</div>} />
        <Route path="/hockey" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-yellow-400 bg-black">Хоккей — прогнозы скоро добавятся!</div>} />
        <Route path="/basketball" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-yellow-400 bg-black">Баскетбол — прогнозы скоро добавятся!</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}
