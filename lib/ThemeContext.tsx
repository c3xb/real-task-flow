'use client';

/**
 * ============================================================================
 * ThemeContext.tsx
 * ============================================================================
 * Central provider and state hook for managing the App Theme in Task Flow.
 * Handles:
 * 1. Theme mode: 'light' | 'dark' | 'system'
 * 2. Accent color scheme: 'zinc' | 'indigo' | 'emerald' | 'ocean' | 'amber' | 'rose'
 * 3. Synchronization with localStorage, document DOM classes, and custom events.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Type definitions for Theme Mode and Accent Colors
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'zinc' | 'indigo' | 'emerald' | 'ocean' | 'amber' | 'rose';

interface ThemeContextValue {
  // Current active theme mode ('light', 'dark', or 'system')
  themeMode: ThemeMode;
  // Function to set and persist theme mode
  setThemeMode: (mode: ThemeMode) => void;
  // Current active accent color
  accentColor: AccentColor;
  // Function to set and persist accent color
  setAccentColor: (accent: AccentColor) => void;
  // Computed boolean indicating if dark mode is currently active on DOM
  isDark: boolean;
}

// Create React Context for Theme Management
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Storage keys used for persistence in browser LocalStorage
const THEME_MODE_KEY = 'tf_theme_mode';
const THEME_ACCENT_KEY = 'tf_theme_accent';
const LEGACY_THEME_KEY = 'theme'; // Compatibility with existing code

/**
 * ThemeProvider Component
 * Wraps the app layout to provide reactive theme state and automatic DOM updates.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state for theme mode (defaulting to system or saved value)
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  // Local state for accent color
  const [accentColor, setAccentColorState] = useState<AccentColor>('indigo');
  // State for resolved dark mode boolean
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme configuration from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved theme mode or check legacy 'theme' key
    const savedMode = (localStorage.getItem(THEME_MODE_KEY) || localStorage.getItem(LEGACY_THEME_KEY)) as ThemeMode | null;
    const initialMode: ThemeMode = (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') ? savedMode : 'system';

    // Load saved accent color
    const savedAccent = localStorage.getItem(THEME_ACCENT_KEY) as AccentColor | null;
    const initialAccent: AccentColor = savedAccent || 'indigo';

    setThemeModeState(initialMode);
    setAccentColorState(initialAccent);

    // Apply initial DOM classes and data attributes
    applyThemeToDOM(initialMode, initialAccent);
  }, []);

  /**
   * Function to evaluate dark mode state and apply appropriate Tailwind '.dark' class
   * to documentElement, as well as 'data-accent' attribute.
   */
  const applyThemeToDOM = (mode: ThemeMode, accent: AccentColor) => {
    if (typeof document === 'undefined') return;

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeIsDark = mode === 'dark' || (mode === 'system' && systemPrefersDark);

    setIsDark(activeIsDark);

    // Toggle .dark class on html root element for Tailwind CSS dark variant
    if (activeIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(LEGACY_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(LEGACY_THEME_KEY, 'light');
    }

    // Set accent color data attribute on html element
    document.documentElement.setAttribute('data-accent', accent);
  };

  /**
   * Handler to update theme mode state and trigger DOM updates & persistence
   */
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_MODE_KEY, mode);
    applyThemeToDOM(mode, accentColor);

    // Notify other components (e.g. Dashboard) via custom window event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('theme-change'));
    }
  };

  /**
   * Handler to update accent color state and trigger DOM updates & persistence
   */
  const setAccentColor = (accent: AccentColor) => {
    setAccentColorState(accent);
    localStorage.setItem(THEME_ACCENT_KEY, accent);
    applyThemeToDOM(themeMode, accent);

    // Notify other components via custom window event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('theme-change'));
    }
  };

  // Listen for system theme changes if mode is set to 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (themeMode === 'system') {
        applyThemeToDOM('system', accentColor);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode, accentColor]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, accentColor, setAccentColor, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access ThemeContext values safely within functional components
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback default values if component is used outside ThemeProvider
    return {
      themeMode: 'system',
      setThemeMode: () => { },
      accentColor: 'indigo',
      setAccentColor: () => { },
      isDark: false,
    };
  }
  return ctx;
};
