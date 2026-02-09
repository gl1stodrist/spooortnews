import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const categories = ["Футбол", "Хоккей", "Теннис", "Бокс", "ММА", "Баскетбол"];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans">
      {/* HEADER — ТОЛЬКО НАЗВАНИЕ И КНОПКА */}
      <header className="border-b border-white/10 bg-[#161920] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">
            PRO-SPORTS
          </h1>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-none px-6 font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "ЗАГРУЗКА..." : "ОБНОВИТЬ ЛЕНТУ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* ОСНОВНАЯ ЛЕНТА НОВОСТЕЙ */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-[#1a1d24] border border-white/5 overflow-hidden hover:border-red-600/50 transition-all duration-300">
                <div className="relative h-56">
                  <img 
                    src={post.image_url} 
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                    alt=""
                  />
                  <div className="absolute top-4 left-4 bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-tighter shadow-xl">
                    HOT NEWS
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">
                    <span className="text-red-500">{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> {Math.floor(Math.random() * 40 + 5)}K</span>
                  </div>
                  <h2 className="text-xl font-black leading-tight mb-4 uppercase italic tracking-tight group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed opacity-80">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SIDEBAR С КАТЕГОРИЯМИ (SEO) */}
        <aside className="w-full lg:w-72 space-y-6">
          <div className="bg-[#1a1d24] p-6 border-t-2 border-red-600 shadow-2xl">
            <h3 className="flex items-center gap-2 font-black mb-6 uppercase text-xs tracking-[0.2em] text-gray-300">
              <Flame size={16} className="text-red-500" /> РАЗДЕЛЫ
            </h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat} className="border-b border-white/5 pb-2 last:border-0">
                  <a href="#" className="flex justify-between items-center text-sm font-bold text-gray-400 hover:text-white transition-colors group">
                    <span>{cat}</span>
                    <ChevronRight size={14} className="text-red-600 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1a1d24] p-6 border-l-2 border-gray-700">
            <h3 className="font-black mb-4 uppercase text-xs tracking-widest text-gray-500">ПОПУЛЯРНОЕ</h3>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase italic leading-tight hover:text-red-500 cursor-pointer">Трансферное окно: все главные сделки зимы</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase italic leading-tight hover:text-red-500 cursor-pointer">Лига чемпионов возвращается: превью матчей</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
