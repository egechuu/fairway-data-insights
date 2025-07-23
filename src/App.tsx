import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { useAuth } from "./hooks/useAuth";

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Index />;
  }
  
  return (
    <DashboardLayout onLogout={logout}>
      {children}
    </DashboardLayout>
  );
};

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
            <Route path="/sessions/avg_session_duration" element={
              <ProtectedRoute><AvgSessionDuration /></ProtectedRoute>
            } />
            <Route path="/sessions/avg_session_frequency" element={
              <ProtectedRoute><AvgSessionFrequency /></ProtectedRoute>
            } />
            <Route path="/sessions/daily_session" element={
              <ProtectedRoute><DailySession /></ProtectedRoute>
            } />
            <Route path="/sessions/weekly_session" element={
              <ProtectedRoute><WeeklySession /></ProtectedRoute>
            } />
            
            {/* Shot Routes */}
            <Route path="/shots/most_used_clubs" element={
              <ProtectedRoute><MostUsedClubs /></ProtectedRoute>
            } />
            <Route path="/shots/total_shots" element={
              <ProtectedRoute><TotalShots /></ProtectedRoute>
            } />
            <Route path="/shots/club_performance" element={
              <ProtectedRoute><ClubPerformance /></ProtectedRoute>
            } />
            <Route path="/shots/premium_user_performance" element={
              <ProtectedRoute><PremiumUserPerformance /></ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/users/subscribed_percentage" element={
              <ProtectedRoute><SubscribedPercentage /></ProtectedRoute>
            } />
            <Route path="/users/drop_off_rate_all" element={
              <ProtectedRoute><DropOffRateAll /></ProtectedRoute>
            } />
            <Route path="/users/drop_off_rate_sub" element={
              <ProtectedRoute><DropOffRateSub /></ProtectedRoute>
            } />
            <Route path="/users/comparison_country" element={
              <ProtectedRoute><ComparisonCountry /></ProtectedRoute>
            } />
            <Route path="/users/comparison_gender" element={
              <ProtectedRoute><ComparisonGender /></ProtectedRoute>
            } />
            <Route path="/users/comparison_age" element={
              <ProtectedRoute><ComparisonAge /></ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
