import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CommunityForum from "./pages/Community";
import HomePage from "./pages/Homepage";
import DiscussionDetails from "./pages/DiscussionDetails";
import ChatInterface from "./pages/ChatInterface";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4 text-gray-600">This page is under construction.</p>
  </div>
);

const App = () => (
  <div>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" enableSystem={true}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/register-business"
                element={<PlaceholderPage title="Register Business" />}
              />
              <Route
                path="/notifications"
                element={<NotificationsPage/>}
              />
              <Route path="/community" element={<CommunityForum />} />
              <Route
                path="/civic-bot"
                element={<ChatInterface/>}
              />
              <Route path="/home" element={<HomePage />} />
              <Route path="/discussion/:id" element={<DiscussionDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </div>
);

export default App;
