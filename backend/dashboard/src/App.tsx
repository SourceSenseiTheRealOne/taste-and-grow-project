import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Analytics from "./pages/Analytics";
import WebsiteContent from "./pages/WebsiteContent";
import MissionRoles from "./pages/MissionRoles";
import SeedCards from "./pages/SeedCards";
import Corridors from "./pages/Corridors";
import Cards from "./pages/Cards";
import Users from "./pages/Users";
import Schools from "./pages/Schools";
import SchoolCodes from "./pages/SchoolCodes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Analytics />} />
              <Route path="website-content" element={<WebsiteContent />} />
              <Route path="mission-roles" element={<MissionRoles />} />
              <Route path="seed-cards" element={<SeedCards />} />
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
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
