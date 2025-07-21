import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AvgSessionDuration } from "./pages/sessions/AvgSessionDuration";
import { MostUsedClubs } from "./pages/shots/MostUsedClubs";
import { SubscribedPercentage } from "./pages/users/SubscribedPercentage";

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
            
            {/* Shot Routes */}
            <Route path="/shots/most_used_clubs" element={<MostUsedClubs />} />
            
            {/* User Routes */}
            <Route path="/users/subscribed_percentage" element={<SubscribedPercentage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
