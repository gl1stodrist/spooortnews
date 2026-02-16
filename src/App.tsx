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
    <div className="min-h-screen bg-[#0b0b0f] text-white relative overflow-hidden pb-24 md:pb-0">
      {/* Фон градиент */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#200000]/15 via-transparent to-[#0a0000]/10 pointer-events-none" />

      {/* Баннер */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 md:py-32 bg-gradient-to-b from-[#1a0000]/80 to-transparent text-center px-4"
      >
        <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          ПРОГНОЗЫ С ПРИБЫЛЬЮ
        </h1>
        <p className="text-lg md:text-2xl mb-6 md:mb-10 text-gray-300 px-2">
          Точные прогнозы + бонус 15 000 ₽ в Winline
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold px-10 md:px-12 py-6 md:py-8 text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-red-500/60 transition-all hover:scale-105 border-2 border-red-500/70 w-11/12 md:w-auto"
          asChild
        >
          <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
            ЗАБРАТЬ БОНУС 15 000 ₽ →
          </a>
        </Button>
        <p className="mt-6 text-base md:text-lg text-gray-500">
          Revshare 20% — зарабатывай на каждом игроке
        </p>
      </motion.section>

      {/* Фильтры — горизонтальный скролл на мобильных */}
      <section className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex overflow-x-auto gap-3 md:gap-4 justify-start md:justify-center pb-4 md:pb-0 scrollbar-hide">
          {[
            { value: 'all', label: 'Все', icon: '★' },
            { value: 'soccer', label: 'Футбол', icon: '⚽' },
            { value: 'cs2', label: 'Кибер', icon: '🎮' },
            { value: 'hockey', label: 'Хоккей', icon: '🏒' },
            { value: 'basketball', label: 'Баскет', icon: '🏀' }
          ].map(item => (
            <motion.button
              key={item.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSport(item.value)}
              className={`flex-shrink-0 px-5 md:px-7 py-2.5 md:py-3.5 rounded-full text-base md:text-lg font-medium transition-all duration-300 border-2 whitespace-nowrap ${
                selectedSport === item.value
                  ? 'bg-red-700/80 border-red-500 text-white shadow-lg shadow-red-500/40'
                  : 'bg-transparent border-red-800/60 text-gray-300 hover:border-red-600 hover:text-red-300 hover:bg-red-950/30'
              }`}
            >
              <span className={`mr-1.5 md:mr-2 text-lg md:text-xl ${selectedSport === item.value ? 'text-red-300' : 'text-red-700 group-hover:text-red-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Заголовок */}
        <h2 className="text-4xl md:text-6xl font-black text-center mt-10 md:mt-16 mb-10 md:mb-16 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-20 md:py-32 text-xl md:text-2xl text-gray-400">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 md:py-32 text-xl md:text-2xl text-gray-500">
            Нет прогнозов по этому виду спорта
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                <Link to={`/prognoz/${post.id}`} className="block no-underline">
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-850 border border-gray-700 group-hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-red-900/30 h-full relative">
                    {/* Бейдж спорта */}
                    <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full text-xs md:text-sm font-bold text-red-400 z-10 border border-red-800/50">
                      {post.sport === 'soccer' ? '⚽ Футбол' :
                       post.sport === 'cs2' ? '🎮 Кибер' :
                       post.sport === 'hockey' ? '🏒 Хоккей' :
                       post.sport === 'basketball' ? '🏀 Баскет' : post.sport?.toUpperCase()}
                    </div>

                    {/* Коэффициент */}
                    <div className="absolute top-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold z-10 shadow-md">
                      {post.content.match(/(\d+\.\d+)/)?.[0] || 'Кэф'}
                    </div>

                    <div className="relative h-48 md:h-64 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <motion.img
                          whileHover={{ scale: 1.15 }}
                          src={post.team_logo1 || DEFAULT_LOGO}
                          alt="Team 1"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-red-600 shadow-md transition-transform duration-300"
                        />
                        <motion.img
                          whileHover={{ scale: 1.15 }}
                          src={post.team_logo2 || DEFAULT_LOGO}
                          alt="Team 2"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-red-600 shadow-md transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <CardHeader className="pb-2 md:pb-3 px-4 md:px-6">
                      <CardTitle className="text-base md:text-xl font-bold line-clamp-2 text-white group-hover:text-red-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
                      <div className="text-gray-300 line-clamp-3 md:line-clamp-4 mb-4 text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) + '...' }} />
                      <p className="text-xs text-gray-500 mb-3 md:mb-4">
                        {new Date(post.created_at).toLocaleDateString('ru-RU')}
                      </p>
                      <Button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-sm md:text-base transition-colors border border-red-600/50 hover:border-red-400 py-5 md:py-6">
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

      {/* Нижняя навигация на мобильных */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-red-900/30 md:hidden z-50">
        <div className="flex justify-around items-center py-3 px-4">
          <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-xl">🏠</span>
            Главная
          </Link>
          <Link to="/football" className={`flex flex-col items-center text-xs ${location.pathname === '/football' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-xl">⚽</span>
            Футбол
          </Link>
          <Link to="/cybersport" className={`flex flex-col items-center text-xs ${location.pathname === '/cybersport' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-xl">🎮</span>
            Кибер
          </Link>
          <Link to="/hockey" className={`flex flex-col items-center text-xs ${location.pathname === '/hockey' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-xl">🏒</span>
            Хоккей
          </Link>
          <Link to="/basketball" className={`flex flex-col items-center text-xs ${location.pathname === '/basketball' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-xl">🏀</span>
            Баскет
          </Link>
        </div>
      </nav>
    </div>
  )
}

// Детальная страница (адаптирована под мобильные)
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

      if (error) console.error('Ошибка:', error)
      else setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-300">Загрузка...</div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0f] to-black text-white pt-16 md:pt-20 pb-24 md:pb-0">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-center mb-6 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent"
        >
          {post.title}
        </motion.h1>

        <div className="text-center mb-6 text-gray-400 text-base md:text-xl">
          {new Date(post.created_at).toLocaleString('ru-RU')} • {post.sport?.toUpperCase()}
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={post.image_url || 'https://via.placeholder.com/800x500?text=Match'}
          alt={post.title}
          className="w-full rounded-xl md:rounded-2xl shadow-2xl mb-8 md:mb-12 object-cover max-h-[300px] md:max-h-[500px] border border-red-900/30"
        />

        <div className="flex justify-center gap-8 md:gap-16 mb-8 md:mb-12 flex-wrap">
          <div className="text-center">
            <img src={post.team_logo1 || DEFAULT_LOGO} alt="Команда 1" className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-red-600 shadow-lg mb-2" />
            <p className="text-base md:text-xl font-bold">{post.title.split('—')[0]?.trim()}</p>
          </div>
          <div className="self-center text-4xl md:text-5xl font-black text-gray-600">VS</div>
          <div className="text-center">
            <img src={post.team_logo2 || DEFAULT_LOGO} alt="Команда 2" className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-red-600 shadow-lg mb-2" />
            <p className="text-base md:text-xl font-bold">{post.title.split('—')[1]?.trim()}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-base md:prose-lg max-w-none mb-12 md:mb-16 bg-black/30 p-5 md:p-8 rounded-xl border-l-4 border-red-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="text-center mt-10 md:mt-16">
          <Button size="lg" className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold px-10 md:px-12 py-6 md:py-8 text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-red-500/60 transition-all border-2 border-red-500/70 hover:border-red-400 w-full md:w-auto" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              СДЕЛАТЬ СТАВКУ → БОНУС 15 000 ₽
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
    <div className="relative">
      {/* Верхняя навигация для десктопа */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b border-red-900/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            PRO-SPORTS
          </Link>
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className={`text-lg font-medium transition-colors ${location.pathname === '/' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              Главная
            </Link>
            <Link to="/football" className={`text-lg font-medium transition-colors ${location.pathname === '/football' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              ⚽ Футбол
            </Link>
            <Link to="/cybersport" className={`text-lg font-medium transition-colors ${location.pathname === '/cybersport' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🎮 Кибер
            </Link>
            <Link to="/hockey" className={`text-lg font-medium transition-colors ${location.pathname === '/hockey' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🏒 Хоккей
            </Link>
            <Link to="/basketball" className={`text-lg font-medium transition-colors ${location.pathname === '/basketball' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
              🏀 Баскет
            </Link>
          </div>
        </div>
      </nav>

      {/* Нижняя навигация для мобильных */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-red-900/30 md:hidden z-50">
        <div className="flex justify-around items-center py-3 px-2">
          <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-2xl">🏠</span>
            Главная
          </Link>
          <Link to="/football" className={`flex flex-col items-center text-xs ${location.pathname === '/football' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-2xl">⚽</span>
            Футбол
          </Link>
          <Link to="/cybersport" className={`flex flex-col items-center text-xs ${location.pathname === '/cybersport' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-2xl">🎮</span>
            Кибер
          </Link>
          <Link to="/hockey" className={`flex flex-col items-center text-xs ${location.pathname === '/hockey' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-2xl">🏒</span>
            Хоккей
          </Link>
          <Link to="/basketball" className={`flex flex-col items-center text-xs ${location.pathname === '/basketball' ? 'text-red-400' : 'text-gray-400'}`}>
            <span className="text-2xl">🏀</span>
            Баскет
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center text-4xl md:text-6xl text-red-400 bg-black">Футбол — прогнозы скоро добавятся!</div>} />
        <Route path="/cybersport" element={<div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center text-4xl md:text-6xl text-red-400 bg-black">Киберспорт — прогнозы скоро добавятся!</div>} />
        <Route path="/hockey" element={<div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center text-4xl md:text-6xl text-red-400 bg-black">Хоккей — прогнозы скоро добавятся!</div>} />
        <Route path="/basketball" element={<div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center text-4xl md:text-6xl text-red-400 bg-black">Баскетбол — прогнозы скоро добавятся!</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}
