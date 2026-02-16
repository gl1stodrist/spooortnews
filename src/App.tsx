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
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Лёгкий красный градиент на фоне */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000]/30 via-transparent to-[#0a0000]/20 pointer-events-none" />

      {/* Баннер */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 md:py-32 bg-gradient-to-b from-[#1a0000] to-transparent text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          ПРОГНОЗЫ С ПРИБЫЛЬЮ
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300">
          Точные прогнозы + бонус 15 000 ₽ в Winline
        </p>
        <Button
          size="lg"
          className="bg-red-700 hover:bg-red-600 text-white font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all hover:scale-105 border-2 border-red-500/70"
          asChild
        >
          <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
            ЗАБРАТЬ БОНУС 15 000 ₽ →
          </a>
        </Button>
        <p className="mt-8 text-lg text-gray-500">
          Revshare 20% — зарабатывай на каждом игроке
        </p>
      </motion.section>

      {/* Фильтры — красные контуры + символы */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {[
            { value: 'all', label: 'Все', icon: '★' },
            { value: 'soccer', label: 'Футбол', icon: '⚽' },
            { value: 'cs2', label: 'Киберспорт', icon: '🎮' },
            { value: 'hockey', label: 'Хоккей', icon: '🏒' },
            { value: 'basketball', label: 'Баскетбол', icon: '🏀' }
          ].map(item => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSport(item.value)}
              className={`group px-7 py-3.5 rounded-full text-lg font-medium transition-all duration-300 border-2 ${
                selectedSport === item.value
                  ? 'bg-red-700/80 border-red-500 text-white shadow-lg shadow-red-500/40'
                  : 'bg-transparent border-red-800/60 text-gray-300 hover:border-red-600 hover:text-red-300 hover:bg-red-950/30'
              }`}
            >
              <span className={`mr-2 text-xl ${selectedSport === item.value ? 'text-red-300' : 'text-red-700 group-hover:text-red-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Заголовок */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-32 text-2xl text-gray-400">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-500">
            Нет прогнозов по этому виду спорта — скоро добавим!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.04, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <Link to={`/prognoz/${post.id}`} className="block no-underline">
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 group-hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-red-900/30 h-full relative">
                    {/* Бейдж вида спорта */}
                    <div className="absolute top-4 left-4 bg-black/70 px-4 py-1 rounded-full text-sm font-bold text-red-400 z-10 border border-red-800/50">
                      {post.sport === 'soccer' ? '⚽ Футбол' :
                       post.sport === 'cs2' ? '🎮 Киберспорт' :
                       post.sport === 'hockey' ? '🏒 Хоккей' :
                       post.sport === 'basketball' ? '🏀 Баскетбол' : post.sport?.toUpperCase()}
                    </div>

                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4 flex gap-3 z-10">
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          src={post.team_logo1 || DEFAULT_LOGO}
                          alt="Team 1"
                          className="w-16 h-16 rounded-full border-4 border-red-600 shadow-lg transition-transform duration-300"
                        />
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          src={post.team_logo2 || DEFAULT_LOGO}
                          alt="Team 2"
                          className="w-16 h-16 rounded-full border-4 border-red-600 shadow-lg transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-red-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="text-gray-300 line-clamp-4 mb-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 250) + '...' }} />
                      <p className="text-xs text-gray-500 mb-4">
                        {new Date(post.created_at).toLocaleString('ru-RU')}
                      </p>
                      <Button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold transition-colors border border-red-600/50 hover:border-red-400">
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

// Детальная страница (оставляем как была)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-300">Загрузка...</div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white pt-20">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-center mb-8 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent"
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
          className="w-full rounded-2xl shadow-2xl mb-12 object-cover max-h-[500px] border border-red-900/30"
        />

        <div className="flex justify-center gap-16 mb-12 flex-wrap">
          <div className="text-center">
            <img src={post.team_logo1 || DEFAULT_LOGO} alt="Команда 1" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[0]?.trim()}</p>
          </div>
          <div className="self-center text-5xl font-black text-gray-600">VS</div>
          <div className="text-center">
            <img src={post.team_logo2 || DEFAULT_LOGO} alt="Команда 2" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[1]?.trim()}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none mb-16 border-l-4 border-red-600 pl-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="text-center mt-16">
          <Button size="lg" className="bg-red-700 hover:bg-red-600 text-white font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all border-2 border-red-500/70 hover:border-red-400" asChild>
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
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b border-red-900/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            PRO-SPORTS
          </Link>
          <div className="flex gap-5 md:gap-8">
            <Link to="/" className={`text-base md:text-lg font-medium transition-colors ${location.pathname === '/' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              Главная
            </Link>
            <Link to="/football" className={`text-base md:text-lg font-medium transition-colors ${location.pathname === '/football' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              ⚽ Футбол
            </Link>
            <Link to="/cybersport" className={`text-base md:text-lg font-medium transition-colors ${location.pathname === '/cybersport' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🎮 Кибер
            </Link>
            <Link to="/hockey" className={`text-base md:text-lg font-medium transition-colors ${location.pathname === '/hockey' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🏒 Хоккей
            </Link>
            <Link to="/basketball" className={`text-base md:text-lg font-medium transition-colors ${location.pathname === '/basketball' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🏀 Баскет
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-red-400 bg-black">Футбол — прогнозы скоро добавятся!</div>} />
        <Route path="/cybersport" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-red-400 bg-black">Киберспорт — прогнозы скоро добавятся!</div>} />
        <Route path="/hockey" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-red-400 bg-black">Хоккей — прогнозы скоро добавятся!</div>} />
        <Route path="/basketball" element={<div className="min-h-screen pt-24 flex items-center justify-center text-5xl text-red-400 bg-black">Баскетбол — прогнозы скоро добавятся!</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}
