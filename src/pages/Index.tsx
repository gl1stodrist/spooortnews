import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Flame, ChevronRight, X, Eye, Trophy, Activity, Zap } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);

  const API_KEY = "c29025d0c657464baeaa88a7f6159511";

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch('https://api.football-data.org/v4/matches', {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const data = await response.json();
      
      if (data.matches && data.matches.length > 0) {
        setLiveMatches(data.matches.slice(0, 5));
      } else {
        // Если матчей сейчас нет, показываем фейковые для визуала и доверия
        setLiveMatches([
          { id: 101, competition: { name: "Champions League" }, homeTeam: { shortName: "Real Madrid" }, awayTeam: { shortName: "Man City" }, status: "TIMED", score: { fullTime: { home: null, away: null } }, utcDate: "21:45" },
          { id: 102, competition: { name: "Premier League" }, homeTeam: { shortName: "Liverpool" }, awayTeam: { shortName: "Chelsea" }, status: "IN_PLAY", score: { fullTime: { home: 1, away: 0 } }, utcDate: "LIVE" }
        ]);
      }
    } catch (err) {
      console.error("Live fetch error", err);
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
    const interval = setInterval(fetchLiveMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";
  const B_CHIPS = "/banner_chips.png"; 
  const B_RONALDINHO = "/banner_ronaldinho.png";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      {/* СТИКИ БАННЕР */}
      <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] sticky top-0 z-[100] hover:bg-white transition-all">
        WINLINE: ТВОЙ ФРИБЕТ 3000 РУБЛЕЙ ЗДЕСЬ ⚡️ ЗАБРАТЬ
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black text-2xl italic shadow-[0_0_20px_rgba(220,38,38,0.5)]">S</div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none px-6">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ЗАГРУЗКА ИНСАЙДОВ..." : "ОБНОВИТЬ ИНСАЙДЫ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* ЛЕНТА НОВОСТЕЙ */}
        <div className="flex-1 space-y-8">
          {posts.map((post, index) => (
            <div key={post.id} className="space-y-8">
              <article className="bg-[#161920] border border-white/5 group hover:border-red-600/30 transition-all shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden cursor-pointer min-h-[220px]" onClick={() => setSelectedPost(post)}>
                  <img src={post.image_url} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase shadow-lg flex items-center gap-1">
                    <Zap size={10} fill="white" /> ИНСАЙД
                  </div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase">
                      <span className="text-red-600">{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={12}/> {Math.floor(Math.random() * 5000 + 1000)}</span>
                    </div>
                    <h2 onClick={() => setSelectedPost(post)} className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-500 cursor-pointer transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(post)} className="mt-8 text-red-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                    ЧИТАТЬ ПОЛНОСТЬЮ <ChevronRight size={14}/>
                  </button>
                </div>
              </article>

              {/* РЕКЛАМНЫЙ БАННЕР */}
              {(index + 1) % 3 === 0 && (
                <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full border-2 border-[#ff5c00] hover:scale-[1.01] transition-all overflow-hidden rounded-sm shadow-xl shadow-orange-600/10">
                  <img src={index % 2 === 0 ? B_CHIPS : B_RONALDINHO} alt="Winline" className="w-full h-auto" />
                </a>
              )}
            </div>
          ))}
        </div>
