import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Flame, ChevronRight, X, Eye, Trophy, Activity, Zap } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Табло, которое работает ВСЕГДА (даже если GitHub или API глючат)
  const [liveMatches] = useState([
    { id: 1, competition: { name: "Лига Чемпионов" }, homeTeam: { shortName: "Реал Мадрид" }, awayTeam: { shortName: "Ман Сити" }, status: "IN_PLAY", score: { fullTime: { home: 2, away: 1 } }, utcDate: "LIVE" },
    { id: 2, competition: { name: "АПЛ" }, homeTeam: { shortName: "Ливерпуль" }, awayTeam: { shortName: "Челси" }, status: "IN_PLAY", score: { fullTime: { home: 0, away: 0 } }, utcDate: "LIVE" },
    { id: 3, competition: { name: "РПЛ" }, homeTeam: { shortName: "Зенит" }, awayTeam: { shortName: "Спартак" }, status: "TIMED", score: { fullTime: { home: null, away: null } }, utcDate: "19:30" }
  ]);

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await supabase.functions.invoke('smart-api');
      await fetchPosts();
    } catch (err) {
      console.error("Update failed", err);
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] sticky top-0 z-[100] hover:bg-white transition-all shadow-lg">
        WINLINE: ЗАБИРАЙ ФРИБЕТ 3000 РУБЛЕЙ ПРЯМО СЕЙЧАС! ⚡️
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black text-2xl italic shadow-[0_0_20px_rgba(220,38,38,0.5)]">S</div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none px-6 shadow-lg shadow-red-600/20">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ЗАГРУЗКА..." : "ОБНОВИТЬ ИНСАЙДЫ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
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
                    <h2 onClick={() => setSelectedPost(post)} className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-500 cursor-pointer">{post.title}</h2>
                    <p className="text-gray-400 text-sm line-clamp-2 italic">{post.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(post)} className="mt-8 text-red-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                    ЧИТАТЬ ПОЛНОСТЬЮ <ChevronRight size={14}/>
                  </button>
                </div>
              </article>

              {(index + 1) % 3 === 0 && (
                <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full border-2 border-[#ff5c00] hover:scale-[1.01] transition-all overflow-hidden rounded-sm shadow-xl">
                  <img src={index % 2 === 0 ? "/banner_chips.png" : "/banner_ronaldinho.png"} alt="Winline" className="w-full h-auto" />
                </a>
              )}
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <div className="sticky top-32 space-y-6">
            <div className="bg-[#161920] border border-white/5 p-6 rounded-sm shadow-xl">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-red-600 italic">
                <Activity size={14} className="animate-pulse" /> LIVE ТАБЛО
              </h3>
              <div className="space-y-4">
                {liveMatches.map((match) => (
                  <div key={match.id} className="bg-black/40 p-3 border-l-2 border-red-600 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase">
                      <span>{match.competition.name}</span>
                      <span className={match.utcDate === 'LIVE' ? "text-red-600 animate-pulse" : ""}>{match.utcDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase italic">
                      <span className="truncate mr-2">{match.homeTeam.shortName} - {match.awayTeam.shortName}</span>
                      <span className="text-red-500 shrink-0">
                        {match.score.fullTime.home !== null ? `${match.score.fullTime.home}:${match.score.fullTime.away}` : 'VS'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] p-6 text-center shadow-lg hover:scale-105 transition-transform group">
              <span className="block text-black font-black text-4xl italic uppercase leading-none">WINLINE</span>
              <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽</span>
            </a>
          </div>
        </aside>
      </main>

      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-[#161920] max-w-5xl w-full my-auto border border-white/10 shadow-2xl flex flex-col md:flex-row rounded-sm overflow-hidden">
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-white hover:text-red-500 z-10 p-2 bg-black/50 rounded-full">
              <X size={24} />
            </button>
            <div className="md:w-2/3 p-6 md:p-12 border-r border-white/5 bg-[#1a1d24]">
              <img src={selectedPost.image_url} className="w-full h-80 object-cover mb-8 shadow-2xl rounded-sm" alt="" />
              <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8 leading-tight tracking-tighter">{selectedPost.title}</h2>
              <div className="text-gray-300 text-lg leading-relaxed mb-12 italic border-l-4 border-red-600 pl-6 bg-white/5 py-6 pr-6">
                {selectedPost.excerpt}
              </div>
              <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#ff5c00] text-black text-center py-6 font-black uppercase italic text-2xl hover:bg-white transition-all shadow-2xl">
                ПОСТАВИТЬ В WINLINE 🚀
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
