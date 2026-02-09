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
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#e0e0e0', 
      minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif", 
      margin: 0, 
      paddingBottom: '60px',
      overflowX: 'hidden' // Чтобы не было горизонтального скролла
    }}>
      {/* Стили для Inter Font - если нет на хостинге, можно убрать */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
          a { text-decoration: none; color: inherit; }
          img { max-width: 100%; height: auto; display: block; }
          /* Простая анимация кнопки */
          @keyframes pulse-gold {
            0% { box-shadow: 0 0 0 0 rgba(253, 185, 49, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(253, 185, 49, 0); }
            100% { box-shadow: 0 0 0 0 rgba(253, 185, 49, 0); }
          }
          .vip-button:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(253, 185, 49, 0.6); }
          .vip-button { transition: all 0.3s ease; animation: pulse-gold 2s infinite; }
          .news-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.5); }
          .news-card { transition: all 0.3s ease; }
        `}
      </style>

      {/* --- ГЛАМУРНАЯ ШАПКА --- */}
      <header style={{ 
        padding: '28px 25px', 
        textAlign: 'center', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.7))', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 5px 20px rgba(0,0,0,0.4)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', letterSpacing: '5px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', color: '#fff' }}>
          SPOOORT<span style={{ color: '#FFD700' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '750px', margin: '0 auto', padding: '30px 20px' }}>
        
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '900', 
          marginBottom: '40px', 
          textTransform: 'uppercase', 
          color: '#ffffff', 
          letterSpacing: '1.5px',
          borderLeft: '4px solid #FFD700',
          paddingLeft: '15px',
          lineHeight: '1.2'
        }}>
          ГЛАВНЫЕ ИНСАЙДЫ <br/> ДНЯ
        </h2>

        {/* --- УЛЬТРА-PREMIUM VIP BLOCK --- */}
        <div style={{
          background: 'linear-gradient(145deg, #151515 0%, #000000 100%)',
          border: '2px solid #FFD700',
          borderRadius: '28px',
          padding: '40px 30px',
          marginBottom: '60px',
          textAlign: 'center',
          boxShadow: '0 15px 50px rgba(255, 215, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 1s ease-out'
        }}>
          {/* Декор на фоне */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: '#FFD700', filter: 'blur(90px)', opacity: 0.15 }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', background: '#FFD700', filter: 'blur(90px)', opacity: 0.15 }}></div>

          <div style={{ 
            color: '#FFD700', 
            fontWeight: 'bold', 
            fontSize: '12px', 
            marginBottom: '18px', 
            letterSpacing: '2.5px', 
            textTransform: 'uppercase',
            display: 'inline-block',
            backgroundColor: 'rgba(255,215,0,0.1)',
            padding: '6px 15px',
            borderRadius: '50px'
          }}>
            👑 VIP ДОСТУП ПРЯМО СЕЙЧАС
          </div>
          
          <h3 style={{ 
            fontSize: '30px', 
            fontWeight: '900', 
            marginBottom: '25px', 
            textTransform: 'uppercase', 
            lineHeight: '1.2', 
            color: '#fff',
            textShadow: '0 0 15px rgba(255,215,0,0.3)'
          }}>
            СЛИВ: ТОЧНЫЙ СЧЕТ <br/> МАТЧА ЛИГИ ЧЕМПИОНОВ 🔥
          </h3>
          
          <div style={{ 
            position: 'relative', 
            marginBottom: '35px', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '25px', 
            borderRadius: '20px', 
            border: '1px solid #333',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
          }}>
            <p style={{ color: '#666', filter: 'blur(8px)', fontSize: '16px', userSelect: 'none', margin: 0, lineHeight: '1.8' }}>
              Эксклюзивная инсайдерская информация из закрытых источников. Сегодня на поле выйдет резервный состав, что гарантирует неожиданный поворот событий и точный счет 3:1 в пользу аутсайдера. Подробности здесь...
            </p>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: '#FFD700', 
              fontWeight: 'bold', 
              fontSize: '16px', 
              textShadow: '0 0 15px #000',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid #FFD700'
            }}>
              ДАННЫЕ ЗАБЛОКИРОВАНЫ
            </div>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            className="vip-button" // Добавляем класс для анимации
            style={{
              display: 'block',
              background: 'linear-gradient(90deg, #FFD700, #FDB931)',
              color: '#000',
              padding: '22px',
              borderRadius: '18px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '20px',
              textTransform: 'uppercase',
              boxShadow: '0 8px 25px rgba(253, 185, 49, 0.4)',
              letterSpacing: '1px'
            }}
          >
            Разблокировать за 0₽
          </a>
        </div>

        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          textTransform: 'uppercase', 
          color: '#ffffff', 
          letterSpacing: '1px',
          borderLeft: '3px solid #666',
          paddingLeft: '12px'
        }}>
          Свежие инсайды
        </h2>

        {/* --- ПРЕМИУМ КАРТОЧКИ НОВОСТЕЙ --- */}
        {news.map((item) => (
          <div key={item.id} className="news-card" style={{ 
            backgroundColor: '#121212', 
            borderRadius: '24px', 
            marginBottom: '25px', 
            border: '1px solid #1f1f1f',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            {item.image_url && <img src={item.image_url} style={{ width: '100%', height: '250px', objectFit: 'cover', borderBottom: '1px solid #1f1f1f' }} alt={item.title || "Новость"} loading="lazy" />}
            <div style={{ padding: '25px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold', lineHeight: '1.4', color: '#fff' }}>{item.title}</h4>
              <p style={{ color: '#999', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>{item.excerpt}</p>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="#" style={{ color: '#FFD700', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Читать подробнее →
                </a>
                <span style={{ color: '#444', fontSize: '12px' }}>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>
        ))}

      </main>

      {/* --- СТИЛЬНЫЙ ФУТЕР --- */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '50px 20px', 
        color: '#555', 
        fontSize: '13px', 
        borderTop: '1px solid #1a1a1a',
        backgroundColor: '#000',
        lineHeight: '1.6'
      }}>
        © 2026 SPOOORT.RU — Элитная платформа для спортивной аналитики и инсайдов. Все права защищены.
      </footer>
    </div>
  );
};

export default Index;
