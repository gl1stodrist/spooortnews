import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";
import { Button } from "@/components/ui/button";
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
        description: "Инсайды обновлены",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold uppercase text-white">Главные инсайды</h1>
          <Button onClick={handleUpdateInsides} className="font-bold">
             ОБНОВИТЬ
          </Button>
        </div>

        {/* Простой VIP БЛОК без сложных иконок */}
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
          
          <p style={{ color: '#666', filter: 'blur(4px)', marginBottom: '20px', userSelect: 'none' }}>
            Этот текст скрыт. Здесь находится эксклюзивная информация о матче и точном счете, которую мы получили от надежного источника...
          </p>

          <a 
            href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=site_vip" 
            target="_blank" 
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

        <NewsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
