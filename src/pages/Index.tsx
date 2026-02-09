import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10);
      if (posts) setNews(posts);

      const { data: matches } = await supabase.from("matches").select("*").limit(2);
      if (matches && matches.length > 0) {
        setLiveMatches(matches);
      } else {
        setLiveMatches([{ id: 1, home: "Манчестер Сити", away: "Арсенал", score: "1 : 0", status: "72'" }]);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0 }}>
      
      <style>
        {`
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
          .live-dot { width: 6px; height: 6px; background: #ff4d4d; border-radius: 50%; display: inline-block; margin-right: 6px; animation: pulse 1.5s infinite; }
          .vip-card { background: #111; border: 1px solid #FDB931; border-radius: 12px; padding: 15px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(253,185,49,0.1); }
          .news-card { background: #0f0f0f; border-radius: 12px; margin-bottom: 15px; overflow: hidden; border: 1px solid #1a1a1a; }
          .btn-vip { background: #FDB931; color: #000; padding: 10px; border-radius: 8px; text-align: center; font-weight: 900; text-decoration: none; display: block; font-size: 13px; text-transform: uppercase; }
          .footer-link { color: #888; text-decoration: none; font-size: 13px; display: block; margin-bottom: 8px; transition: 0.3s; }
          .footer-link:hover { color: #FDB931; }
        `}
      </style>

      {/* ШАПКА */}
      <header style={{ padding: '20px', textAlign: 'center', background: '#000', borderBottom: '1px solid #1a1a1a' }}>
        <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '4px', fontWeight: '900', fontStyle: 'italic' }}>
          SPOOORT<span style={{ color: '#FDB931' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* LIVE БЛОК */}
        <div style={{ background: '#111', borderRadius: '12px', padding: '15px', marginBottom: '25px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4d4d' }}>
              <span className="live-dot"></span> LIVE РЕЗУЛЬТАТЫ
            </span>
            <span style={{ fontSize: '10px', color: '#444' }}>Прямой эфир</span>
          </div>
          {liveMatches.map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: '14px', flex: 1 }}>{m.home || m.home_team}</span>
              <div style={{ background: '#000', padding: '4px 14px', borderRadius: '6px', color: '#FDB931', fontWeight: 'bold', fontSize: '15px' }}>
                {m.score}
              </div>
              <span style={{ fontSize: '14px', flex: 1, textAlign: 'right' }}>{m.away || m.away_team}</span>
            </div>
          ))}
        </div>

        {/* КОМПАКТНЫЙ VIP БЛОК */}
        <div className="vip-card">
          <div style={{ fontSize: '10px', color: '#FDB931', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>🔒 VIP CONTENT</div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '900' }}>ТОЧНЫЙ СЧЕТ: ИНСАЙД ДНЯ</h3>
          <p style={{ margin: '0 0 15px 0', color: '#444', filter: 'blur(5px)', fontSize: '12px', userSelect: 'none' }}>
            Текст скрыт. Эксклюзивная информация по матчу Лиги Чемпионов уже доступна...
          </p>
          <a href="
