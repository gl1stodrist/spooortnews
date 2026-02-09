import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Flame, ChevronRight } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await supabase.functions.invoke('smart-api');
    await fetchPosts();
    setIsUpdating(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const categories = ["Футбол", "Хоккей", "Теннис", "Бокс", "ММА", "Баскетбол"];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans">
      {/* HEADER — ТОЛЬКО НАЗВАНИЕ И КНОПКА */}
      <header className="border-b border-white/10 bg-[#161920] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">
            PRO-SPORTS
          </h1>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-sm px-6 font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            Обновить
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* ЛЕНТА НОВОСТЕЙ */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-[#1a1d24] border border-white/5 overflow-hidden hover:border-red-600/50 transition-colors">
                <div className="relative h-52">
                  <img 
                    src={post.image_url} 
                    className="w-full h-full object-cover opacity-90"
                    alt=""
                  />
                  <div className="absolute top-0 left-0 bg-red-600 px-3 py-1 text-[10px] font-black uppercase">
                    Live
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[10px] font-bold
