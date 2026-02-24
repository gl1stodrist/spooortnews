// src/components/PredictionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Post } from '../App';

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXRxdm1la2F2c2FxdW9zc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Nzc5NTIsImV4cCI6MjA4NjE1Mzk1Mn0.8Tl64Uo5iBOTdAnJzf3RSUZRnc8D1NHnc8QDYdKTP14';

const DEFAULT_LOGO = 'data:image/svg+xml;base64,...';

export function PredictionDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        // Преобразуем id в число, чтобы совпадало с типом в Supabase
        const res = await fetch(`${SUPABASE_URL}?id=eq.${Number(id)}`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await res.json();
        setPost(data[0] || null); // берём первый элемент
      } catch (e) {
        console.error(e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center text-3xl text-red-500">
      Загрузка прогноза...
    </div>
  );

  if (!post) return <Navigate to="/" replace />; // если нет данных — на главную

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Название */}
      <h1 className="text-4xl font-bold mb-6 text-center">{post.title}</h1>

      {/* Логотипы команд */}
      <div className="flex justify-center gap-8 mb-6">
        <img
          src={post.team_logo1 || DEFAULT_LOGO}
          alt="Команда 1"
          className="w-24 h-24 object-contain rounded-full"
        />
        <img
          src={post.team_logo2 || DEFAULT_LOGO}
          alt="Команда 2"
          className="w-24 h-24 object-contain rounded-full"
        />
      </div>

      {/* Изображение прогноза */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="mb-6 w-full rounded-xl"
        />
      )}

      {/* Вид спорта */}
      {post.sport && (
        <p className="text-lg text-zinc-300 mb-2 text-center">
          <strong>Спорт:</strong> {post.sport.charAt(0).toUpperCase() + post.sport.slice(1)}
        </p>
      )}

      {/* Ставка и коэффициент */}
      {post.bet && (
        <p className="text-red-400 text-lg mb-2 text-center">
          <strong>Ставка:</strong> {post.bet} {post.odds && `(Коэф: ${post.odds})`}
        </p>
      )}

      {/* Дата */}
      <p className="text-sm text-zinc-500 text-center">
        <strong>Дата:</strong> {new Date(post.created_at).toLocaleString()}
      </p>
    </div>
  );
}
