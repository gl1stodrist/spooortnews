import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function getNews() {
      const { data } = await supabase.from("posts").select("*").limit(6);
      if (data) setNews(data);
    }
    getNews();
  }, []);

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1a1a1a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid #eee', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: '800' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></div>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>МЕНЮ</div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* LIVE & VIP - В одну линию для экономии места */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <div style={{ flex: 1, background: '#f9f9f9', padding: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '10px', color: '#ea384c', fontWeight: 'bold' }}>● LIVE</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '5px' }}>Ливерпуль 2:1 Реал</div>
          </div>
          <div style={{ flex: 1, background: '#1a1a1a', padding: '15px', borderRadius: '12px', color: '#fff' }}>
            <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ color: '#FDB931', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
              🔒 VIP ИНСАЙД →
            </a>
          </div>
        </div>

        {/* НОВОСТИ */}
        <div style={{ borderLeft: '4px solid #ea384c', paddingLeft: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>ГЛАВНОЕ СЕГОДНЯ</h2>
        </div>

        {news.map((n: any) => (
          <div key={n.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{n.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{n.excerpt}</p>
            </div>
            {n.image_url && <img src={n.image_url} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} alt="" />}
          </div>
        ))}

      </main>

      {/* FOOTER О НАС */}
      <footer style={{ background: '#f9f9f9', padding: '40px 20px', borderTop: '1px solid #eee', marginTop: '40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></div>
          <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.6' }}>
            О нас: Мы — ведущий агрегатор футбольных новостей. Аналитика, LIVE результаты и эксклюзивные материалы.
          </p>
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#999' }}>
            © 2026 Контакты | Редакция | Помощь
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
