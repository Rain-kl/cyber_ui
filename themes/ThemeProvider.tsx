'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorPalette, themes, ThemeNames, lightTheme } from './index';

interface ThemeContextType {
  theme: ColorPalette;
  themeName: ThemeNames;
  setTheme: (themeName: ThemeNames) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeNames;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeNames>(defaultTheme);
  const [theme, setTheme] = useState<ColorPalette>(themes[defaultTheme]);

  // 从localStorage加载保存的主题
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeNames;
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
        setTheme(themes[savedTheme]);
      }
    }
  }, []);

  // 保存主题到localStorage并更新CSS变量
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', themeName);
      setTheme(themes[themeName]);
      
      // 更新CSS变量以支持全局样式
      const root = document.documentElement;
      const colors = themes[themeName];
      
      root.style.setProperty('--bg-primary', colors.backgrounds.primary);
      root.style.setProperty('--bg-secondary', colors.backgrounds.secondary);
      root.style.setProperty('--bg-surface', colors.backgrounds.surface);
      root.style.setProperty('--bg-card', colors.backgrounds.card);
      root.style.setProperty('--bg-input', colors.backgrounds.input);
      
      root.style.setProperty('--text-primary', colors.text.primary);
      root.style.setProperty('--text-secondary', colors.text.secondary);
      root.style.setProperty('--text-muted', colors.text.muted);
      
      root.style.setProperty('--border-primary', colors.borders.primary);
      root.style.setProperty('--border-secondary', colors.borders.secondary);
      root.style.setProperty('--border-input', colors.borders.input);
      
      root.style.setProperty('--scrollbar-track', colors.special.scrollbar.track);
      root.style.setProperty('--scrollbar-thumb', colors.special.scrollbar.thumb);
      root.style.setProperty('--scrollbar-thumb-hover', colors.special.scrollbar.thumbHover);
      
      root.style.setProperty('--avatar-bg', colors.special.avatar);
      
      // 更新body背景色
      document.body.style.backgroundColor = colors.backgrounds.primary;
      document.body.style.color = colors.text.primary;
    }
  }, [themeName]);

  const handleSetTheme = (newThemeName: ThemeNames) => {
    setThemeName(newThemeName);
  };

  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
