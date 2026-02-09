import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Проверяем наличие компонентов перед рендером */}
      {Header && <Header />}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 uppercase italic tracking-tighter text-white">
          Главные инсайды
        </h1>

        {/* --- ЗОЛОТОЙ VIP БЛОК --- */}
        <div style={{
          background: '#111',
          border: '2px solid #eab308',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '12px', marginBottom: '10px' }}>
            🔒 ЭКСКЛЮЗИВНЫЙ VIP ДОСТУП
          </div>
          
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase' }}>
            СЛИВ: Точный счет матча Лиги Чемпионов 🔥
          </h2>
          
          <div style={{ position: 'relative', marginBottom: '25px' }}>
            <p style={{ color: '#444', filter: 'blur(5px)', fontSize: '16px' }}>
              Текст скрыт. Здесь находится информация о точном счете, которую мы получили от надежного источника...
            </p>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              width: '100%',
              backgroundColor: '#eab308',
              color: 'black',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '18px',
              textTransform: 'uppercase'
            }}
          >
            ПОЛУЧИТЬ ДОСТУП БЕСПЛАТНО
          </a>
        </div>

        {/* Возвращаем сетку новостей */}
        {NewsGrid && <NewsGrid />}
      </main>

      {Footer && <Footer />}
    </div>
  );
};

export default Index;
