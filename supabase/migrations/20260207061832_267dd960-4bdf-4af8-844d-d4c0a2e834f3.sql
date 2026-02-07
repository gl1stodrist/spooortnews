
-- Teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  league TEXT NOT NULL DEFAULT 'rpl',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sport TEXT NOT NULL DEFAULT 'football',
  type TEXT NOT NULL DEFAULT 'league',
  cover_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News-Teams linking table
CREATE TABLE public.news_teams (
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, team_id)
);

-- News-Tournaments linking table
CREATE TABLE public.news_tournaments (
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, tournament_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tournaments ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Anyone can read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Anyone can read news_teams" ON public.news_teams FOR SELECT USING (true);
CREATE POLICY "Anyone can read news_tournaments" ON public.news_tournaments FOR SELECT USING (true);

-- Service role write policies (for edge functions)
CREATE POLICY "Service role can insert teams" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update teams" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Service role can delete teams" ON public.teams FOR DELETE USING (true);

CREATE POLICY "Service role can insert tournaments" ON public.tournaments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update tournaments" ON public.tournaments FOR UPDATE USING (true);
CREATE POLICY "Service role can delete tournaments" ON public.tournaments FOR DELETE USING (true);

CREATE POLICY "Service role can insert news_teams" ON public.news_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can delete news_teams" ON public.news_teams FOR DELETE USING (true);

CREATE POLICY "Service role can insert news_tournaments" ON public.news_tournaments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can delete news_tournaments" ON public.news_tournaments FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_news_updated_at();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_news_updated_at();

-- Seed RPL teams
INSERT INTO public.teams (name, slug, league, description) VALUES
('Зенит', 'zenit', 'rpl', 'ФК Зенит — российский футбольный клуб из Санкт-Петербурга, один из самых титулованных клубов России.'),
('Спартак Москва', 'spartak-moskva', 'rpl', 'ФК Спартак Москва — легендарный российский футбольный клуб, самый титулованный чемпион России.'),
('ЦСКА Москва', 'cska-moskva', 'rpl', 'ПФК ЦСКА — российский футбольный клуб из Москвы, многократный чемпион России.'),
('Динамо Москва', 'dinamo-moskva', 'rpl', 'ФК Динамо Москва — один из старейших российских футбольных клубов.'),
('Локомотив Москва', 'lokomotiv-moskva', 'rpl', 'ФК Локомотив Москва — российский футбольный клуб, многократный чемпион России.'),
('Краснодар', 'krasnodar', 'rpl', 'ФК Краснодар — российский футбольный клуб из города Краснодар.'),
('Ростов', 'rostov', 'rpl', 'ФК Ростов — российский футбольный клуб из Ростова-на-Дону.'),
('Рубин', 'rubin', 'rpl', 'ФК Рубин — российский футбольный клуб из Казани, двукратный чемпион России.'),
('Крылья Советов', 'krylya-sovetov', 'rpl', 'ФК Крылья Советов — российский футбольный клуб из Самары.'),
('Ахмат', 'akhmat', 'rpl', 'ФК Ахмат — российский футбольный клуб из Грозного.'),
('Урал', 'ural', 'rpl', 'ФК Урал — российский футбольный клуб из Екатеринбурга.'),
('Факел', 'fakel', 'rpl', 'ФК Факел — российский футбольный клуб из Воронежа.'),
('Оренбург', 'orenburg', 'rpl', 'ФК Оренбург — российский футбольный клуб из города Оренбург.'),
('Пари НН', 'pari-nn', 'rpl', 'ФК Пари Нижний Новгород — российский футбольный клуб из Нижнего Новгорода.'),
('Сочи', 'sochi', 'rpl', 'ФК Сочи — российский футбольный клуб из города Сочи.'),
('Балтика', 'baltika', 'rpl', 'ФК Балтика — российский футбольный клуб из Калининграда.');

-- Seed tournaments
INSERT INTO public.tournaments (name, slug, sport, type, description) VALUES
('Российская Премьер-Лига', 'rpl', 'football', 'league', 'Российская Премьер-Лига (РПЛ) — высший дивизион российского футбола. Свежие новости, результаты и таблица чемпионата.'),
('Лига чемпионов УЕФА', 'liga-chempionov', 'football', 'cup', 'Лига чемпионов УЕФА — главный клубный турнир европейского футбола. Расписание, результаты и новости.'),
('Чемпионат мира по футболу', 'chempionat-mira', 'football', 'cup', 'Чемпионат мира по футболу — главный международный футбольный турнир FIFA.'),
('Кубок России', 'kubok-rossii', 'football', 'cup', 'Кубок России по футболу — главный кубковый турнир российского футбола.'),
('НБА', 'nba', 'basketball', 'league', 'НБА — Национальная баскетбольная ассоциация, сильнейшая баскетбольная лига мира.'),
('КХЛ', 'khl', 'hockey', 'league', 'КХЛ — Континентальная хоккейная лига, сильнейшая хоккейная лига Европы.'),
('UFC', 'ufc', 'mma', 'league', 'UFC — Ultimate Fighting Championship, крупнейшая организация смешанных единоборств.'),
('Формула-1', 'formula-1', 'motorsport', 'league', 'Формула-1 — высший класс гонок на автомобилях с открытыми колёсами.'),
('Уимблдон', 'wimbledon', 'tennis', 'cup', 'Уимблдонский турнир — старейший и самый престижный теннисный турнир в мире.');

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policies
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Service role can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Service role can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Service role can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
