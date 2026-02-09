import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => data && setPosts(data));
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: '"Inter", -apple-system, sans-serif' }}>
      
      {/* HEADER — Один в один как на Lovable */}
      <header style={{ padding: '24px 0', borderBottom: '1px solid #111', position: 'sticky', top: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
            SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span>
          </b>
          <nav style={{ display: 'flex', gap: '30px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>
            <span style={{ cursor: 'pointer' }}>ФУТБОЛ</span>
            <span style={{ color: '#ea384c', cursor: 'pointer' }}>LIVE</span>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* ВЕРХНИЕ ВИДЖЕТЫ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          
          {/* LIVE BOARD */}
          <div style={{ background: '#080808', padding: '30px', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '10px', height: '10px', background: '#ea384c', borderRadius: '50%', boxShadow: '0 0 15px #ea384c' }}></div>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#ea384c', letterSpacing: '1px' }}>LIVE MATCH</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '800' }}>Манчестер Сити</span>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff', background: '#111', padding: '10px 25px', borderRadius: '15px', border: '1px solid #222' }}>2 : 1</span>
              <span style={{ fontSize: '18px', fontWeight: '800', textAlign: 'right' }}>Арсенал</span>
            </div>
          </div>

          {/* VIP INSIDER */}
          <div style={{ background: 'linear-gradient(180deg, #111 0%, #000 100%)', border: '1px solid #FDB931', padding: '30px', borderRadius: '24px', textAlign: 'center' }}>
            <div style={{ color: '#FDB931', fontSize: '12px', fontWeight: '900', marginBottom: '15px', letterSpacing: '2px' }}>🔒 VIP ACCESS</div>
            <div style={{ fontSize: '22px', fontWeight: '900', marginBottom: '20px' }}>ТОЧНЫЙ СЧЕТ НАЙДЕН</div>
            <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ 
              display: 'block', background: '#FDB931', color: '#000', padding: '16px', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '14px' 
            }}>ПОЛУЧИТЬ ДОСТУП</a>
          </div>
        </div>

        {/* НОВОСТНАЯ ЛЕНТА — Lovable Football Category Style */}
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '40px', letterSpacing: '-1px' }}>Главные события</h2>
        
        <div style={{ display: 'grid', gap: '48px' }}>
          {posts.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', borderBottom: '1px solid #111', paddingBottom: '40px' }}>
              {p.image_url && (
                <div style={{ flexShrink: 0 }}>
                  <img src={p.image_url} style={{ width: '320px', height: '200px', borderRadius: '20px', objectFit: 'cover' }} alt="" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ color: '#ea384c', fontSize: '12px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase' }}>Футбол</div>
                <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 16px 0', lineHeight: '1.2', color: '#fff' }}>{p.title}</h3>
                <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{p.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER — О нас в стиле Lovable */}
      <footer style={{ background: '#050505', padding: '80px 20px', borderTop: '1px solid #111', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '60px' }}>
          <div>
            <div style={{ fontWeight: '900', fontSize: '24px', marginBottom: '25px' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></div>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8' }}>
              Мы — команда футбольных экспертов и инсайдеров. Наша цель — предоставлять самую оперативную и точную информацию из мира спорта 24/7. Мы не просто пишем новости, мы живем игрой.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '25px', color: '#fff', textTransform: 'uppercase' }}>Информация</div>
            <div style={{ color: '#444', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span>О проекте</span>
              <span>Редакция</span>
              <span>Контакты</span>
              <span>Реклама</span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '25px', color: '#fff', textTransform: 'uppercase' }}>Категории</div>
            <div style={{ color: '#444', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span>Европейский футбол</span>
              <span>Трансферные инсайды</span>
              <span>VIP Аналитика</span>
              <span>Политика конфиденциальности</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
