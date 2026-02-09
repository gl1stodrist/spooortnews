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
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const WINLINE_URL = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans selection:bg-red-600">
      {/* ТОР-БАННЕР */}
      <a href={WINLINE_URL} target="_blank" className="block bg-[#ff5c00] text-black text-center py-2 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all sticky top-0 z-[100]">
        WINLINE: ТВОЙ ФРИБЕТ 3000 РУБЛЕЙ ЗДЕСЬ ⚡️ ЗАБРАТЬ
      </a>

      <header className="border-b border-white/5 bg-[#161920]/90 backdrop-blur-md sticky top-[34px] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-red-600">PRO-SPORTS</h1>
          <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] h-9 rounded-none">
            <RefreshCw size={14} className={`mr-2 ${isUpdating ? "animate-spin" : ""}`} /> 
            {isUpdating ? "ОБРАБОТКА..." : "ОБНОВИТЬ ИНСАЙДЫ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-[#161920] border border-white/5 group hover:border-red-600/30 transition-all shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 min-h-[200px]" />
                  <div className="absolute top-0 left-0 bg-red-600 px-3 py-1 text-[10px] font-black uppercase">LIVE</div>
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-500 uppercase">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={12} className="text-red-500"/> {Math.floor(Math.random() * 5000 + 1000)}</span>
                    </div>
                    <h2 onClick={() => setSelectedPost(post)} className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-500 cursor-pointer transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2 italic leading-relaxed">{post.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(post)} className="mt-6 text-red-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                    Читать полный разбор <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="sticky top-32 space-y-6">
            <a href={WINLINE_URL} target="_blank" className="block bg-[#161920] p-1 border-2 border-[#ff5c00] hover:scale-[1.03] transition-transform">
              <div className="bg-[#ff5c00] p-6 text-center">
                <span className="block text-black font-black text-4xl italic uppercase leading-none">WINLINE</span>
                <span className="block text-white font-bold text-[10px] uppercase mt-2 bg-black py-1">ФРИБЕТ 3000₽ ВСЕМ</span>
              </div>
            </a>
            
            <div className="bg-[#161920] p-6 border-t-2 border-red-600">
              <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400">
                <Flame size={14} className="text-red-600" /> ПОПУЛЯРНОЕ СЕЙЧАС
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 4).map(p
