"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Contrast = 'normal' | 'high';

interface AccessibilityContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  contrast: Contrast;
  setContrast: (contrast: Contrast) => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [contrast, setContrastState] = useState<Contrast>('normal');
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    const storedTheme = (localStorage.getItem('accessibility-theme') as Theme) || 'light';
    const storedContrast = (localStorage.getItem('accessibility-contrast') as Contrast) || 'normal';
    const storedSize = localStorage.getItem('accessibility-font-size');
    setThemeState(storedTheme);
    setContrastState(storedContrast);
    if (storedSize) {
      setFontSize(parseFloat(storedSize));
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('accessibility-theme', theme);

    // Contrast
    root.classList.remove('normal-contrast', 'high-contrast');
    root.classList.add(contrast === 'high' ? 'high-contrast' : 'normal-contrast');
    localStorage.setItem('accessibility-contrast', contrast);

    // Font Size
    root.style.fontSize = `${fontSize}px`;
    localStorage.setItem('accessibility-font-size', fontSize.toString());

  }, [theme, contrast, fontSize]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setContrast = (newContrast: Contrast) => {
    setContrastState(newContrast);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)); // Cap at 24px
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12)); // Cap at 12px
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        setTheme,
        contrast,
        setContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
