
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/UserProfile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-500">
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              DreamPlan Navigator
            </Link>
            <div className="flex items-center gap-2">
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
        <footer className="border-t py-4 bg-background">
          <div className="container text-center text-sm text-muted-foreground">
            Made with precision and simplicity in mind.
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
