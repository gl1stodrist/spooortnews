import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SportCategory } from "@/data/newsData";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: SportCategory;
  author: string;
  published_at: string;
  views: number;
  is_hot: boolean;
  is_live: boolean;
  tags: string[];
  source_url: string | null;
}

// Transform database row to NewsArticle format
const transformNews = (row: any): NewsArticle => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  image: row.image,
  category: row.category as SportCategory,
  author: row.author,
  published_at: row.published_at,
  views: row.views || 0,
  is_hot: row.is_hot || false,
  is_live: row.is_live || false,
  tags: row.tags || [],
  source_url: row.source_url,
});

export const useAllNews = (limit = 20) => {
  return useQuery({
    queryKey: ["news", "all", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
  });
};

export const useNewsByCategory = (category: SportCategory, limit = 20) => {
  return useQuery({
    queryKey: ["news", "category", category, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("category", category)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
  });
};

export const useHotNews = (limit = 5) => {
  return useQuery({
    queryKey: ["news", "hot", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("is_hot", true)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
  });
};

export const usePopularNews = (limit = 5) => {
  return useQuery({
    queryKey: ["news", "popular", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("views", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
  });
};

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ["news", "single", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data ? transformNews(data) : null;
    },
    enabled: !!id,
  });
};

export const useSearchNews = (query: string) => {
  return useQuery({
    queryKey: ["news", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
    enabled: query.trim().length > 0,
  });
};

export const useRelatedNews = (category: SportCategory, excludeId: string, limit = 3) => {
  return useQuery({
    queryKey: ["news", "related", category, excludeId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("category", category)
        .neq("id", excludeId)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformNews);
    },
    enabled: !!category && !!excludeId,
  });
};
