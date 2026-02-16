import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_ссылка_winline'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'

export default function App() {
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
        console.error('Ошибка загрузки:', error)
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

      {/* Фильтры по видам спорта */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            { value: 'all', label: 'Все' },
            { value: 'soccer', label: '⚽ Футбол' },
            { value: 'cs2', label: '🔫 Киберспорт' },
            { value: 'hockey', label: '🏒 Хоккей' },
            { value: 'basketball', label: '🏀 Баскетбол' }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setSelectedSport(item.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all text-lg ${
                selectedSport === item.value
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Прогнозы */}
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          СВЕЖИЕ ПРОГНОЗЫ
        </h2>

        {loading ? (
          <div className="text-center py-32 text-2xl">Загрузка...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-400">
            Нет прогнозов по этому виду спорта — бот скоро добавит!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/prognoz/${post.id}`} className="block no-underline">
                  <Card className="bg-gray-900/80 border-gray-700 hover:border-yellow-500 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 flex gap-3">
                        <img
                          src={post.team_logo1 || DEFAULT_LOGO}
                          alt="Team 1"
                          className="w-14 h-14 rounded-full border-3 border-yellow-500 shadow-md"
                        />
                        <img
                          src={post.team_logo2 || DEFAULT_LOGO}
                          alt="Team 2"
                          className="w-14 h-14 rounded-full border-3 border-yellow-500 shadow-md"
                        />
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-yellow-400 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-300 line-clamp-4 mb-6" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 300) + '...' }} />
                      <p className="text-sm text-gray-500 mb-6">
                        {new Date(post.created_at).toLocaleString('ru-RU')} • {post.sport?.toUpperCase()}
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
