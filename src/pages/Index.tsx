import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setPosts(data as Post[]);
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            SPOOORT<span className="text-red-600">NEWS</span>
          </h1>
          <nav className="flex gap-8 text-xs font-bold tracking-widest text-zinc-500">
            <span className="hover:text-white cursor-pointer transition-colors">ФУТБОЛ</span>
            <span className="text-red-600 cursor-pointer">LIVE</span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* TOP WIDGETS */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-red-600 tracking-widest uppercase">Live Score</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Манчестер Сити</span>
              <span className="text-3xl font-black bg-zinc-900 px-6 py-2 rounded-2xl border border-zinc-800 text-yellow-500">
                2 : 1
              </span>
              <span className="text-lg font-bold">Арсенал</span>
            </div>
          </div>

          <div className="bg-gradient-to-b from-zinc-900 to-black border border-yellow-500/50 p-8 rounded-[2rem] text-center shadow-2xl shadow-yellow-500/5">
            <span className="text-[10px] font-black text-yellow-500 tracking-[0.2em] uppercase">🔒 VIP Access</span>
            <h2 className="text-xl font-black mt-3 mb-6">ТОЧНЫЙ СЧЕТ НАЙДЕН</h2>
            <a 
              href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
              target="_blank" 
              className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-black text-sm transition-all"
            >
              ОТКРЫТЬ ДОСТУП
            </a>
          </div>
        </div>

        {/* SECTION TITLE */}
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-4xl font-black tracking-tighter italic">Football</h2>
          <div className="h-px bg-zinc-900 flex-1" />
        </div>

        {/* NEWS LIST */}
        <div className="space-y-16">
          {posts.map((post) => (
            <div key={post.id} className="group flex flex-col md:flex-row gap-10 items-start">
              {post.image_url && (
                <div className="w-full md:w-[400px] h-[240px] shrink-0 overflow-hidden rounded-[2.5rem] bg-zinc-900">
                  <img 
                    src={post.image_url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={post.title} 
                  />
                </div>
              )}
              <div className="flex-1 pt-2">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Football</span>
                <h3 className="text-3xl font-black leading-tight mt-3 mb-4 group-hover:text-zinc-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-lg leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-6 text-zinc-800 text-xs font-black uppercase tracking-widest">
                  Читать полностью →
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black border-t border-zinc-950 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-20">
            <div>
              <h4 className="text-xl font-black mb-6 tracking-tighter uppercase">
                SPOOORT<span className="text-red-600">NEWS</span>
              </h4>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Ваш главный источник футбольных инсайдов. Мы работаем с проверенными данными и предоставляем аналитику, которую не найти в открытых источниках.
              </p>
            </div>
            <div>
              <h5 className="text-zinc-200 text-xs font-black uppercase tracking-widest mb-8">Навигация</h5>
              <div className="space-y-4 text-zinc-600 text-sm">
                <p className="hover:text-white cursor-pointer">Трансферы</p>
                <p className="hover:text-white cursor-pointer">Лига Чемпионов</p>
                <p className="hover:text-white cursor-pointer">Аналитика</p>
              </div>
            </div>
            <div>
              <h5 className="text-zinc-200 text-xs font-black uppercase tracking-widest mb-8">О проекте</h5>
              <div className="space-y-4 text-zinc-600 text-sm">
                <p className="hover:text-white cursor-pointer">Редакция</p>
                <p className="hover:text-white cursor-pointer">Контакты</p>
                <p className="hover:text-white cursor-pointer">Реклама</p>
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-zinc-900 font-bold uppercase tracking-[0.3em] border-t border-zinc-950 pt-10">
            © 2026 Spoortnews All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
