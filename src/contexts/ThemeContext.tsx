"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

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
  const [theme, setTheme] = useLocalStorage<Theme>('theme-new', Theme.Light);

  // On theme change
  useEffect(() => {
    if (!theme) return;

    for (const key of Object.values(Theme)) {
      document.documentElement.classList.remove(`theme-${key}`);
    }
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

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
