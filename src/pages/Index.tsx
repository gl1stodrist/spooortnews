import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, MessageSquare } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

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
      {/* ВЕРХНИЙ БАННЕР WINLINE (SEO + EARN) */}
      <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" target="_blank" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors">
        Winline: Забирай фрибет 3000 рублей прямо сейчас! ⚡️
      </a>

      <header className="border-b border-white/10 bg-[#161920] sticky top-0 z-50 shadow-2xl">
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
            <article key={post.id} className="bg-[#1a1d24] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
              <div className="relative h-[400px]">
                <img src={post.image_url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase italic">Срочно</span>
                    <span className="text-gray-400 text-xs font-bold uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase italic leading-none mb-4">{post.title}</h2>
                </div>
              </div>
              
              <div className="p-8 pt-2">
                {/* ТЕКСТ НОВОСТИ */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6 italic font-medium border-l-4 border-red-600 pl-6">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-6 text-gray-500 font-bold text-xs">
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2"><TrendingUp size={14} className="text-red-500"/> 4.2K просмотров</span>
                    <span className="flex items-center gap-2"><MessageSquare size={14}/> 12 комментариев</span>
                  </div>
                  <button className="text-red-500 uppercase tracking-widest hover:underline">Читать полностью →</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          {/* WINLINE SIDEBAR */}
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" target="_blank" className="block bg-[#1a1d24] p-1 border-2 border-[#ff5c00] hover:scale-[1.02] transition-transform">
             <div className="bg-[#ff5c00] p-4 text-center">
                <span className="block text-black font-black text-2xl italic tracking-tighter uppercase">Winline</span>
                <span className="block text-white font-bold text-[10px] uppercase mt-1">Лучшие коэффициенты тут</span>
             </div>
          </a>

          <div className="bg-[#161920] p-6 border-t-2 border-red-600">
            <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Flame size={16} className="text-red-600" /> Популярное
            </h3>
            <div className="space-y-6">
              {posts.slice(0, 5).map(p => (
                <div key={p.id} className="flex gap-3 group cursor-pointer">
                  <div className="w-16 h-16 shrink-0 bg-gray-800 overflow-hidden">
                    <img src={p.image_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-red-500">{p.title}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
