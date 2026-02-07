import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  sport: string;
  type: string;
  cover_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const transformTournament = (row: Record<string, unknown>): Tournament => ({
  id: row.id as string,
  name: row.name as string,
  slug: row.slug as string,
  sport: row.sport as string,
  type: row.type as string,
  cover_url: (row.cover_url as string | null) ?? null,
  description: (row.description as string | null) ?? null,
  created_at: row.created_at as string,
  updated_at: row.updated_at as string,
});

export const useAllTournaments = (sport?: string) => {
  return useQuery({
    queryKey: ["tournaments", sport],
    queryFn: async () => {
      let query = supabase.from("tournaments").select("*").order("name");
      if (sport) query = query.eq("sport", sport);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(transformTournament);
    },
  });
};

export const useTournamentBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["tournaments", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? transformTournament(data) : null;
    },
    enabled: !!slug,
  });
};

export const useTournamentNews = (tournamentName: string, limit = 20) => {
  return useQuery({
    queryKey: ["news", "tournament", tournamentName, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .or(`title.ilike.%${tournamentName}%,content.ilike.%${tournamentName}%,tags.cs.{${tournamentName}}`)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    enabled: !!tournamentName,
  });
};
