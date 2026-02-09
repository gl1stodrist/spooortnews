import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => data && setPosts(data));
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* HEADER — Теперь высокий и стильный */}
      <header style={{ padding: '25px 20px', borderBottom: '1px solid #111', backgroundColor: '#000', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></b>
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>
             <span>ФУТБОЛ</span>
             <span style={{ color: '#ea384c' }}>LIVE</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* КАСКАД: LIVE И VIP В ОДНУ ЛИНИЮ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '16px', border: '1px solid #1a1a1a' }}>
            <div style={{ color: '#ea384c', fontSize: '10px', fontWeight: '900', marginBottom: '15px' }}>● LIVE СЕЙЧАС</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Манчестер Сити</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#FDB931', background: '#000', padding: '4px 12px', borderRadius: '8px' }}>2 : 1</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Арсенал</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(145deg, #111, #000)', border: '1px solid #FDB931', padding: '20px', borderRadius: '16px' }}>
            <small style={{ color: '#FDB931', fontWeight: '900', fontSize: '10px' }}>🔒 ЭКСКЛЮЗИВНЫЙ ИНСАЙД</small>
            <div style={{ fontSize: '16px', fontWeight: '800', margin: '10px 0' }}>ТОЧНЫЙ СЧЕТ НАЙДЕН</div>
            <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" style={{ display: 'block', background: '#FDB931', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: '900', textDecoration: 'none', textAlign: 'center', fontSize: '12px' }}>ПОЛУЧИТЬ ДОСТУП</a>
          </div>
        </div>

        {/* НОВОСТНАЯ ЛЕНТА В СТИЛЕ ЖУРНАЛА */}
        <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', borderBottom: '1px solid #111', paddingBottom: '10px' }}>ГЛАВНЫЕ СОБЫТИЯ</h2>
        
        <div style={{ display: 'grid', gap: '30px' }}>
          {posts.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', gap: '25px', alignItems: 'center', borderBottom: '1px solid #0f0f0f', paddingBottom: '25px' }}>
              {p.image_url && (
                <img src={p.image_url} style={{ width: '180px', height: '120px', borderRadius: '12px', objectFit: 'cover', background: '#111' }} alt="" />
              )}
              <div style={{ flex: 1 }}>
                <span style={{ color: '#ea384c', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Футбол</span>
                <h3 style={{ fontSize: '19px', fontWeight: '700', margin: '8px 0', lineHeight: '1.3' }}>{p.title}</h3>
                <p style={{ color: '#555', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{p.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* О НАС / ПОЛНОЦЕННЫЙ ФУТЕР */}
      <footer style={{ background: '#000', padding: '60px 20px', borderTop: '1px solid #111', marginTop: '60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div>
              <div style={{ fontWeight: '900', fontSize: '18px', marginBottom: '15px' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></div>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.7' }}>
                Мы — ведущее спортивное медиа, предоставляющее оперативную аналитику и эксклюзивные инсайды. Наша команда работает круглосуточно, чтобы вы были в центре футбольных событий.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', color: '#fff' }}>ИНФОРМАЦИЯ</div>
              <div style={{ color: '#444', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span>О проекте</span>
                <span>Контакты</span>
                <span>Редакция</span>
                <span>Реклама</span>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', color: '#fff' }}>КАТЕГОРИИ</div>
              <div style={{ color: '#444', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span>Европейский футбол</span>
                <span>Трансферные слухи</span>
                <span>Прогнозы экспертов</span>
                <span>LIVE результаты</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #0a0a0a', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#222' }}>
            © 2026 SPOOORT.RU — ВСЕ ПРАВА ЗАЩИЩЕНЫ
          </div>
        </div>
      </footer>
    </div>
  );
}
