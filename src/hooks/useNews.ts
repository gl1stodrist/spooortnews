import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { NewsArticle, SportCategory } from "@/types/news";

export type { NewsArticle };

const transformNews = (row: Record<string, unknown>): NewsArticle => ({
  id: row.id as string,
  title: row.title as string,
  excerpt: row.excerpt as string,
  content: row.content as string,
  image: (row.image as string | null) ?? null,
  category: row.category as SportCategory,
  author: row.author as string,
  published_at: row.published_at as string,
  views: (row.views as number) ?? 0,
  is_hot: (row.is_hot as boolean) ?? false,
  is_live: (row.is_live as boolean) ?? false,
  tags: (row.tags as string[]) ?? [],
  source_url: (row.source_url as string | null) ?? null,
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
    placeholderData: keepPreviousData,
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

export const useRelatedNews = (
  category: SportCategory,
  excludeId: string,
  limit = 3
) => {
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
