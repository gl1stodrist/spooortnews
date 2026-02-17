import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Фильтры */}
      <section className="container mx-auto px-6 py-8">
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
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                selectedSport === item.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-red-600 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <h2 className="text-5xl font-black text-center mb-12 text-white tracking-tight">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-32 text-2xl text-gray-400">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-500">Нет прогнозов по выбранному виду спорта</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link to={`/prognoz/${post.id}`} className="block">
                  <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden h-full">
                    {/* Название лиги */}
                    <div className="px-5 pt-5 pb-3 text-sm text-gray-400 border-b border-gray-800">
                      {post.title.split('|')[0] || 'Топ-матч'}
                    </div>

                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-6">
                        {/* Левая команда */}
                        <div className="text-center flex-1">
                          <img 
                            src={post.team_logo1 || DEFAULT_LOGO} 
                            alt="Team 1" 
                            className="w-20 h-20 mx-auto rounded-full border border-gray-700" 
                          />
                          <p className="mt-3 font-semibold text-sm line-clamp-2">
                            {post.title.split('—')[0]?.trim()}
                          </p>
                        </div>

                        {/* Центр */}
                        <div className="text-center px-4">
                          <div className="text-xs text-gray-500 mb-1">Прогноз от PRO-SPORTS</div>
                          <div className="text-2xl font-black text-red-500">VS</div>
                        </div>

                        {/* Правая команда */}
                        <div className="text-center flex-1">
                          <img 
                            src={post.team_logo2 || DEFAULT_LOGO} 
                            alt="Team 2" 
                            className="w-20 h-20 mx-auto rounded-full border border-gray-700" 
                          />
                          <p className="mt-3 font-semibold text-sm line-clamp-2">
                            {post.title.split('—')[1]?.trim()}
                          </p>
                        </div>
                      </div>

                      {/* Время матча */}
                      <div className="bg-[#1a1a1a] text-center py-2.5 rounded-xl text-sm font-medium text-gray-300">
                        {new Date(post.created_at).toLocaleString('ru-RU', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
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

  if (loading) return <div className="text-center py-40">Загрузка...</div>
  if (!post) return <div className="text-center py-40 text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-center mb-8">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-invert max-w-none" />
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
        <Route path="/football" element={<div className="pt-32 text-center text-4xl text-red-400">Футбол</div>} />
        <Route path="/cybersport" element={<div className="pt-32 text-center text-4xl text-red-400">Киберспорт</div>} />
        <Route path="/hockey" element={<div className="pt-32 text-center text-4xl text-red-400">Хоккей</div>} />
        <Route path="/basketball" element={<div className="pt-32 text-center text-4xl text-red-400">Баскетбол</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}
