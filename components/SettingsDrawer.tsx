'use client';

import React, { useEffect, useRef } from 'react';
import { X, Settings, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages: { code: Locale; labelKey: 'english' | 'arabic' | 'french' | 'spanish' | 'turkish'; flag: string }[] = [
  { code: 'en', labelKey: 'english', flag: 'us' },
  { code: 'ar', labelKey: 'arabic', flag: 'SA' },
  { code: 'fr', labelKey: 'french', flag: 'FR' },
  { code: 'es', labelKey: 'spanish', flag: 'ES' },
  { code: 'tr', labelKey: 'turkish', flag: 'TR' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { locale, setLocale, t } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.settingsTitle}
        className={`fixed top-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${locale === 'ar'
            ? `left-0 border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `right-0 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Settings className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="font-semibold text-lg text-black dark:text-white">
              {t.settingsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-2 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Language Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {t.languageSection}
              </h3>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => {
                const isActive = locale === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${isActive
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{t[lang.labelKey]}</span>
                    {isActive && (
                      <span className="ms-auto text-xs opacity-80">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
            Task Flow v0.1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
