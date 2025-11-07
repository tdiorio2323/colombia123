import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Messages from "./pages/Messages";
import Upload from "./pages/Upload";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import Community from "./pages/Community";
import Calendar from "./pages/Calendar";
import SmartReply from "./pages/SmartReply";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
import CreatorPage from "./components/CreatorPage";
import ShowcasePage from "./pages/Showcase";
import RouteGallery from "./pages/RouteGallery";

import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  ProtectedRoute,
  GuestOnlyRoute,
  CreatorOnlyRoute,
} from "./components/ProtectedRoute";

import { creators } from "./data/creators.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/community" element={<Community />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route
                path="/c/:username"
                element={<CreatorPage creator={creators[0]} />}
              />

              {/* Guest-only routes (redirect to /profile if logged in) */}
              <Route
                path="/login"
                element={
                  <GuestOnlyRoute>
                    <Login />
                  </GuestOnlyRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <GuestOnlyRoute>
                    <Signup />
                  </GuestOnlyRoute>
                }
              />

              {/* Protected routes (require authentication) */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/smart-reply"
                element={
                  <ProtectedRoute>
                    <SmartReply />
                  </ProtectedRoute>
                }
              />

              {/* Creator-only routes */}
              <Route
                path="/upload"
                element={
                  <CreatorOnlyRoute>
                    <Upload />
                  </CreatorOnlyRoute>
                }
              />

              {/* Dev-only routes */}
              {import.meta.env.DEV && (
                <Route path="/__routes" element={<RouteGallery />} />
              )}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
