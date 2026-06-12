"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";

const STORAGE_KEY = "scoutfight-theme";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyThemeClass(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function themeInitScript() {
  return `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${STORAGE_KEY}")||"system";var m=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var r=t==="system"?m:t;d.classList.toggle("dark",r==="dark");}catch(e){}})();`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");
  const [mounted, setMounted] = React.useState(false);

  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
  ));

  React.useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    const resolved = resolveTheme(stored);
    applyThemeClass(resolved);
    setResolvedTheme(resolved);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = resolveTheme("system");
      applyThemeClass(resolved);
      setResolvedTheme(resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mounted, theme]);

  const setTheme = React.useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    const resolved = resolveTheme(next);
    applyThemeClass(resolved);
    setResolvedTheme(resolved);
  }, []);

  const value = React.useMemo(
    () => ({
      theme: mounted ? theme : "system",
      resolvedTheme,
      setTheme,
    }),
    [mounted, theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
