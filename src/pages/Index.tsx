import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Flame, ChevronRight, X, Eye, Trophy, Activity } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);

  // Твой API Ключ от football-data.org (вставь его сюда)
  const FOOTBALL_API_KEY = "ТВОЙ_КЛЮЧ_ОТСЮДА";

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const fetchLiveMatches = async () => {
    try {
      // Запрашиваем матчи на сегодня
      const response = await fetch('https://api.football-data.org/v4/matches', {
        headers: { 'X-Auth-Token': c29025d0c657464baeaa88a7f6159511 }
      });
      const data = await response.json();
      // Берем первые 5 матчей, которые идут сейчас или скоро начнутся
      setLiveMatches(data.matches?.slice(0, 5) || []);
    } catch (err) {
      console.error("Live score fetch failed", err);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchLiveMatches();
    // Обновляем счета раз в минуту
    const interval = setInterval(fetchLiveMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";
  const B_CHIPS = "/banner_chips.png"; 
  const B_RONALDINHO = "/banner_ronaldinho.png";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] sticky top-0 z-[100] hover:bg-white transition-all">
        WINLINE: ТВОЙ ФРИБЕТ 3000 РУБЛЕЙ ЗДЕСЬ ⚡️ ЗАБРАТЬ
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="S" className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none px-6">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ОБНОВЛЕНИЕ..." : "ОБНОВИТЬ ИНСАЙДЫ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {posts.map((post, index) => (
            <div key={post.id} className="space-y-8">
              <article className="bg-[#161920] border border-white/5 group hover:border-red-600/30 transition-all shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden cursor-pointer min-h-[220px]" onClick={() => setSelectedPost(post)}>
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase shadow-lg">ИНСАЙД</div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase">
                      <span className="text-red-600">{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={12}/> {Math.floor(Math.random() * 5000 + 1000)}</span>
                    </div>
                    <h2 onClick={() => setSelectedPost(post)} className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-500 cursor-pointer">{post.title}</h2>
                    <p className="text-gray-400 text-sm line-clamp-2 italic">{post.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(post)} className="mt-8 text-red-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                    ЧИТАТЬ ПОЛНЫЙ ТЕКСТ <ChevronRight size={14}/>
                  </button>
                </div>
              </article>

              {(index + 1) % 3 === 0 && (
                <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full border-2 border-[#ff5c00] hover:opacity-90 transition-all overflow-hidden rounded-sm shadow-lg">
                  <img src={index % 2 === 0 ? B_CHIPS : B_RONALDINHO} alt="Winline" className="w-full h-auto" />
                </a>
              )}
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <div className="sticky top-32 space-y-6">
            
            {/* LIVE РЕЗУЛЬТАТЫ С API */}
            <div className="bg-[#161920] border border-white/5 p-6 rounded-sm shadow-xl">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-red-600 italic">
                <Activity size={14} className="animate-pulse" /> LIVE ТАБЛО
              </h3>
              <div className="space-y-4">
                {liveMatches.length > 0 ? liveMatches.map((match: any) => (
                  <div key={match.id} className="bg-black/40 p-3 border-l-2 border-red-600 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase">
                      <span>{match.competition.name}</span>
                      {match.status === 'IN_PLAY' && <span className="text-red-600 animate-pulse">LIVE</span>}
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase italic">
                      <span>{match.homeTeam.shortName} - {match.awayTeam.shortName}</span>
                      <span className="text-red-500">
                        {match.score.fullTime.home !== null ? `${match.score.fullTime.home}:${match.score.fullTime.away}` : 'VS'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] text-gray-500 font-bold italic">Матчей сейчас нет...</p>
                )}
              </div>
            </div>

            <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] p-6 text-center shadow-lg hover:scale-105 transition-transform">
              <span className="block text-black font-black text-4xl italic uppercase leading-none">WINLINE</span>
              <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽</span>
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
