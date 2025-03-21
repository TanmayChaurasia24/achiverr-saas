
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/UserProfile";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LayoutDashboard, BarChart3, Sparkle } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if we're on a public page (landing, pricing, login)
  const isPublicPage = ['/login', '/pricing'].includes(location.pathname) || location.pathname === '/';
  
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-500">
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <Link to={user ? "/dashboard" : "/"} className="text-xl font-semibold tracking-tight flex items-center">
              {!isPublicPage && user && (
                <LayoutDashboard className="mr-2 h-5 w-5 text-accent" />
              )}
              Achiverr
            </Link>
            <div className="flex items-center gap-3">
              {/* Dashboard Link - appears on all pages when user is logged in */}
              {user && (
                <Button variant="outline" size="sm" asChild className="text-sm">
                  <Link to="/dashboard">
                    <Sparkle className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              )}
              
              {!isPublicPage && (
                <Button variant="ghost" size="sm" asChild className="text-sm hidden md:flex">
                  <Link to="/pricing">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Pricing
                  </Link>
                </Button>
              )}
              
              {user ? (
                <UserProfile />
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}
