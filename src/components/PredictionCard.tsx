import React from 'react';
import { Link } from 'react-router-dom';

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

function PredictionCard({ post }: { post: Post }) {
  const [home, away] = post.title.split(' | ')[0].split(' — ');

  return (
    <Link to={`/prognoz/${post.id}`}>
      <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/70 transition-all hover:-translate-y-3 cursor-pointer">
        <div className="px-7 pt-7 pb-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-4">
            {post.team_logo1 ? <img src={post.team_logo1} alt={home} className="w-9 h-9 rounded-full object-contain" /> : <div className="w-9 h-9 bg-red-600 rounded-full" />}
            <div className="font-bold text-xl tracking-tight">{home}</div>
          </div>
          <div className="text-red-600 font-black text-5xl">VS</div>
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="font-bold text-xl tracking-tight text-right">{away}</div>
            {post.team_logo2 ? <img src={post.team_logo2} alt={away} className="w-9 h-9 rounded-full object-contain" /> : <div className="w-9 h-9 bg-blue-600 rounded-full" />}
          </div>
        </div>

        <div className="p-7 bg-zinc-950">
          <div className="uppercase text-red-500 text-xs tracking-[2px]">НАШ ПРОГНОЗ</div>
          <div className="text-4xl font-bold mt-3">{post.bet}</div>
          {post.odds && <div className="text-emerald-400 text-3xl font-semibold mt-2">@{post.odds}</div>}
        </div>

        <div className="px-7 py-5 text-sm text-zinc-400 flex justify-between border-t border-zinc-800">
          <div>{new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} г.</div>
          <div className="font-mono">актуально</div>
        </div>
      </div>
    </Link>
  );
}

export default PredictionCard;
