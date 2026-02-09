import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(6);
      if (data) setPosts(data);
      setLoading(false);
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-red-600">
      
      {/* HEADER: СТАТУС СИСТЕМЫ */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">SPOOORT<span className="text-red-600">.RU</span></h1>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">AI_NODE_ACTIVE</span>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Latency: <span className="text-white">24ms</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* АНАЛИТИЧЕСКИЙ ТЕРМИНАЛ */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-12 gap-4">
            
            {/* ГЛАВНЫЙ ПРОГНОЗ (ДИНАМИЧЕСКИЙ) */}
            <div className="lg:col-span-9 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl italic select-none">DATA</div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                  <div>
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Neural Analysis Matchday</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none italic">Ливерпуль <span className="text-zinc-800 font-normal">vs</span> Реал</h2>
                  </div>
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                    <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">AI Confidence</div>
                    <div className="text-3xl font-black text-yellow-500 tracking-tighter">91.4%</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-zinc-500 uppercase mb-3 tracking-widest">Market Status</div>
                    <div className="text-lg font-bold">Smart Money Flow</div>
                    <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-red-600 w-[74%]" />
                    </div>
                  </div>
                  <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="text-[9px] font-black text-zinc-500 uppercase mb-3 tracking-widest">AI Verdict</div>
                    <div className="text-sm font-bold leading-relaxed text-zinc-300">
                      Фиксируем аномальную нагрузку на ТБ 2.5. Рекомендуется фиксация прибыли.
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=main_ai" 
                       className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 text-center">
                      Get Insight →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* БОКОВАЯ ЛЕНТА LIVE-ИНСАЙДОВ */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-zinc-950 border border-white/5 rounded-[2rem] p-6 h-full flex flex-col">
                <div className="text-[9px] font-black uppercase text-zinc-600 mb-6 tracking-widest">Flash Feed</div>
                <div className="space-y-6 flex-1 text-[11px] font-bold">
                  <div className="border-l-2 border-red-600 pl-4 py-1">
                    <div className="text-zinc-500 mb-1">14:02</div>
                    <div>Дортмунд: минус 2 защитника перед ЛЧ.</div>
                  </div>
                  <div className="border-l-2 border-zinc-800 pl-4 py-1">
                    <div className="text-zinc-500 mb-1">13:45</div>
                    <div>Инсайд: Тен Хаг под угрозой увольнения.</div>
                  </div>
                  <div className="border-l-2 border-yellow-500 pl-4 py-1">
                    <div className="text-yellow-500 mb-1">12:20</div>
                    <div>Кэф на победу Челси упал на 0.15 за час.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* СЕТКА НОВОСТЕЙ */}
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Intelligence Archive</h2>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p) => (
            <div key={p.id} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-900 mb-6 relative border border-white/5">
                {p.image_url && <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />}
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
                  <div className="text-red-600 text-[9px] font-black uppercase tracking-[0.3em] mb-3">Analysis Verified</div>
                  <h3 className="text-xl font-black leading-tight mb-4 group-hover:text-red-500 transition-colors">{p.title}</h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">{p.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-20 bg-black text-center">
          <div className="text-xl font-black italic mb-4">SPOOORT<span className="text-red-600">.RU</span></div>
          <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em]">Global Analytics Node © 2026</div>
      </footer>
    </div>
  );
};

export default Index;
