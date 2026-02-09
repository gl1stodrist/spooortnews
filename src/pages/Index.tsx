import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold italic">PRO-SPORTS AI</h1>
          <Button onClick={() => supabase.functions.invoke('smart-api').then(() => fetchPosts())}>
            <RefreshCw className="mr-2 h-4 w-4" /> Обновить ленту
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
              <img src={post.image_url} className="w-full h-48 object-cover opacity-80" />
              <div className="p-5">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Свежее • {new Date(post.created_at).toLocaleDateString()}</span>
                <h2 className="text-xl font-bold mt-2 mb-3 leading-tight">{post.title}</h2>
                <p className="text-slate-400 text-sm line-clamp-3">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
