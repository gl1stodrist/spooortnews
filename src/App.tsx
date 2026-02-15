import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase' // если путь другой — подкорректируй
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_партнёрская_ссылка_winline'

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
        .limit(9)

      if (error) console.error('Ошибка загрузки прогнозов:', error)
      else setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Большой баннер — продажа Winline */}
      <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-r from-red-950 via-black to-red-950">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            ПРОГНОЗЫ С ПРИБЫЛЬЮ
          </h1>
          <p className="text-xl md:text-3xl mb-10 max-w-4xl mx-auto text-gray-300">
            Точные прогнозы на спорт каждый день + <span className="font-bold text-yellow-400">бонус 15 000 ₽</span> в Winline
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
      </section>

      {/* Список прогнозов */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-16 text-yellow-400">
          Свежие прогнозы с лучшими кэфами
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
            {posts.map(post => (
              <Card key={post.id} className="bg-gray-900/70 border-gray-800 hover:border-yellow-600/50 transition-all backdrop-blur-sm">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full h-56 object-cover rounded-t-xl" />
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold line-clamp-2 text-white">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-invert prose-sm line-clamp-4 text-gray-300 mb-6"
                    dangerouslySetInnerHTML={{ __html: post.content.slice(0, 400) + '...' }}
                  />
                  <p className="text-sm text-gray-500 mb-6">
                    {new Date(post.created_at).toLocaleString('ru-RU')}
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold" asChild>
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
