import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, X, Eye } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

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
      console.error("Update failed:", err);
    }
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";
  
  // Локальные пути к твоим баннерам в папке public
  const B_CHIPS = "/banner_chips.png"; 
  const B_RONALDINHO = "/banner_ronaldinho.png";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      {/* ЛИПКАЯ ШАПКА WINLINE */}
      <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] sticky top-0 z-[100] hover:bg-white transition-all shadow-[0_5px_20px_rgba(255,92,0,0.3)]">
        WINLINE: ТВОЙ ФРИБЕТ 3000 РУБЛЕЙ ЗДЕСЬ ⚡️ ЗАБРАТЬ СЕЙЧАС
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="S" className="w-8 h-8 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none px-6 transition-all active:scale-95">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ОБНОВЛЯЕМ..." : "ОБНОВИТЬ ИНСАЙДЫ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {posts.map((post, index) => (
            <div key={post.id} className="space-y-8">
              <article className="bg-[#161920] border border-white/5 group hover:border-red-600/30 transition-all shadow-xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden cursor-pointer min-h-[220px]" onClick={() => setSelectedPost(post)}>
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase">ИНСАЙД</div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span className="text-red-600">{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={12}/> {Math.floor(Math.random() * 5000 + 1000)}</span>
                    </div>
                    <h2 onClick={() => setSelectedPost(post)} className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-500 cursor-pointer transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(post)} className="mt-8 text-red-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                    ЧИТАТЬ ПОЛНЫЙ ТЕКСТ <ChevronRight size={14}/>
                  </button>
                </div>
              </article>

              {/* БАННЕР В ЛЕНТЕ КАЖДЫЕ 3 НОВОСТИ */}
              {(index + 1) % 3 === 0 && (
                <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full border-2 border-[#ff5c00] hover:scale-[1.01] transition-transform overflow-hidden rounded-sm shadow-orange-500/20 shadow-2xl">
                  <img src={index % 2 === 0 ? B_CHIPS : B_RONALDINHO} alt="Winline" className="w-full h-auto" />
                </a>
              )}
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <div className="sticky top-32 space-y-6">
            <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#161920] p-1 border-2 border-[#ff5c00] hover:scale-[1.03] transition-transform shadow-lg">
              <div className="bg-[#ff5c00] p-6 text-center shadow-inner">
                <span className="block text-black font-black text-4xl italic uppercase leading-none">WINLINE</span>
                <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽</span>
              </div>
            </a>
            
            <div className="bg-[#161920] p-6 border-t-2 border-red-600 shadow-xl">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400 italic">
                <Flame size={14} className="text-red-600" /> ПОПУЛЯРНОЕ
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 5).map(p => (
                  <div key={p.id} onClick={() => setSelectedPost(p)} className="cursor-pointer group flex gap-3 border-b border-white/5 pb-4 last:border-0">
                    <div className="w-12 h-12 shrink-0 bg-gray-800 overflow-hidden rounded-sm">
                      <img src={p.image_url} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors line-clamp-2">{p.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-[#161920] max-w-5xl w-full my-auto border border-white/10 shadow-2xl flex flex-col md:flex-row rounded-sm overflow-hidden">
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-white hover:text-red-500 z-10 p-2 bg-black/50 rounded-full transition-colors">
              <X size={24} />
            </button>
            <div className="md:w-2/3 p-6 md:p-12 border-r border-white/5 bg-[#1a1d24]">
              <img src={selectedPost.image_url} className="w-full h-72 object-cover mb-8 shadow-2xl border border-white/5 rounded-sm" alt="" />
              <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8 leading-tight tracking-tighter">{selectedPost.title}</h2>
              
              {/* БАННЕР ВНУТРИ НОВОСТИ ДЛЯ КОНВЕРСИИ */}
              <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block mb-8 border-2 border-[#ff5c00] hover:scale-[1.01] transition-transform shadow-xl">
                 <img src={B_RONALDINHO} alt="Winline" className="w-full h-auto" />
              </a>

              <div className="text-gray-300 text-lg leading-relaxed space-y-6 mb-12 italic border-l-4 border-red-600 pl-6 bg-white/5 py-4 pr-4">
                {selectedPost.excerpt}
              </div>
              <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#ff5c00] text-black text-center py-6 font-black uppercase italic text-2xl hover:bg-white transition-all shadow-orange-600/40 shadow-2xl">
                ПОСТАВИТЬ В WINLINE (ФРИБЕТ 3000₽) 🚀
              </a>
            </div>
            <div className="md:w-1/3 p-8 bg-black/40 hidden md:block">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-8 text-red-500 underline decoration-2 underline-offset-8 italic">ЕЩЕ ИНСАЙДЫ:</h3>
              <div className="space-y-8">
                {posts.filter(p => p.id !== selectedPost.id).slice(0, 4).map(p => (
                  <div key={p.id} onClick={() => setSelectedPost(p)} className="cursor-pointer group border-b border-white/5 pb-6 last:border-0">
                    <img src={p.image_url} alt="" className="w-full h-24 object-cover mb-4 grayscale group-hover:grayscale-0 transition-all border border-white/5" />
                    <h4 className="text-[11px] font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors">{p.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
