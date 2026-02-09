import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans">
      {/* Шапка в твоем стиле */}
      <header className="border-b border-white/10 bg-[#161920]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            PRO-SPORTS <span className="text-red-600">AI</span>
          </h1>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 transition-all active:scale-95"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            Обновить ленту
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Основная лента новостей */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="group bg-[#1a1d24] rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 shadow-2xl">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image_url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {post.tags?.[0] || "Спорт"}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> 89K</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Сайдбар (Горячее/Популярное) */}
        <aside className="w-80 hidden lg:block space-y-6">
          <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
            <h3 className="flex items-center gap-2 font-bold mb-4 uppercase text-sm tracking-widest">
              <Flame size={16} className="text-red-500" /> Горячее
            </h3>
            <p className="text-gray-500 text-xs">Нет горячих новостей</p>
          </div>
          <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
            <h3 className="flex items-center gap-2 font-bold mb-4 uppercase text-sm tracking-widest text-blue-400">
              <TrendingUp size={16} /> Популярное
            </h3>
            <p className="text-gray-500 text-xs">Нет популярных новостей</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
