import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Session imports
import { AvgSessionDuration } from "./pages/sessions/AvgSessionDuration";
import AvgSessionFrequency from "./pages/sessions/AvgSessionFrequency";
import DailySession from "./pages/sessions/DailySession";
import WeeklySession from "./pages/sessions/WeeklySession";

// Shot imports
import { MostUsedClubs } from "./pages/shots/MostUsedClubs";
import TotalShots from "./pages/shots/TotalShots";
import ClubPerformance from "./pages/shots/ClubPerformance";
import PremiumUserPerformance from "./pages/shots/PremiumUserPerformance";

// User imports
import { SubscribedPercentage } from "./pages/users/SubscribedPercentage";
import DropOffRateAll from "./pages/users/DropOffRateAll";
import DropOffRateSub from "./pages/users/DropOffRateSub";
import ComparisonCountry from "./pages/users/ComparisonCountry";
import ComparisonGender from "./pages/users/ComparisonGender";
import ComparisonAge from "./pages/users/ComparisonAge";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Session Routes */}
            <Route path="/sessions/avg_session_duration" element={<AvgSessionDuration />} />
            <Route path="/sessions/avg_session_frequency" element={<AvgSessionFrequency />} />
            <Route path="/sessions/daily_session" element={<DailySession />} />
            <Route path="/sessions/weekly_session" element={<WeeklySession />} />
            
            {/* Shot Routes */}
            <Route path="/shots/most_used_clubs" element={<MostUsedClubs />} />
            <Route path="/shots/total_shots" element={<TotalShots />} />
            <Route path="/shots/club_performance" element={<ClubPerformance />} />
            <Route path="/shots/premium_user_performance" element={<PremiumUserPerformance />} />
            
            {/* User Routes */}
            <Route path="/users/subscribed_percentage" element={<SubscribedPercentage />} />
            <Route path="/users/drop_off_rate_all" element={<DropOffRateAll />} />
            <Route path="/users/drop_off_rate_sub" element={<DropOffRateSub />} />
            <Route path="/users/comparison_country" element={<ComparisonCountry />} />
            <Route path="/users/comparison_gender" element={<ComparisonGender />} />
            <Route path="/users/comparison_age" element={<ComparisonAge />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
