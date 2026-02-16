import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_ссылка_winline'

// Placeholder логотипы команд (замени на свои из Supabase позже)
const DEFAULT_LOGO = 'https://via.placeholder.com/100?text=Team'

export default function App() {
  const [posts, setPosts] = useState<any[]>([])
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
        console.error('Ошибка загрузки прогнозов:', error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      {/* Большой баннер Winline */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-32 px-6 overflow-hidden bg-gradient-to-r from-red-950 via-black to-red-950"
      >
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            ПРОГНОЗЫ С ПРИБЫЛЬЮ
          </h1>
          <p className="text-xl md:text-3xl mb-10 max-w-4xl mx-auto text-gray-300">
            Точные ИИ-прогнозы на спорт каждый день + <span className="font-bold text-yellow-400">бонус 15 000 ₽</span> в Winline
          </p>
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black text-2xl font-bold px-16 py-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              ЗАБРАТЬ БОНУС 15 000 ₽ →
            </a>
          </Button>
          <p className="mt-6 text-lg text-gray-400">
            Revshare 20% — зарабатывай на каждом игроке
          </p>
        </div>
      </motion.section>

      {/* Список прогнозов */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-yellow-400">
          СВЕЖИЕ ПРОГНОЗЫ С ЛУЧШИМИ КЭФАМИ
        </h2>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-yellow-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-2xl text-gray-400 py-32">
            Пока нет прогнозов — бот скоро добавит!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="group"
              >
                <Card className="relative overflow-hidden rounded-2xl bg-gray-900/70 border-gray-700 hover:border-yellow-500/70 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 backdrop-blur-sm h-full flex flex-col">
                  {/* Фото матча или команды */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Аватарки команд (overlay) */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <img
                        src={post.team_logo1 || DEFAULT_LOGO}
                        alt="Team 1"
                        className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-lg"
                      />
                      <img
                        src={post.team_logo2 || DEFAULT_LOGO}
                        alt="Team 2"
                        className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-lg"
                      />
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-yellow-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div
                      className="prose prose-invert prose-sm line-clamp-4 text-gray-300 mb-6"
                      dangerouslySetInnerHTML={{ __html: post.content.slice(0, 400) + '...' }}
                    />
                    <p className="text-sm text-gray-500 mb-6">
                      {new Date(post.created_at).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>

                    <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold transition-colors" asChild>
                      <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
                        СТАВКА В WINLINE
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
