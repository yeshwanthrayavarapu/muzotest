"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Yesh = 'yesh',
  Nord = 'nord',
  Catppuccin = 'catppuccin',
  Everforest = 'everforest',
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // On theme change
  useEffect(() => {
    if (!theme) return;

    localStorage.setItem('theme', theme);
    for (const key of Object.values(Theme)) {
      document.documentElement.classList.remove(`theme-${key}`);
    }
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? Theme.Dark : Theme.Light);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark;
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: theme ?? Theme.Light, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
