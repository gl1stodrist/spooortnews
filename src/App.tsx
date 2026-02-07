import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import AllNewsPage from "./pages/AllNewsPage";
import FootballPage from "./pages/FootballPage";
import TournamentPage from "./pages/TournamentPage";
import TeamPage from "./pages/TeamPage";
import TransfersPage from "./pages/TransfersPage";
import MatchesTodayPage from "./pages/MatchesTodayPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/news" element={<AllNewsPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* SEO Hub Pages */}
          <Route path="/football" element={<FootballPage />} />
          <Route path="/football/:slug" element={<TournamentPage />} />
          <Route path="/football/rpl/teams/:slug" element={<TeamPage />} />

          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/matches/today" element={<MatchesTodayPage />} />
          <Route path="/matches/tomorrow" element={<MatchesTodayPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
