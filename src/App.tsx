
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import GoalDetail from "./pages/GoalDetail";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/hooks/useAuth";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Public routes are accessible without login
const PublicRoutes = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/:id" 
                element={
                  <ProtectedRoute>
                    <GoalDetail />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const App = () => <PublicRoutes />;

export default App;
