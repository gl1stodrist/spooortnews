import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(8);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <div className="dark-theme">
      <style>{`
        .dark-theme { background-color: #050505; color: #ffffff; min-height: 100vh; font-family: sans-serif; }
        .container { maxWidth: 1000px; margin: 0 auto; padding: 20px; }
        header { border-bottom: 1px solid #1a1a1a; padding: 20px; text-align: center; background: #000; }
        .logo { font-size: 24px; fontWeight: 900; letterSpacing: 2px; }
        .accent { color: #ea384c; }
        
        .live-box { background: #111; border: 1px solid #222; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
        .vip-box { background: linear-gradient(145deg, #1a1a1a, #000); border: 1px solid #FDB931; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px; }
        .vip-btn { display: block; background: #FDB931; color: #000; padding: 12px; border-radius: 8px; font-weight: 900; text-decoration: none; margin-top: 15px; font-size: 14px; }
        
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        .news-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; }
        .news-img { width: 100%; height: 180px; object-fit: cover; }
        .news-content { padding: 15px; }
        
        footer { background: #000; border-top: 1px solid #1a1a1a; padding: 50px 20px; margin-top: 50px; }
        .footer-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
        .footer-title { color: #fff; font-weight: bold; margin-bottom: 15px; }
        .footer-text { color: #555; font-size: 13px; line-height: 1.6; }
      `}</style>

      <header>
        <div className="logo">SPOOORT<span className="accent">NEWS</span></div>
      </header>

      <main className="container">
        {/* LIVE SCORE */}
        <div className="live-box">
          <div style={{ color: '#ea384c', fontSize: '10px', fontWeight: 'bold', marginBottom: '10px' }}>● LIVE СЕЙЧАС</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Манчестер Сити</span>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#FDB931' }}>2 : 1</span>
            <span>Арсенал</span>
          </div>
        </div>

        {/* VIP BANNER */}
        <div className="vip-box">
