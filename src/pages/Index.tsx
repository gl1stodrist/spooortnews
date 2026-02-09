import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, Hash } from "lucide-react";

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

  // Список категорий для SEO-сайдбара
  const categories = ["Футбол", "Хоккей", "Трансферы", "Прогнозы", "ММА", "Теннис"];

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white font-sans selection:bg-red-600/30">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#12151c]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              PRO-SPORTS <span className="text-red-600 underline decoration-2 underline-offset-4">AI</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-red-500 transition-colors">Главная</a>
              <a href="#" className="hover:text-red-500 transition-colors">Аналитика</a>
              <a href="#" className="hover:text-red-500 transition-colors">PRO-Подписка</a>
            </nav>
          </div>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-none px-8 font-black uppercase italic transition-all hover:skew-x-[-10deg] active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "Анализ..." : "Обновить ленту"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* ЛЕНТА НОВОСТЕЙ (SEO Optimized) */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-red-600"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Последние инсайды</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative aspect-video overflow-hidden bg-slate-800">
                  <img 
                    src={post.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-90 group-hover:opacity-100"
                    alt={post.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-red-600 text-[10px] font-black px-3 py-1 uppercase tracking-tighter shadow-lg">
                      HOT
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-[10px] font-black px-3 py-1 uppercase tracking-tighter">
                      AI-ANALYSIS
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    <time>{new Date(post.created_at).toLocaleDateString()}</time>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={12}/> {Math.floor(Math.random() * 50 + 10)}K READS</span>
                  </div>
                  <h3 className="text-xl font-black leading-tight group-hover:text-red-500 transition-colors uppercase italic decoration-red-600 decoration-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium opacity-70">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SIDEBAR (SEO & CATEGORIES) */}
        <aside className="w-full lg:w-80 space-y-10">
          {/* Категории */}
          <section className="bg-[#12151c] p-8 border-l-4 border-red-600 shadow-xl">
            <h3 className="flex items-center gap-2 font-black mb-8 uppercase text-xs tracking-[0.2em] text-white">
              <Hash size={16} className="text-red-500" /> Разделы
            </h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat}>
                  <a href="#" className="flex justify-between items-center text-sm font-bold text-gray-400 hover:text-white transition-colors group">
                    <span>{cat}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-red-600" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Популярные теги */}
          <section>
            <h3 className="flex items-center gap-2 font-black mb-6 uppercase text-xs tracking-[0.2em] text-gray-500">
              <Flame size={16} className="text-red-500" /> Тренды дня
            </h3>
            <div className="flex flex-wrap gap-2">
              {["#РПЛ", "#Трансферы", "#Мбаппе", "#ЛигаЧемпионов", "#Спартак", "#Овечкин"].map(tag => (
                <span key={tag} className="text-[10px] font-bold bg-white/5 px-3 py-2 hover:bg-red-600 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* PRO BANNER */}
          <div className="bg-gradient-to-br from-red-700 to-red-900 p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-2xl mb-2 italic uppercase leading-none">PRO<br/>ACCESS</h3>
              <p className="text-white/70 text-[10px] font-bold uppercase mb-6 tracking-widest">Эксклюзивные инсайды</p>
              <button className="w-full bg-white text-black font-black py-3 text-xs uppercase italic hover:bg-gray-200 transition-colors">Подписаться</button>
            </div>
            <TrendingUp className="absolute -bottom-4 -right-4 text-black/20 w-32 h-32 rotate-[-20deg] group-hover:scale-110 transition-transform" />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
