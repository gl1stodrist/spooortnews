import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

export default function App() {
  const location = useLocation()

  // Подняли состояние поиска на уровень App
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      {/* Навигация с поиском */}
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-red-500">PRO-SPORTS</Link>

          {/* Поисковая строка */}
          <div className="flex-1 max-w-xl mx-6 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск матча или команды..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 pl-11 py-3 rounded-full text-sm focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          {/* Меню */}
          <div className="flex gap-7 text-base">
            <Link to="/" className={location.pathname === '/' ? 'text-red-500' : 'hover:text-red-400'}>Главная</Link>
            <Link to="/football" className={location.pathname === '/football' ? 'text-red-500' : 'hover:text-red-400'}>Футбол</Link>
            <Link to="/cybersport" className={location.pathname === '/cybersport' ? 'text-red-500' : 'hover:text-red-400'}>Киберспорт</Link>
            <Link to="/hockey" className={location.pathname === '/hockey' ? 'text-red-500' : 'hover:text-red-400'}>Хоккей</Link>
            <Link to="/basketball" className={location.pathname === '/basketball' ? 'text-red-500' : 'hover:text-red-400'}>Баскетбол</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/football" element={<div className="pt-32 text-center text-4xl text-red-400">Футбол</div>} />
        <Route path="/cybersport" element={<div className="pt-32 text-center text-4xl text-red-400">Киберспорт</div>} />
        <Route path="/hockey" element={<div className="pt-32 text-center text-4xl text-red-400">Хоккей</div>} />
        <Route path="/basketball" element={<div className="pt-32 text-center text-4xl text-red-400">Баскетбол</div>} />
        <Route path="/prognoz/:id" element={<PrognozPage />} />
      </Routes>
    </div>
  )
}

// Главная страница с фильтрами и поиском
function Home({ searchQuery, setSearchQuery }) {
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
        .limit(20)

      if (error) console.error('Ошибка:', error)
      else {
        setPosts(data || [])
        setFilteredPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Фильтрация: спорт + поиск
  useEffect(() => {
    let result = posts

    if (selectedSport !== 'all') {
      result = result.filter(post => post.sport === selectedSport)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(post => 
        post.title.toLowerCase().includes(q)
      )
    }

    setFilteredPosts(result)
  }, [selectedSport, searchQuery, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Фильтры по спорту */}
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

      <h2 className="text-center text-4xl md:text-5xl font-black tracking-wider mb-10">
        СВЕЖИЕ ПРОГНОЗЫ
      </h2>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-400">Загрузка...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          Ничего не найдено по вашему запросу
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/prognoz/${post.id}`}>
              <motion.div whileHover={{ y: -6 }} className="group">
                <Card className="bg-[#121212] border border-gray-800 hover:border-red-600 transition-all duration-300 rounded-2xl overflow-hidden h-full">
                  <div className="px-5 pt-4 pb-2 text-xs text-gray-500 border-b border-gray-800">
                    {post.title.split('|')[0] || 'Топ-матч'}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center flex-1">
                        <img src={post.team_logo1 || DEFAULT_LOGO} className="w-20 h-20 mx-auto rounded-full" alt="" />
                        <p className="mt-3 font-semibold text-sm line-clamp-2">{post.title.split('—')[0]?.trim()}</p>
                      </div>

                      <div className="text-center px-4">
                        <div className="text-red-500 font-black text-4xl mb-1">VS</div>
                        <div className="text-[10px] text-gray-500">Прогноз от PRO-SPORTS</div>
                      </div>

                      <div className="text-center flex-1">
                        <img src={post.team_logo2 || DEFAULT_LOGO} className="w-20 h-20 mx-auto rounded-full" alt="" />
                        <p className="mt-3 font-semibold text-sm line-clamp-2">{post.title.split('—')[1]?.trim()}</p>
                      </div>
                    </div>

                    <div className="bg-[#1a1a1a] text-center py-3 rounded-xl text-sm font-medium text-gray-300">
                      {new Date(post.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })},&nbsp;
                      {new Date(post.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} МСК
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Детальная страница
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
