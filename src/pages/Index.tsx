import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, X, Eye, MessageSquare } from "lucide-react";

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
      console.error("Update failed", err);
    }
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      {/* ЛИПКИЙ БАННЕР */}
      <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all sticky top-0 z-[100]">
        WINLINE: ТВОЙ ФРИБЕТ 3000 РУБЛЕЙ ЗДЕСЬ ⚡️
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="S" className="w-8 h-8 rounded-full" />
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none px-6">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ЗАГРУЗКА..." : "ОБНОВИТЬ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {posts.length > 0 ? posts.map((post) => (
            <article key={post.id} className="bg-[#161920] border border-white/5 group hover:border-red-600/30 transition-all shadow-xl rounded-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden cursor-pointer h-52 md:h-auto" onClick={() => setSelectedPost(post)}>
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
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
              </div>
            </article>
          )) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 text-gray-600 font-bold uppercase tracking-widest">
              Нажми "Обновить", чтобы загрузить свежие новости
            </div>
          )}
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <div className="sticky top-32 space-y-6">
            <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block bg-[#161920] p-1 border-2 border-[#ff5c00] hover:scale-[1.03] transition-transform">
              <div className="bg-[#ff5c00] p-6 text-center">
                <span className="block text-black font-black text-4xl italic uppercase leading-none">WINLINE</span>
                <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽</span>
              </div>
            </a>
            
            <div className="bg-[#161920] p-6 border-t-2 border-red-600">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400">
                <Flame size={14} className="text-red-600" /> ПОПУЛЯРНОЕ
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 4).map(p => (
                  <div key={p.id} onClick={() => setSelectedPost(p)} className="cursor-pointer group flex gap-3 border-b border-white/5 pb-4 last:border-0">
                    <div className="w-12 h-12 shrink-0 bg-gray-800 overflow-hidden">
                      <img src={p.image_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                    </div>
                    <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors line-clamp-2">{p.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* МОДАЛКА */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-[#161920] max-w-5xl w-full my-auto border border-white/10 shadow-2xl flex flex-col md:flex-row rounded-sm overflow-hidden">
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-white hover:text-red-500 z-10 p-2 bg-black/50 rounded-full transition-colors">
              <X size={24} />
            </button>
            
            <div className="md:w-2/3 p-6 md:p-12 border-r border-white/5 bg-[#1a1d24]">
              <img src={selectedPost.image_url} className="w-full h-72 object-cover mb-8 shadow-2xl border border-white/5" alt="" />
              <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8 leading-tight tracking-tighter">{selectedPost.title}</h2>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6 mb-12 italic border-l-4 border-red-600 pl-6">
                {selectedPost.excerpt}
              </div>
              <a href={WINLINE_URL} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#ff5c00] text-black text-center py-6 font-black uppercase italic text-2xl hover:bg-white transition-all shadow-[0_0_50px_rgba(255,92,0,0.3)]">
                СТАВИТЬ В WINLINE (ФРИБЕТ 3000₽)
              </a>
            </div>

            <div className="md:w-1/3 p-8 bg-black/40">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-8 text-red-500">ЧИТАЙТЕ ТАКЖЕ:</h3>
              <div className="space-y-8">
                {posts.filter(p => p.id !== selectedPost.id).slice(0, 3).map(p => (
                  <div key={p.id} onClick={() => setSelectedPost(p)} className="cursor-pointer group border-b border-white/5 pb-6 last:border-0">
                    <img src={p.image_url} className="w-full h-28 object-cover mb-4 grayscale group-hover:grayscale-0 transition-all border border-white/5" />
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
