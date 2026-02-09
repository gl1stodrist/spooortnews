import { Header } from "@/components/Header";
import { NewsGrid } from "@/components/NewsGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Пытаемся вернуть оригинальную шапку */}
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 uppercase italic tracking-tighter text-white">
          Главные инсайды
        </h1>

        {/* --- ТВОЙ РАБОЧИЙ VIP БЛОК --- */}
        <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '2px solid #eab308',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '12px', marginBottom: '10px' }}>
            🔒 VIP ДОСТУП
          </div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '15px' }}>
            ТОЧНЫЙ СЧЕТ МАТЧА ЛИГИ ЧЕМПИОНОВ 🔥
          </h3>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <p style={{ color: '#444', filter: 'blur(6px)', userSelect: 'none' }}>
              Текст скрыт. Здесь находится эксклюзивная информация о точном счете...
            </p>
          </div>
          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            style={{
              display: 'block',
              background: '#eab308',
              color: '#000',
              padding: '15px',
              borderRadius: '10px',
              fontWeight: '900',
              textDecoration: 'none'
            }}
          >
            ПОЛУЧИТЬ ДОСТУП БЕСПЛАТНО
          </a>
        </div>

        {/* Пытаемся вернуть сетку новостей */}
        <NewsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
