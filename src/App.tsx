import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_ссылка_winline'

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

      if (error) console.error(error)
      else setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Баннер Winline */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-black text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          ПРОГНОЗЫ С ПРИБЫЛЬЮ
        </h1>
        <p className="text-2xl mb-8">Точные ИИ-прогнозы каждый день + бонус 15 000 ₽ в Winline</p>
        <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:scale-105 transition-all" asChild>
          <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
            ЗАБРАТЬ БОНУС 15 000 ₽ →
          </a>
        </Button>
        <p className="mt-6 text-lg text-gray-400">Revshare 20% — зарабатывай на каждом игроке</p>
      </section>

      {/* Прогнозы */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          СВЕЖИЕ ПРОГНОЗЫ С ЛУЧШИМИ КЭФАМИ
        </h2>

        {loading ? (
          <div className="text-center py-32 text-2xl">Загрузка прогнозов...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 text-2xl text-gray-400">
            Пока нет прогнозов — ИИ скоро добавит!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map(post => (
              <Card key={post.id} className="bg-gray-800/80 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 rounded-2xl overflow-hidden">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full h-64 object-cover" />
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold line-clamp-2 text-yellow-400">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6 text-lg rounded-xl" asChild>
                    <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
                      СТАВКА В WINLINE
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
