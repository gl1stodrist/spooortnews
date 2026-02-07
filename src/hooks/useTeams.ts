import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: string;
  name: string;
  slug: string;
  league: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const transformTeam = (row: Record<string, unknown>): Team => ({
  id: row.id as string,
  name: row.name as string,
  slug: row.slug as string,
  league: row.league as string,
  logo_url: (row.logo_url as string | null) ?? null,
  description: (row.description as string | null) ?? null,
  created_at: row.created_at as string,
  updated_at: row.updated_at as string,
});

export const useAllTeams = (league?: string) => {
  return useQuery({
    queryKey: ["teams", league],
    queryFn: async () => {
      let query = supabase.from("teams").select("*").order("name");
      if (league) query = query.eq("league", league);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(transformTeam);
    },
  });
};

export const useTeamBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["teams", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? transformTeam(data) : null;
    },
    enabled: !!slug,
  });
};

export const useTeamNews = (teamName: string, limit = 20) => {
  return useQuery({
    queryKey: ["news", "team", teamName, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .or(`title.ilike.%${teamName}%,content.ilike.%${teamName}%`)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    enabled: !!teamName,
  });
};
