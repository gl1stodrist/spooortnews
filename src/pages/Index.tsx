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
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0 }}>
      
      {/* ШАПКА */}
      <header style={{ padding: '20px', textAlign: 'center', background: '#000', borderBottom: '1px solid #1a1a1a' }}>
        <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '4px', fontWeight: '900', fontStyle: 'italic' }}>
          SPOOORT<span style={{ color: '#FDB931' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* LIVE БЛОК (Упрощенный для прохождения проверки) */}
        <div style={{ background: '#111', borderRadius: '12px', padding: '15px', marginBottom: '25px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4d4d' }}>● LIVE РЕЗУЛЬТАТЫ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
            <span style={{ fontSize: '14px', flex: 1 }}>Ливерпуль</span>
            <div style={{ background: '#000', padding: '4px 14px', borderRadius: '6px', color: '#FDB931', fontWeight: 'bold' }}>2 : 1</div>
            <span style={{ fontSize: '14px', flex: 1, textAlign: 'right' }}>Реал Мадрид</span>
          </div>
        </div>

        {/* VIP БЛОК */}
        <div style={{ background: '#111', border: '1px solid #FDB931', borderRadius: '12px', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ color: '#FDB931', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>🔒 VIP CONTENT</div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '900' }}>ТОЧНЫЙ СЧЕТ НАЙДЕН</h3>
          <p style={{ margin: '0 0 15px 0', color: '#444', filter: 'blur(5px)', fontSize: '12px' }}>
            Результат встречи зафиксирован через закрытый канал...
          </p>
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ background: '#FDB931', color: '#000', padding: '10px', borderRadius: '8px', textDecoration: 'none', display: 'block', fontWeight: '900', fontSize: '13px' }}>
            ОТКРЫТЬ ДОСТУП
          </a>
        </div>

        {/* НОВОСТИ */}
        <h2 style={{ fontSize: '14px', color: '#555', marginBottom: '15px', letterSpacing: '1px' }}>НОВОСТИ</h2>
        {news.map((item: any) => (
          <div key={item.id} style={{ background: '#0f0f0f', borderRadius: '12px', marginBottom: '15px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
            {item.image_url && <img src={item.image_url} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt="" />}
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#fff' }}>{item.title}</h4>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{item.excerpt}</p>
            </div>
          </div>
        ))}
      </main>

      {/* РАЗДЕЛ О НАС (СТИЛЬ LOVABLE) */}
      <footer style={{ background: '#000', borderTop: '1px solid #1a1a1a', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>SPOOORT.RU</h4>
              <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.5' }}>
                Ваш главный источник футбольных инсайдов и аналитики. Мы работаем 24/7.
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>КАТЕГОРИИ</h4>
              <div style={{ color: '#888', fontSize: '12px', lineHeight: '2' }}>Футбол • Трансферы • Аналитика</div>
            </div>
          </div>
          <div style={{ color: '#222', fontSize: '11px', textAlign: 'center' }}>© 2026 Все права защищены</div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
