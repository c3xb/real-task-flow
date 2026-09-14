'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations, { Locale, Translations } from './i18n';

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = 'task-flow-locale';

const isValidLocale = (value: unknown): value is Locale =>
  value === 'en' || value === 'ar' || value === 'fr' || value === 'es' || value === 'tr';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  const applyLocale = (loc: Locale) => {
    const dir = loc === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', loc);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const domLocale = document.documentElement.getAttribute('lang');

    // Check localStorage FIRST before checking default DOM attribute
    const activeLocale = isValidLocale(saved)
      ? saved
      : (isValidLocale(domLocale) ? domLocale : 'en');

    setLocaleState(activeLocale);
    applyLocale(activeLocale);
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    applyLocale(newLocale);
  }, []);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale] || translations['en'];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, dir }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden', display: 'contents' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};