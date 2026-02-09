import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Загружаем новости из твоей базы
  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  // Кнопка обновления
  const handleUpdate = async () => {
    setIsUpdating(true);
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans">
      {/* ТВОЯ СТАРАЯ ШАПКА */}
      <header className="border-b border-white/10 bg-[#161920]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            PRO-SPORTS <span className="text-red-600">AI</span>
          </h1>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 font-bold shadow-lg shadow-red-600/20"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "ОБНОВЛЕНИЕ..." : "ОБНОВИТЬ ЛЕНТУ"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        <div className="flex-1">
          {/* СЕТКА НОВОСТЕЙ В ТВОЕМ СТИЛЕ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="group bg-[#1a1d24] rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/40 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={post.image_url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"} 
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">
                    {post.tags?.[0] || "HOT NEWS"}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 mb-4 uppercase tracking-widest">
                    <span className="text-red-500">{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> {Math.floor(Math.random() * 90 + 10)}K</span>
                  </div>
                  <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-red-500 transition-colors uppercase italic">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 font-medium opacity-80">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ТВОЙ СТАРАЙ САЙДБАР */}
        <aside className="w-80 hidden lg:block space-y-6">
          <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
            <h3 className="flex items-center gap-2 font-black mb-6 uppercase text-xs tracking-[0.2em] text-gray-300">
              <Flame size={16} className="text-red-500" /> ГОРЯЧЕЕ
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-[11px] font-bold uppercase italic">Нет данных для анализа</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white">
            <h3 className="font-black text-lg mb-2 italic uppercase">Premium Access</h3>
            <p className="text-white/80 text-xs font-bold">Получи доступ к эксклюзивным прогнозам от ИИ</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
