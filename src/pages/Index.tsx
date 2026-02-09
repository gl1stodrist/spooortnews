import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 uppercase italic tracking-tighter">
          Главные инсайды
        </h1>

        {/* --- НАШ VIP БЛОК --- */}
        <div style={{
          backgroundColor: '#111',
          border: '2px solid #eab308',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
            🔒 VIP ДОСТУП
          </div>
          
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase' }}>
            Точный счет матча Лиги Чемпионов 🔥
          </h2>
          
          <p style={{ color: '#666', filter: 'blur(5px)', marginBottom: '20px', userSelect: 'none' }}>
            Этот текст скрыт. Здесь находится эксклюзивная информация о матче и точном счете, которую мы получили от надежного источника...
          </p>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              backgroundColor: '#eab308',
              color: 'black',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '18px'
            }}
          >
            ПОЛУЧИТЬ ДОСТУП БЕСПЛАТНО
          </a>
        </div>
        {/* --- КОНЕЦ VIP БЛОКА --- */}

        <NewsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
