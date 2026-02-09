import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleUpdateInsides = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-api');
      if (error) throw error;
      toast({
        title: "Успешно!",
        description: "Новые инсайды уже в канале и на сайте.",
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Кнопка обновления (твоя рабочая функция) */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold italic tracking-tighter">ГЛАВНЫЕ ИНСАЙДЫ</h1>
          <Button 
            onClick={handleUpdateInsides}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Zap className="mr-2 h-4 w-4" /> ОБНОВИТЬ ИНСАЙДЫ
          </Button>
        </div>

        {/* --- ЗОЛОТОЙ VIP БЛОК --- */}
        <div className="relative overflow-hidden border-2 border-[#FFD700] rounded-2xl p-6 mb-10 bg-[#1a1a1a] shadow-[0_0_20px_rgba(255,215,0,0.2)]">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-[#FFD700] text-black px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider">
              🔒 VIP ДОСТУП
            </span>
            <span className="text-yellow-500/80 text-xs animate-pulse">● LIVE: Эксклюзив</span>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3 uppercase italic">
            СЛИВ: Точный счет матча Лиги Чемпионов 🔥
          </h2>
          
          <div className="relative">
            <p className="text-gray-400 text-lg blur-md select-none mb-6">
              По информации от нашего источника в судейском корпусе, сегодня ожидается невероятный сценарий. Основной вратарь получил повреждение на разминке, что гарантирует точный счет 3:1 в пользу...
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-white font-bold text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Контент заблокирован</span>
            </div>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#9f7928] text-black text-center font-black text-lg hover:scale-[1.02] transition-transform shadow-lg"
          >
            РАЗБЛОКИРОВАТЬ БЕСПЛАТНО
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
