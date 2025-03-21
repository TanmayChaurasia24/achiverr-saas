
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-500">
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">
              DreamPlan Navigator
            </h1>
            <ThemeToggle />
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
