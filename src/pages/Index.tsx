import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <div style={{ backgroundColor: '#080808', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0 }}>
      
      <style>
        {`
          @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
          .live-dot { width: 8px; height: 8px; background-color: #ff4d4d; border-radius: 50%; display: inline-block; margin-right: 8px; animation: blink 1.5s infinite; }
          .vip-card { background: linear-gradient(145deg, #111, #000); border: 1px solid #FDB931; border-radius: 16px; padding: 20px; margin-bottom: 30px; position: relative; overflow: hidden; }
          .btn-gold { background: #FDB931; color: #000; padding: 12px; border-radius: 10px; font-weight: 900; text-align: center; text-decoration: none; display: block; text-transform: uppercase; font-size: 14px; transition: 0.3s; }
          .btn-gold:hover { transform: scale(1.02); background: #ffcc66; }
        `}
      </style>

      {/* ШАПКА */}
      <header style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1a1a1a', backgroundColor: '#000' }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '3px', fontWeight: '900' }}>
          SPOOORT<span style={{ color: '#FDB931' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '650px', margin: '0 auto', padding: '20px' }}>
        
        {/* --- БЛОК LIVE РЕЗУЛЬТАТЫ --- */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '15px', marginBottom: '25px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>
              <span className="live-dot"></span> LIVE РЕЗУЛЬТАТЫ
            </span>
            <span style={{ fontSize: '11px', color: '#FDB931' }}>Все матчи →</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>ЛИВЕРПУЛЬ</div>
              <div style={{ fontSize: '10px', color: '#555' }}>Хозяева</div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FDB931' }}>2 : 1</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>РЕАЛ МАДРИД</div>
              <div style={{ fontSize: '10px', color: '#555' }}>Гости</div>
            </div>
          </div>
        </div>

        {/* --- КОМПАКТНЫЙ VIP БЛОК --- */}
        <div className="vip-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
            <div>
              <div style={{ color: '#FDB931', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '5px' }}>🔒 VIP INSIDE</div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', lineHeight: '1.2' }}>ТОЧНЫЙ СЧЕТ: ЛИГА ЧЕМПИОНОВ</h3>
            </div>
            <div style={{ backgroundColor: 'rgba(253,185,49,0.1)', padding: '5px 10px', borderRadius: '6px', fontSize: '10px', color: '#FDB931', border: '1px solid #FDB931' }}>🔥 HOT</div>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <p style={{ margin: 0, color: '#444', filter: 'blur(5px)', fontSize: '13px', lineHeight: '1.4' }}>
              По данным от службы безопасности, в матче ожидается договорной сценарий. Точный счет 3:1 подтвержден через два независимых источника...
            </p>
          </div>

          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" className="btn-gold">
            Узнать счет бесплатно
          </a>
        </div>

        <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>ПОСЛЕДНИЕ ИНСАЙДЫ</h2>

        {/* НОВОСТИ */}
        {news.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#111', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
            {item.image_url && <img src={item.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="" />}
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>{item.title}</h4>
              <p style={{ color: '#888', fontSize: '14px', margin: '0 0 15px 0', lineHeight: '1.4' }}>{item.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: '11px' }}>
                <span>АНАЛИТИКА</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#333', fontSize: '12px' }}>
        © 2026 SPOOORT.RU — LIVE ИНСАЙДЫ
      </footer>
    </div>
  );
};

export default Index;
