import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight, Search } from "lucide-react";

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

  const navLinks = ["Футбол", "Баскетбол", "Хоккей", "Теннис", "Автоспорт", "Единоборства", "Олимпиада"];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5] font-sans">
      {/* ВЕРХНЯЯ ПОЛОСКА С ДАТОЙ */}
      <div className="bg-[#1a1a1a] text-[10px] text-gray-500 py-2 border-b border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>9 февраля 2026</span>
            <span className="flex items-center gap-1 text-red-500 font-bold italic"><TrendingUp size={10}/> Топ: Эль-Класико</span>
          </div>
          <div className="flex gap-4 uppercase font-bold tracking-tighter hover:text-white cursor-pointer">
            <span>О нас</span>
            <span>Контакты</span>
          </div>
        </div>
      </div>

      {/* ГЛАВНАЯ ШАПКА */}
      <header className="bg-[#121212] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-1 font-black italic rounded-sm text-lg">S</div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">SPORTNEWS</h1>
            </div>
            <nav className="hidden lg:flex gap-5">
              {navLinks.map(link => (
                <a key={link} href="#" className="text-[11px] font-bold uppercase tracking-tight text-gray-400 hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Search size={18} className="text-gray-500 cursor-pointer hover:text-white" />
            <Button onClick={handleUpdate} disabled={isUpdating} className="bg-red-600 hover:bg-red-700 text-[11px] font-black uppercase px-4 h-9">
              {isUpdating ? "..." : "Обновить ленту"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Хлебные крошки */}
        <div className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest flex gap-2 items-center">
          <span>Главная</span> <ChevronRight size={10}/> <span className="text-red-600">Футбол</span>
        </div>
        
        <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">ФУТБОЛ</h2>
        <p className="text-gray-500 text-xs font-bold mb-10 tracking-wide uppercase italic">Последние новости из мира футбола</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* СЕТКА НОВОСТЕЙ */}
          <div className="flex-1 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
              {posts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="relative aspect-[16/10] mb-5 overflow-hidden rounded-sm">
                    <img src={post.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-[#1e4620] text-[10px] font-black px-2 py-1 uppercase italic tracking-tighter">Футбол</span>
                      <span className="bg-red-600 text-white p-1 rounded-full"><Flame size={12}/></span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black uppercase italic leading-[1.1] mb-3 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-snug line-clamp-2 mb-4 font-medium italic">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    <span>4 февраля 2026</span>
                    <span className="flex items-center gap-1"><TrendingUp size={10}/> 3K</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* САЙДБАР С ВАШИМ БАННЕРОМ WINLINE */}
          <aside className="w-full lg:w-80 space-y-8">
            {/* БАННЕР WINLINE */}
            <a 
              href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group relative overflow-hidden bg-[#ff5c00] rounded-sm p-4 h-24 flex items-center justify-between border-2 border-[#ff5c00] hover:bg-black transition-all"
            >
              <div className="z-10">
                <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black italic rounded-sm mb-1 group-hover:bg-[#ff5c00]">WIN</div>
                <div className="text-black font-black text-lg italic uppercase leading-none group-hover:text-white">ФРИБЕТ 3000</div>
                <div className="text-black/60 text-[8px] font-bold uppercase tracking-widest group-hover:text-white/60">Новым игрокам</div>
              </div>
              <ChevronRight className="text-black group-hover:text-white transition-transform group-hover:translate-x-2" size={32} />
            </a>

            {/* БЛОК ГОРЯЧЕЕ */}
            <div className="bg-[#161616] p-5 rounded-sm">
              <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-6 italic">
                <Flame size={14} className="text-red-600" /> Горячее
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex gap-3 group cursor-pointer">
                    <img src={post.image_url} className="w-16 h-12 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div className="flex-1">
                      <span className="bg-[#1e4620] text-[8px] font-bold px-1 py-0.5 uppercase mb-1 inline-block">Футбол</span>
                      <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                        {post.title}
                      </p>
                      <span className="text-[8px] text-gray-700 font-bold mt-1 block">3K ПРОСМОТРОВ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
