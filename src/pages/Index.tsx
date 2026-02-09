import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  // Сами подтягиваем новости из базы, обходя поломанный NewsGrid
  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <div style={{ backgroundColor: '#0b0b0b', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Шапка */}
      <header style={{ padding: '20px', borderBottom: '1px solid #222', textAlign: 'center', backgroundColor: '#000' }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '3px', fontWeight: '900' }}>
          SPOOORT<span style={{ color: '#eab308' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* --- ЗОЛОТОЙ VIP БЛОК --- */}
        <div style={{ background: '#1a1a1a', border: '2px solid #eab308', borderRadius: '20px', padding: '25px', marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '12px', marginBottom: '10px' }}>🔒 VIP ДОСТУП ПРЯМО СЕЙЧАС</div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '15px' }}>ТОЧНЫЙ СЧЕТ МАТЧА 🔥</h3>
          <div style={{ position: 'relative', marginBottom: '20px', background: '#000', padding: '15px', borderRadius: '10px' }}>
            <p style={{ color: '#444', filter: 'blur(6px)', margin: 0 }}>Скрытая инсайдерская информация о результате матча...</p>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#eab308', fontWeight: 'bold' }}>ДАННЫЕ ЗАБЛОКИРОВАНЫ</div>
          </div>
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ display: 'block', background: '#eab308', color: '#000', padding: '15px', borderRadius: '10px', fontWeight: '900', textDecoration: 'none' }}>РАЗБЛОКИРОВАТЬ ЗА 0₽</a>
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '20px', textTransform: 'uppercase', color: '#eab308' }}>Свежие новости:</h2>

        {/* --- СПИСОК РЕАЛЬНЫХ НОВОСТЕЙ --- */}
        {news.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#161616', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #222' }}>
            {item.image_url && <img src={item.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} alt="" />}
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{item.title}</h4>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>{item.excerpt}</p>
          </div>
        ))}

      </main>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#444', fontSize: '12px' }}>
        © 2026 SPOOORT.RU
      </footer>
    </div>
  );
};

export default Index;
