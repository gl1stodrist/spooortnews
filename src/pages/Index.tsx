import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 uppercase italic">Инсайды</h1>
        
        {/* VIP БЛОК — Сделан максимально просто */}
        <div className="bg-zinc-900 border-2 border-yellow-600 rounded-xl p-6 mb-10 text-center shadow-lg">
          <p className="text-yellow-600 font-bold text-xs mb-2">🔒 VIP CONTENT</p>
          <h2 className="text-xl font-black text-white mb-4">ТОЧНЫЙ СЧЕТ МАТЧА 🔥</h2>
          <div className="bg-black/20 p-4 rounded-md mb-4">
             <p className="text-gray-500 blur-[3px] select-none text-sm">
               Скрытая информация о расстановке игроков и результате встречи только для наших партнеров...
             </p>
          </div>
          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            className="inline-block w-full py-3 bg-yellow-600 text-black font-bold rounded-lg uppercase text-sm hover:bg-yellow-500 transition-colors"
          >
            Открыть доступ бесплатно
          </a>
        </div>

        <NewsGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
