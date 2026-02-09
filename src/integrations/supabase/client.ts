import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // 1. Функция загрузки новостей из базы
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }); // Свежие сверху!

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  // 2. Функция запуска сбора новых новостей (твоя кнопка)
  const handleUpdateNews = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-api");
      if (error) throw error;

      toast({ title: "Успех!", description: "Новости обновлены" });
      fetchPosts(); // Перезагружаем список после обновления
    } catch (err: any) {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось обновить новости", 
        variant: "destructive" 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Спортивные Новости</h1>
          <Button 
            onClick={handleUpdateNews} 
            disabled={isUpdating}
            className="flex gap-2"
          >
            <RefreshCw className={isUpdating ? "animate-spin" : ""} />
            {isUpdating ? "Обновляю..." : "Обновить новости"}
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-xl">Загрузка ленты...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
                <img 
                  src={post.image_url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Сегодня"}
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {posts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">Новостей пока нет. Нажмите кнопку «Обновить новости».</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
