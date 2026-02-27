// src/components/PredictionDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  team_logo1?: string;
  team_logo2?: string;
  sport?: string;
  bet?: string;
  odds?: number;
  created_at: string;
}

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co/rest/v1/posts';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXRxdm1la2F2c2FxdW9zc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Nzc5NTIsImV4cCI6MjA4NjE1Mzk1Mn0.8Tl64Uo5iBOTdAnJzf3RSUZRnc8D1NHnc8QDYdKTP14';

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIzMCIgZmlsbD0iIzExMTgyNyIvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQyIiBmaWxsPSIjMUYyOTM3IiBzdHJva2U9IiM0QjU1NjMiIHN0cm9rZS13aWR0aD0iMTIiLz4KICA8dGV4dCB4PSI2MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjaywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VEVBTTwvdGV4dD4KPC9zdmc+';

function PredictionDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }
    fetch(`${SUPABASE_URL}?select=*&id=eq.${id}&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    })
      .then(r => {
        if (!r.ok) {
          throw new Error('Failed to fetch post');
        }
        return r.json();
      })
      .then(data => {
        setPost(data[0] || null);
        if (!data[0]) {
          setError(true);
        }
      })
      .catch(e => {
        console.error(e);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-3xl text-red-500">Загрузка прогноза...</div>;

  if (error) return <Navigate to="/404" replace />;

  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Helmet><title>{post.title} | spooort.ru</title></Helmet>

      <div className="flex items-center gap-3 text-sm text-zinc-500 mb-10">
        <Link to="/" className="hover:text-white">Главная</Link> › Прогноз
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
        <div className="flex items-center gap-6">
          <img src={post.team_logo1 || DEFAULT_LOGO} alt={home} className="w-24 h-24 rounded-3xl" />
          <div className="text-5xl font-bold tracking-tighter">{home}</div>
        </div>
        <div className="text-red-600 font-black text-8xl">VS</div>
        <div className="flex items-center gap-6 flex-row-reverse">
          <div className="text-5xl font-bold tracking-tighter">{away}</div>
          <img src={post.team_logo2 || DEFAULT_LOGO} alt={away} className="w-24 h-24 rounded-3xl" />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-12 text-center mb-16">
        <div className="uppercase text-red-500 tracking-[3px] text-sm mb-4">НАШ ПРОГНОЗ</div>
        <div className="text-6xl font-bold mb-6">{post.bet}</div>
        {post.odds && <div className="text-emerald-400 text-5xl font-semibold">@{post.odds}</div>}
      </div>

      <article className="prose prose-invert max-w-none text-lg" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="mt-20 text-center">
        <Link to="/" className="inline-block bg-zinc-800 hover:bg-zinc-700 px-12 py-6 rounded-3xl text-xl font-medium">← Все прогнозы</Link>
      </div>
    </div>
  );
}

export default PredictionDetail;
