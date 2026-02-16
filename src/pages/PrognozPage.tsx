import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const WINLINE_LINK = import.meta.env.VITE_WINLINE_LINK || 'https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg'

export default function PrognozPage() {
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

      if (error) {
        console.error('Ошибка:', error)
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Прогноз не найден</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white pt-20">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
        >
          {post.title}
        </motion.h1>

        <div className="text-center mb-10 text-gray-400 text-xl">
          {new Date(post.created_at).toLocaleString('ru-RU')} • {post.sport?.toUpperCase()}
        </div>

        {/* Фото матча */}
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={post.image_url || 'https://via.placeholder.com/1200x600?text=Match'}
          alt={post.title}
          className="w-full rounded-2xl shadow-2xl mb-12 object-cover max-h-[500px]"
        />

        {/* Логотипы команд */}
        <div className="flex justify-center gap-16 mb-12 flex-wrap">
          <div className="text-center">
            <img src={post.team_logo1 || 'https://via.placeholder.com/140?text=Team1'} alt="Команда 1" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[0]?.trim()}</p>
          </div>
          <div className="self-center text-5xl font-black text-gray-600">VS</div>
          <div className="text-center">
            <img src={post.team_logo2 || 'https://via.placeholder.com/140?text=Team2'} alt="Команда 2" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 shadow-lg mb-4" />
            <p className="text-xl font-bold">{post.title.split('—')[1]?.trim()}</p>
          </div>
        </div>

        {/* Основной контент (лонгрид) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-8 text-2xl rounded-xl shadow-2xl hover:scale-105 transition-all" asChild>
            <a href={WINLINE_LINK} target="_blank" rel="noopener noreferrer">
              СДЕЛАТЬ СТАВКУ В WINLINE → БОНУС 15 000 ₽
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
