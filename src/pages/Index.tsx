import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, MessageSquare, X } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null); // Состояние для открытой новости

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans">
      {/* ЛИПКИЙ БАННЕР WINLINE */}
      <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" target="_blank" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors sticky top-0 z-[60]">
        Winline: Забирай фрибет 3000 рублей прямо сейчас! ⚡️
      </a>

      <header className="border-b border-white/10 bg-[#161920] sticky top-[32px] z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">PRO-SPORTS</h1>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-bold h-9">
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} /> Обновить
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="bg-[#1a1d24] rounded-sm overflow-hidden border border-white/5 shadow-2xl group">
              <div className="relative h-[350px] cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img src={post.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-black uppercase italic leading-none mb-2">{post.title}</h2>
                  <span className="text-gray-400 text-xs font-bold uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="p-8 pt-4">
                <p className="text-gray-400 text-base leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex gap-6 text-gray-600 font-bold text-[10px] uppercase">
                    <span className="flex items-center gap-1"><TrendingUp size={14} className="text-red-500"/> 4.2K</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14}/> 12</span>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Читать полностью →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" target="_blank" className="block bg-[#1a1d24] p-1 border-2 border-[#ff5c00] sticky top-24">
             <div className="bg-[#ff5c00] p-6 text-center">
                <span className="block text-black font-black text-3xl italic tracking-tighter uppercase">Winline</span>
                <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽</span>
             </div>
          </a>
        </aside>
      </main>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ЧТЕНИЯ НОВОСТИ */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-[#1a1d24] max-w-3xl w-full my-auto border border-white/10 shadow-2xl">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors flex items-center gap-2 font-bold uppercase text-xs"
            >
              Закрыть <X size={24} />
            </button>
            
            <img src={selectedPost.image_url} className="w-full h-64 md:h-96 object-cover" alt="" />
            
            <div className="p-6 md:p-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic mb-6 leading-tight">
                {selectedPost.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic mb-8 border-l-4 border-red-600 pl-6">
                  {selectedPost.excerpt}
                </p>
                <p className="text-gray-400 text-sm mb-10">
                  Полная аналитика и эксклюзивные подробности доступны только в нашем Telegram-канале и на сайте официального партнера.
                </p>
              </div>

              <a 
                href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" 
                target="_blank"
                className="block w-full bg-[#ff5c00] text-black text-center py-4 font-black uppercase italic text-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(255,92,0,0.3)]"
              >
                Сделать ставку на этот матч в Winline 🚀
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
