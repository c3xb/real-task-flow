'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Globe,
  Layers,
  Plus,
  ArrowRight,
  ExternalLink,
  FolderKanban,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages: { code: Locale; labelKey: 'english' | 'arabic' | 'french' | 'spanish' | 'turkish'; flag: string }[] = [
  { code: 'en', labelKey: 'english', flag: '🇺🇸' },
  { code: 'ar', labelKey: 'arabic', flag: '🇸🇦' },
  { code: 'fr', labelKey: 'french', flag: '🇫🇷' },
  { code: 'es', labelKey: 'spanish', flag: '🇪🇸' },
  { code: 'tr', labelKey: 'turkish', flag: '🇹🇷' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { locale, setLocale, t, dir } = useLanguage();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
      setWorkspaces(saved);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isRtl = locale === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.settingsTitle}
            dir={dir}
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed top-0 z-50 h-full w-96 max-w-[92vw] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col ${
              isRtl ? 'left-0 border-r' : 'right-0 border-l'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="font-semibold text-base text-black dark:text-white">
                    {t.settingsTitle}
                  </h2>
                  <p className="text-[11px] text-zinc-400">Task Flow Preferences</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="p-2.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
              {/* Notion-Style Workspaces Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      {t.workspacesTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t.workspacesSubtitle}
                </p>

                {/* Prominent Native Next.js Link */}
                <Link
                  href="/workspaces/new"
                  onClick={onClose}
                  className="w-full py-3 px-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center justify-between cursor-pointer shadow-xs hover:opacity-90 active:scale-[0.98] transition"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{t.newWorkspaceOrProject}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>

                {/* Existing Workspaces List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {t.activeWorkspaces} ({workspaces.length})
                  </span>

                  {workspaces.length === 0 ? (
                    <div className="p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                      {t.noWorkspacesYet}
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {workspaces.map((ws) => (
                        <div
                          key={ws.id}
                          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-2 hover:border-zinc-300 transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                                ws.colorGradient || 'from-indigo-500 to-blue-600'
                              } flex items-center justify-center text-white shrink-0 shadow-2xs`}
                            >
                              <FolderKanban className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {ws.name}
                              </p>
                              <span className="text-[10px] text-zinc-400 capitalize">
                                {ws.entityType || 'space'} • {ws.layout || 'board'}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/workspace/${ws.id}`}
                            onClick={onClose}
                            className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-95 transition cursor-pointer shrink-0 inline-block text-center"
                          >
                            {t.openWorkspace}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-zinc-100 dark:border-zinc-800" />

              {/* Language Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                    {t.languageSection}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {languages.map((lang) => {
                    const isActive = locale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLocale(lang.code)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="font-semibold">{t[lang.labelKey]}</span>
                        {isActive && <Check className="ms-auto w-4 h-4 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
                Task Flow v2.0 Enterprise
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;