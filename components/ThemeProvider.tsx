'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getAutoTheme(): Theme {
  // Get IST time (UTC+5:30)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Light theme between 10:00 AM and 12:00 PM IST
  const lightStart = 10 * 60; // 10:00 AM
  const lightEnd = 12 * 60;   // 12:00 PM

  if (totalMinutes >= lightStart && totalMinutes < lightEnd) {
    return 'light';
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved preference first
    const saved = localStorage.getItem('yourtube-theme') as Theme | null;
    if (saved) {
      setThemeState(saved);
    } else {
      // Auto detect based on time
      const autoTheme = getAutoTheme();
      setThemeState(autoTheme);
      localStorage.setItem('yourtube-theme', autoTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.setProperty('--yt-bg', '#FFFFFF');
      root.style.setProperty('--yt-surface', '#F2F2F2');
      root.style.setProperty('--yt-surface2', '#E5E5E5');
      root.style.setProperty('--yt-border', '#D0D0D0');
      root.style.setProperty('--yt-text', '#0F0F0F');
      root.style.setProperty('--yt-muted', '#606060');
      document.body.style.background = '#FFFFFF';
      document.body.style.color = '#0F0F0F';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.setProperty('--yt-bg', '#0F0F0F');
      root.style.setProperty('--yt-surface', '#272727');
      root.style.setProperty('--yt-surface2', '#1F1F1F');
      root.style.setProperty('--yt-border', '#3F3F3F');
      root.style.setProperty('--yt-text', '#FFFFFF');
      root.style.setProperty('--yt-muted', '#AAAAAA');
      document.body.style.background = '#0F0F0F';
      document.body.style.color = '#FFFFFF';
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('yourtube-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
