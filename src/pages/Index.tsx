const Index = () => {
  return (
    <div style={{ backgroundColor: '#0b0b0b', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0 }}>
      
      {/* --- САМОДЕЛЬНАЯ ШАПКА --- */}
      <header style={{ padding: '20px', borderBottom: '1px solid #222', textAlign: 'center', backgroundColor: '#000' }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '3px', fontWeight: '900', color: '#fff' }}>
          SPOOORT<span style={{ color: '#eab308' }}>.RU</span>
        </h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        <h2 style={{ fontSize: '24px', fontStyle: 'italic', marginBottom: '20px', textTransform: 'uppercase', borderLeft: '4px solid #eab308', paddingLeft: '15px' }}>
          Эксклюзивные инсайды
        </h2>

        {/* --- ЗОЛОТОЙ VIP БЛОК --- */}
        <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '2px solid #eab308',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ backgroundColor: '#eab308', color: '#000', display: 'inline-block', padding: '2px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px', marginBottom: '15px' }}>
            🔒 VIP ДОСТУП ПРЯМО СЕЙЧАС
          </div>
          
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', marginBottom: '10px', textTransform: 'uppercase' }}>
            СЛИВ: Точный счет матча Лиги Чемпионов 🔥
          </h3>
          
          <div style={{ position: 'relative', marginBottom: '20px', backgroundColor: '#000', padding: '15px', borderRadius: '10px' }}>
            <p style={{ color: '#444', filter: 'blur(6px)', fontSize: '14px', userSelect: 'none', margin: 0 }}>
              Инсайдер из штаба подтвердил, что основной нападающий не выйдет на поле. Это гарантирует проход ставки на тотал меньше и итоговый счет матча 1:0 в пользу гостей...
            </p>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#eab308', fontWeight: 'bold', fontSize: '12px' }}>
              ДАННЫЕ ЗАБЛОКИРОВАНЫ
            </div>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#eab308',
              color: '#000',
              padding: '15px',
              borderRadius: '10px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '16px',
              textTransform: 'uppercase'
            }}
          >
            Разблокировать за 0₽
          </a>
        </div>

        {/* --- ЗАГЛУШКА ДЛЯ НОВОСТЕЙ --- */}
        <div style={{ opacity: 0.6 }}>
           <div style={{ height: '100px', backgroundColor: '#1a1a1a', borderRadius: '10px', marginBottom: '15px', padding: '15px' }}>
              <div style={{ width: '40%', height: '10px', backgroundColor: '#333', marginBottom: '10px' }}></div>
              <div style={{ width: '90%', height: '8px', backgroundColor: '#222' }}></div>
           </div>
           <div style={{ height: '100px', backgroundColor: '#1a1a1a', borderRadius: '10px', marginBottom: '15px', padding: '15px' }}>
              <div style={{ width: '30%', height: '10px', backgroundColor: '#333', marginBottom: '10px' }}></div>
              <div style={{ width: '85%', height: '8px', backgroundColor: '#222' }}></div>
           </div>
        </div>

      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#444', fontSize: '12px' }}>
        © 2026 SPOOORT.RU — Платформа для аналитики
      </footer>

    </div>
  );
};

export default Index;
