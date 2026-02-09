const Index = () => {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>SPOOORT.RU</h1>
      
      <div style={{
        border: '2px solid gold',
        padding: '20px',
        borderRadius: '15px',
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'gold' }}>🔒 VIP ИНСАЙД</h2>
        <p style={{ filter: 'blur(5px)' }}>Здесь очень секретный текст про точный счет матча...</p>
        <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
           style={{ background: 'gold', color: 'black', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' }}>
          ОТКРЫТЬ ДОСТУП
        </a>
      </div>

      <p style={{ marginTop: '50px', textAlign: 'center', color: '#666' }}>Новости загружаются...</p>
    </div>
  );
};

export default Index;
