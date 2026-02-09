import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => data && setPosts(data));
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ padding: '20px', borderBottom: '1px solid #111', textAlign: 'center' }}>
        <b style={{ fontSize: '20px', letterSpacing: '2px' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></b>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* LIVE BLOCK */}
        <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '12px', border: '1px solid #1a1a1a', marginBottom: '20px' }}>
          <div style={{ color: '#ea384c', fontSize: '10px', fontWeight: 'bold' }}>● LIVE РЕЗУЛЬТАТЫ</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontWeight: 'bold' }}>
            <span>Ливерпуль</span> <span style={{ color: '#FDB931' }}>2 : 1</span> <span>Реал Мадрид</span>
          </div>
        </div>

        {/* VIP BANNER */}
        <div style={{ background: '#111', border: '1px solid #FDB931', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
          <small style={{ color: '#FDB931' }}>🔒 VIP INSIDER</small>
          <h2 style={{ fontSize: '18px', margin: '10px 0' }}>ТОЧНЫЙ СЧЕТ НАЙДЕН</h2>
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ display: 'block', background: '#FDB931', color: '#000', padding: '10px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>УЗНАТЬ БЕСПЛАТНО</a>
        </div>

        {/* NEWS FEED */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {posts.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #111', paddingBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>{p.title}</h3>
                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{p.excerpt}</p>
              </div>
              {p.image_url && <img src={p.image_url} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} alt="" />}
            </div>
          ))}
        </div>

      </main>

      {/* ABOUT US / FOOTER */}
      <footer style={{ background: '#050505', padding: '40px 20px', borderTop: '1px solid #111', marginTop: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>О НАС</div>
          <p style={{ color: '#444', fontSize: '12px', lineHeight: '1.5' }}>
            SPOOORT.RU — главный источник футбольных новостей. Мы предоставляем оперативную аналитику, LIVE-результаты и эксклюзивные инсайды для тех, кто живет футболом.
          </p>
          <div style={{ borderTop: '1px solid #111', marginTop: '20px', paddingTop: '10px', fontSize: '10px', color: '#222' }}>
            © 2026 Футбольные новости и аналитика
          </div>
        </div>
      </footer>
    </div>
  );
}
