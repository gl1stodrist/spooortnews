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
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(6);
      if (data) setPosts(data as Post[]);
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black italic">SPOOORT<span className="text-red-600">.RU</span></h1>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <span className="text-red-600">AI PREDICTIONS</span>
            <span>INSIGHTS</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- AI PREDICTION ENGINE (НОВАЯ СЕКЦИЯ) --- */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-yellow-500">AI Analytics Engine v2.4</h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* ГЛАВНЫЙ ПРОГНОЗ */}
            <div className="lg:col-span-3 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-wrap justify-between items-start gap-6 mb-12">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Ближайшее событие / 10 Фев 2026</span>
                    <h3 className="text-4xl font-black mt-2 tracking-tighter">РЕАЛ МАДРИД <span className="text-zinc-800">VS</span> АТЛЕТИКО</h3>
                  </div>
                  <div className="bg-yellow-500 text-black px-6 py-3 rounded-2xl text-center">
                    <div className="text-[10px] font-black uppercase">Уверенность AI</div>
                    <div className="text-2xl font-black italic">94.8%</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold"><span className="text-zinc-500">Форма Реала</span> <span>89%</span></div>
                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-white w-[89%]" /></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-zinc-500">Травмы</span> <span className="text-red-500">Куртуа, Алаба</span></div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                    <div className="text-yellow-500 text-[10px] font-black uppercase mb-2">Рекомендация</div>
                    <div className="text-xl font-black leading-tight">Победа 1 + Тотал (2.5) бол</div>
                  </div>

                  <div className="text-right">
                    <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_ai_card" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-red-600/20">
                      ПОЛУЧИТЬ ПОЛНЫЙ ИНСАЙД →
                    </a>
                  </div>
                </div>
              </div>
              {/* Декоративная сетка на фоне */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            {/* МИНИ-КАРТОЧКА VIP */}
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-[2.5rem] p-8 flex flex-col justify-between text-black relative">
               <div className="font-black italic text-4xl opacity-20 absolute top-4 right-4 leading-none">VIP</div>
               <div className="relative z-10">
                 <h4 className="text-xl font-black leading-tight mb-4">ЕЩЕ 4 ПРОГНОЗА ОТ ИИ</h4>
                 <p className="text-xs font-bold leading-relaxed opacity-80">
                   Доступ к закрытой базе аналитики по АПЛ и Серии А на сегодня.
                 </p>
               </div>
               <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_ai_side" className="bg-black text-white text-center py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                 ОТКРЫТЬ ДОСТУП
               </a>
            </div>
          </div>
        </section>

        {/* НОВОСТИ */}
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Latest Analysis</h2>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div key={post.id} className="group">
              {post.image_url && (
                <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-900 mb-6 relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-[10px] font-black tracking-widest text-white border-b border-white">ЧИТАТЬ АНАЛИЗ</span>
                   </div>
                  <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
              )}
              <div className="px-2">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Confirmed Insight</span>
                <h3 className="text-xl font-black mt-2 mb-4 leading-tight group-hover:text-red-500 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-zinc-600 text-sm line-clamp-2 mb-6 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black border-t border-white/5 py-20 text-center">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-2xl font-black italic mb-6">SPOOORT<span className="text-red-600">.RU</span></div>
          <p className="text-zinc-600 text-xs leading-relaxed mb-10 uppercase tracking-widest font-bold">
            Predictive Analytics • Insider Information • Global Football Insights
          </p>
          <div className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em]">
            Powered by AI Intelligence 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
