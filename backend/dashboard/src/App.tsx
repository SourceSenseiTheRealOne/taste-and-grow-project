import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Analytics from "./pages/Analytics";
import WebsiteContent from "./pages/WebsiteContent";
import Corridors from "./pages/Corridors";
import Cards from "./pages/Cards";
import Users from "./pages/Users";
import Schools from "./pages/Schools";
import SchoolCodes from "./pages/SchoolCodes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Analytics />} />
            <Route path="website-content" element={<WebsiteContent />} />
            <Route path="users" element={<Users />} />
            <Route path="schools" element={<Schools />} />
            <Route path="school-codes" element={<SchoolCodes />} />
            <Route path="corridors" element={<Corridors />} />
            <Route path="cards" element={<Cards />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
