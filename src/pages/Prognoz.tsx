import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://твоя_ссылка_winline'

export default function Prognoz() {
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

  if (loading) return <div className="container mx-auto py-32 text-center text-3xl">Загрузка...</div>

  if (!post) return <div className="container mx-auto py-32 text-center text-3xl text-red-500">Прогноз не найден</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white py-12"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <Link to="/" className="inline-block mb-8 text-yellow-400 hover:text-yellow-300 transition text-lg">
          ← Назад к прогнозам
        </Link>

        <h1 className="text-4xl md:text-6xl font-black mb-10 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {post.title}
        </h1>

        {post.image_url && (
          <img src={post.image_url} alt={post.title} className="w-full rounded-2xl mb-12 shadow-2xl max-h-96 object-cover mx-auto" />
        )}

        <div className="flex justify-center gap-16 mb-12 flex-wrap">
          <div className="text-center">
            <img src={post.team_logo1 || 'https://via.placeholder.com/140?text=Team1'} alt="Team 1" className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-lg" />
            <p className="mt-4 text-xl font-bold text-yellow-400">{post.title.split('—')[0].trim()}</p>
          </div>
          <div className="text-4xl font-bold self-center text-gray-500">VS</div>
          <div className="text-center">
            <img src={post.team_logo2 || 'https://via.placeholder.com/140?text=Team2'} alt="Team 2" className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg" />
            <p className="mt-4 text-xl font-bold text-blue-400">{post.title.split('—')[1]?.trim()}</p>
          </div>
        </div>

        <p className="text-center text-xl text-gray-400 mb-12">
          {new Date(post.created_at).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}
        </p>

        <div className="prose prose-invert prose-xl max-w-none mb-16 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-2xl py-10" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              СДЕЛАТЬ СТАВКУ В WINLINE →
            </a>
          </Button>
          <Button variant="outline" size="lg" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 text-2xl py-10" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              ЗАБРАТЬ БОНУС 15 000 ₽
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
