import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_ссылка_winline'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSportPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('sport', sport)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) {
        console.error('Ошибка:', error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }
    fetchSportPosts()
  }, [sport])

  const sportName = {
    football: 'Футбол',
    cybersport: 'Киберспорт',
    hockey: 'Хоккей',
    basketball: 'Баскетбол'
  }[sport || ''] || 'Неизвестный спорт'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl md:text-7xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {sportName.toUpperCase()}
        </h1>

        {loading ? (
          <div className="text-center py-32 text-2xl">Загрузка...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-400">
            Пока нет прогнозов по {sportName} — бот скоро добавит!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/prognoz/${post.id}`} className="block no-underline">
                  <Card className="bg-gray-900/80 border-gray-700 hover:border-yellow-500 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 h-full">
                    {/* здесь полностью твоя карточка из App.tsx */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/600x400?text=Match'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 flex gap-3">
                        <img src={post.team_logo1 || DEFAULT_LOGO} alt="Team 1" className="w-14 h-14 rounded-full border-3 border-yellow-500 shadow-md" />
                        <img src={post.team_logo2 || DEFAULT_LOGO} alt="Team 2" className="w-14 h-14 rounded-full border-3 border-yellow-500 shadow-md" />
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
      </div>
    </div>
  )
}
