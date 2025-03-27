
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  storageKey = "achiverr-theme",
  ...props
}: ThemeProviderProps) {
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  const value = {
    theme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
