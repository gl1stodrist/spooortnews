import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'
const DEFAULT_LOGO = 'https://via.placeholder.com/120?text=Team'

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('sport', sport)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) console.error('Ошибка:', error)
      else setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [sport])

  const sportName = {
    football: 'Футбол',
    cybersport: 'Киберспорт',
    hockey: 'Хоккей',
    basketball: 'Баскетбол'
  }[sport || ''] || 'Спорт'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {sportName}
        </h1>

        {loading ? (
          <p className="text-center text-2xl">Загрузка...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-2xl text-gray-400">Пока нет прогнозов по {sportName}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} to={`/prognoz/${post.id}`} className="block no-underline">
                <Card className="bg-gray-900 border-gray-700 hover:border-yellow-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) + '...' }} />
                    <Button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-500">
                      Читать прогноз
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
