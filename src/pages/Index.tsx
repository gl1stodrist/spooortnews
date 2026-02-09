import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";
import { Button } from "@/components/ui/button";
import { Zap, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleUpdateInsides = async () => {
    try {
      const { error } = await supabase.functions.invoke('smart-api');
      if (error) throw error;
      toast({
        title: "Успешно!",
        description: "Новые инсайды уже в канале и на сайте.",
      });
      setTimeout(() => window.location.reload(), 1000);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold italic tracking-tighter uppercase text-white">Главные инсайды</h1>
          <Button 
            onClick={handleUpdateInsides}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            <Zap className="mr-2 h-4 w-4 fill-current" /> ОБНОВИТЬ ИНСАЙДЫ
          </Button>
        </div>

        {/* VIP БЛОК */}
        <div className="relative overflow-hidden border-2 border-yellow-500 rounded-2xl p-6 mb-10 bg-zinc-900 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-md font-bold text-xs uppercase">
              🔒 VIP ДОСТУП
            </span>
            <span className="text-yellow-500/80 text-xs animate-pulse font-mono">LIVE: EXCLUSIVE</span>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3 uppercase italic leading-none">
            СЛИВ: Точный счет матча Лиги Чемпионов 🔥
          </h2>
          
          <div className="relative mb-6">
            <p className="text-zinc-500 text-lg blur-sm select-none">
              По информации от нашего источника в судейском корпусе, сегодня ожидается невероятный сценарий. Основной вратарь получил повреждение на разминке, что гарантирует точный счет 3:1 в пользу...
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 flex items-center gap-2">
                 <Lock className="h-4 w-4 text-yellow-500" />
                 <span className="text-white font-bold text-sm">Контент заблокирован</span>
               </div>
            </div>
          </div>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-700 text-black text-center font-black text-xl hover:brightness-110 transition-all shadow-xl uppercase"
          >
            Разблокировать за 0₽
          </a>
        </div>

        <NewsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
