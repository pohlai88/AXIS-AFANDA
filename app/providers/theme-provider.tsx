"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem("theme") as Theme) || defaultTheme;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      if (theme === "system" && enableSystem) {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
        return;
      }
      root.classList.add(theme);
    } else {
      root.removeAttribute(attribute);
      if (theme === "system" && enableSystem) {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.setAttribute(attribute, systemTheme);
      } else {
        root.setAttribute(attribute, theme);
      }
    }
  }, [theme, enableSystem, attribute]);

  React.useEffect(() => {
    if (disableTransitionOnChange) {
      const root = window.document.documentElement;
      root.style.setProperty("--transition-duration", "0ms");
      return () => {
        root.style.removeProperty("--transition-duration");
      };
    }
    return undefined;
  }, [theme, disableTransitionOnChange]);

  const setTheme = React.useCallback((t: Theme) => {
    if (typeof window !== "undefined") localStorage.setItem("theme", t);
    setThemeState(t);
  }, []);

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
