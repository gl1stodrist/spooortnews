const Index = () => {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Шапка сайта */}
      <header style={{ padding: '20px', borderBottom: '1px solid #333', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', fontWeight: '900' }}>SPOOORT.RU</h1>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ fontSize: '28px', fontStyle: 'italic', marginBottom: '30px', textTransform: 'uppercase' }}>
          Главные инсайды
        </h2>

        {/* --- ЗОЛОТОЙ VIP БЛОК --- */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1a1a, #000)',
          border: '2px solid #FFD700',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)'
        }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '12px', marginBottom: '15px', letterSpacing: '1px' }}>
            🔒 ЭКСКЛЮЗИВНЫЙ VIP ДОСТУП
          </div>
          
          <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase' }}>
            СЛИВ: Точный счет матча Лиги Чемпионов 🔥
          </h3>
          
          <div style={{ position: 'relative', marginBottom: '25px' }}>
            <p style={{ color: '#555', filter: 'blur(5px)', fontSize: '16px', userSelect: 'none', lineHeight: '1.6' }}>
              По информации от нашего источника в судейском корпусе, сегодня ожидается невероятный сценарий. Основной вратарь получил повреждение на разминке, что гарантирует точный счет 3:1 в пользу домашней команды...
            </p>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px', border: '1px solid #333', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Контент заблокирован
            </div>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              color: 'black',
              padding: '18px',
              borderRadius: '12px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '18px',
              textTransform: 'uppercase',
              boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            Разблокировать за 0₽
          </a>
        </div>
        {/* --- КОНЕЦ VIP БЛОКА --- */}

        <p style={{ textAlign: 'center', color: '#444', fontSize: '14px' }}>
          Остальные новости подгружаются из системы...
        </p>
      </main>

      <footer style={{ marginTop: 'auto', padding: '40px 20px', borderTop: '1px solid #333', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        © 2026 SPOOORT.RU — Спортивные инсайды и аналитика.
      </footer>
    </div>
  );
};

export default Index;
