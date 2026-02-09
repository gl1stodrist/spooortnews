import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => data && setPosts(data));
  }, []);

  return (
    <div className="lovable-clone">
      <style>{`
        .lovable-clone { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        header { border-bottom: 1px solid #111; padding: 25px 0; position: sticky; top: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 100; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase; }
        .red { color: #ea384c; }

        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0 60px; }
        .live-card { background: #080808; border: 1px solid #1a1a1a; padding: 30px; border-radius: 24px; }
        .vip-card { background: linear-gradient(180deg, #111, #000); border: 1px solid #FDB931; padding: 30px; border-radius: 24px; text-align: center; }
        .btn { display: block; background: #FDB931; color: #000; padding: 16px; border-radius: 12px; font-weight: 900; text-decoration: none; margin-top: 20px; }

        .news-item { display: flex; gap: 40px; margin-bottom: 50px; padding-bottom: 40px; border-bottom: 1px solid #111; transition: 0.3s; }
        .news-item:hover { opacity: 0.8; }
        .news-img { width: 400px; height: 240px; border-radius: 20px; object-fit: cover; background: #111; flex-shrink: 0; }
        .news-cat { color: #ea384c; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; }
        .news-title { font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 15px 0; color: #fff; }
        .news-text { color: #666; font-size: 16px; line-height: 1.6; }

        footer { background: #000; border-top: 1px solid #111; padding: 80px 0; margin-top: 80px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 60px; }
        .footer-about { color: #444; font-size: 15px; line-height: 1.8; }
        .footer-link { color: #222; font-size: 14px; display: block; margin-bottom: 12px; text-decoration: none; }
      `}</style>

      <header>
        <div className="wrapper" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className="logo">SPOOORT<span className="red">NEWS</span></div>
          <div style={{fontSize: '13px', fontWeight: 700, gap: '30px', display: 'flex'}}>
            <span>ФУТБОЛ</span>
            <span className="red">LIVE</span>
          </div>
        </div>
      </header>

      <main className="wrapper">
        <div className="hero-grid">
          <div className="live-card">
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ea384c', fontSize: '11px', fontWeight: 900, marginBottom: '20px'}}>
              <div style={{width: '8px', height: '8px', background: '#ea384c', borderRadius: '50%'}}></div> LIVE
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: '18px', fontWeight: 800}}>Ман Сити</span>
              <span style={{fontSize: '32px', fontWeight: 900, background: '#111', padding: '10px 20px', borderRadius: '15px'}}>2 : 1</span>
              <span style={{fontSize: '18px', fontWeight: 800}}>Арсенал</span>
            </div>
          </div>
          <div className="vip-card">
            <div style={{color: '#FDB931', fontSize: '11px', fontWeight: 900, letterSpacing: '2px'}}>🔒 VIP ACCESS</div>
            <div style={{fontSize: '22px', fontWeight: 900, marginTop: '10px'}}>ТОЧНЫЙ СЧЕТ НАЙДЕН</div>
            <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" target="_blank" className="btn">ОТКРЫТЬ ДОСТУП</a>
          </div>
        </div>

        <h2 style={{fontSize: '40px', fontWeight: 900, marginBottom: '40px', letterSpacing: '-1.5px'}}>Football</h2>

        {posts.map((p: any) => (
          <div key={p.id} className="news-item">
            {p.image_url && <img src={p.image_url} className="news-img" />}
            <div>
              <div className="news-cat">Football</div>
              <h3 className="news-title">{p.title}</h3>
              <p className="news-text">{p.excerpt}</p>
            </div>
          </div>
        ))}
      </main>

      <footer>
        <div className="wrapper footer-grid">
          <div>
            <div className="logo" style={{marginBottom: '20px', fontSize: '20px'}}>SPOOORT<span className="red">NEWS</span></div>
            <p className="footer-about">Мы — ваше главное окно в мир футбола. Самые быстрые новости, проверенные инсайды и аналитика, которой доверяют профессионалы.</p>
          </div>
          <div>
            <div style={{fontWeight: 800, fontSize: '13px', marginBottom: '20px'}}>NAVIGATE</div>
            <div className="footer-link">Главные новости</div>
            <div className="footer-link">Трансферы</div>
            <div className="footer-link">Аналитика</div>
          </div>
          <div>
            <div style={{fontWeight: 800, fontSize: '13px', marginBottom: '20px'}}>LEGAL</div>
            <div className="footer-link">Политика конфиденциальности</div>
            <div className="footer-link">О редакции</div>
            <div className="footer-link">Контакты</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
