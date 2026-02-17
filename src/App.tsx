import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [selectedSport, setSelectedSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
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

  useEffect(() => {
    let result = posts

    if (selectedSport !== 'all') {
      result = result.filter(post => post.sport === selectedSport)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(post => post.title.toLowerCase().includes(q))
    }

    setFilteredPosts(result)
  }, [selectedSport, searchQuery, posts])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Навигация + Поиск */}
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-red-500">PRO-SPORTS</Link>

          <div className="flex-1 max-w-xl mx-6 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск матча или команды..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 pl-11 py-3 rounded-full text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="flex gap-7 text-base">
            <Link to="/" className={location.pathname === '/' ? 'text-red-500' : 'hover:text-red-400'}>Главная</Link>
            <Link to="/football" className={location.pathname === '/football' ? 'text-red-500' : 'hover:text-red-400'}>Футбол</Link>
            <Link to="/cybersport" className={location.pathname === '/cybersport' ? 'text-red-500' : 'hover:text-red-400'}>Киберспорт</Link>
            <Link to="/hockey" className={location.pathname === '/hockey' ? 'text-red-500' : 'hover:text-red-400'}>Хоккей</Link>
            <Link to="/basketball" className={location.pathname === '/basketball' ? 'text-red-500' : 'hover:text-red-400'}>Баскетбол</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 flex-1">
        {/* Фильтры и карточки — остаются как были */}
        {/* ... (твой текущий код с карточками) ... */}
      </div>

      {/* ==================== ФУТЕР КАК У AZARTNEWS ==================== */}
      <footer className="bg-black border-t border-gray-900 mt-auto">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Левая колонка — логотип + описание */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-4xl font-black tracking-tighter">S</span>
              </div>
              <div className="text-3xl font-black text-white">PRO-SPORTS</div>
            </div>
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
              Аналитические обзоры, прогнозы, статистика.<br />
              Не является призывом к действию и не даёт гарантий результата.<br />
              Честные обзоры матчей без рекламы азартных игр.
            </p>
            <p className="mt-8 text-sm text-gray-500">
              PRO-SPORTS © 2026 | 18+
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Основатель: Иванов Б. Д.
            </p>
          </div>

          {/* Центральные колонки */}
          <div className="md:col-span-4 grid grid-cols-2 gap-10">
            <div>
              <h4 className="font-semibold mb-4 text-white">Разделы</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">Главная</Link></li>
                <li><Link to="/football" className="hover:text-white">Прогнозы на футбол</Link></li>
                <li><Link to="/cybersport" className="hover:text-white">Прогнозы на киберспорт</Link></li>
                <li><Link to="/hockey" className="hover:text-white">Прогнозы на хоккей</Link></li>
                <li><Link to="/basketball" className="hover:text-white">Прогнозы на баскетбол</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Информация</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>Обзор букмекеров</li>
                <li>Рейтинг букмекеров</li>
                <li>Новости</li>
                <li>Контакты</li>
              </ul>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="md:col-span-3 text-right md:text-left">
            <h4 className="font-semibold mb-4 text-white">Мы в соцсетях</h4>
            <div className="flex gap-4 justify-end md:justify-start text-2xl">
              <a href="#" className="text-gray-400 hover:text-white">TG</a>
              <a href="#" className="text-gray-400 hover:text-white">VK</a>
            </div>
          </div>
        </div>

        {/* Нижняя полоска */}
        <div className="border-t border-gray-900 py-6 text-center text-xs text-gray-500">
          Копирование материалов только со ссылкой на PRO-SPORTS.ru
        </div>
      </footer>
    </div>
  )
}

// Детальная страница (оставляем без изменений)
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
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black text-red-500">PRO-SPORTS</Link>

          <div className="flex-1 max-w-xl mx-6 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск матча или команды..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 pl-11 py-3 rounded-full text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

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
