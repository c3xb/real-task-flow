'use client';

/**
 * ============================================================================
 * realnotebook.tsx
 * ============================================================================
 * Personal Notion-style document workspace component.
 * Features included & updated:
 * 1. Background & layout matched to other app elements (bg-white dark:bg-zinc-900 with border-zinc-200 dark:border-zinc-800 rounded-2xl).
 * 2. Active formatting states (Bold, Italic, Underline, Strikethrough, Lists, Alignment, Sub/Superscript)
 *    highlighted with a checked active color state when selected inside editor.
 * 3. Font Size Control: Adjust document font size dynamically (12px to 32px) for selection and document.
 * 4. Print (PDF) & Word Export Methods: Export to MS Word (.doc) and print formatted document or save as PDF.
 * 5. Fully translated into multiple languages (en, ar, fr, es, tr) using `useLanguage()`.
 * 6. Explicit inline comments for all additions and modifications marking START and END.
 */

import React, { useState, useEffect, useRef } from 'react';

/* ADDED: Import language context hook for i18n support */
import { useLanguage } from '@/lib/LanguageContext';

/* Type definition for Notebook document structure */
export interface Notebook {
  id: string;
  title: string;
  content: string;
  icon?: string;
  coverColor?: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  fontFamily?: string;
  fontSize?: number;
  isFullWidth?: boolean;
}

interface RealnotebookProps {
  onBack?: () => void;
}

/* LocalStorage key for persisting notes */
const STORAGE_KEY = 'task-flow-realnotebooks';

/* Emoji options for notebook page icons */
const EMOJI_OPTIONS = ['📝', '💡', '🚀', '🎯', '📚', '⚡️', '🎨', '⚙️', '✨', '📌', '🧠', '💼'];

/* Cover colors with dark mode gradients */
const COVER_COLORS = [
  'bg-gradient-to-r from-red-200 via-purple-200 to-pink-200 dark:from-red-950 dark:via-purple-950 dark:to-pink-950',
  'bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 dark:from-blue-950 dark:via-indigo-950 dark:to-cyan-950',
  'bg-gradient-to-r from-emerald-200 via-teal-200 to-green-200 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950',
  'bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950',
];

/* ==========================================================================
   ADDED: Available Font Size options array (START)
   ========================================================================== */
const FONT_SIZE_OPTIONS = [12, 14, 16, 18, 20, 24, 28, 32];
/* ==========================================================================
   ADDED: Available Font Size options array (END)
   ========================================================================== */

export default function Realnotebook({ onBack }: RealnotebookProps) {
  /* ADDED: i18n language translations & layout direction */
  const { t, dir } = useLanguage();

  /* Component state management */
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [discardConfirmId, setDiscardConfirmId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /* ADDED: Active formatting state detection object */
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    subscript: false,
    superscript: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  /* Reference to the contentEditable HTML element */
  const editorRef = useRef<HTMLDivElement>(null);

  /* Initialize saved notebooks or default starter page on client mount */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Notebook[] = JSON.parse(saved);
        setNotebooks(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch (e) { }
    } else {
      const initial: Notebook = {
        id: '1',
        title: t.notebookTitle || 'Getting Started',
        icon: '📝',
        content: `<div>${t.notebookSubtitle || 'Welcome to your document workspace!'} Click anywhere to start typing...</div>`,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: 'Just now',
        isPinned: true,
        fontFamily: 'Inter',
        fontSize: 16,
        isFullWidth: false,
      };
      setNotebooks([initial]);
      setActiveId('1');
    }
    setMounted(true);
  }, []);

  /* Save notebooks to localStorage whenever updated */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    }
  }, [notebooks, mounted]);

  const activeNotebook = notebooks.find((nb) => nb.id === activeId);

  /* Synchronize editor innerHTML when active notebook changes */
  useEffect(() => {
    if (editorRef.current && activeNotebook) {
      if (editorRef.current.innerHTML !== activeNotebook.content) {
        editorRef.current.innerHTML = activeNotebook.content || '';
      }
      // Recheck text formatting active attributes
      updateActiveFormatting();
    }
  }, [activeId]);

  /* ==========================================================================
     ADDED: Function to check active formatting attributes at current cursor
     ========================================================================== */
  const updateActiveFormatting = () => {
    if (typeof document === 'undefined') return;

    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        subscript: document.queryCommandState('subscript'),
        superscript: document.queryCommandState('superscript'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      });
    } catch (err) {
      // Ignored if document selection is unavailable
    }
  };

  /* Listen for global text selection changes inside the document */
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveFormatting();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  /* Handle navigation back to main page or parent view */
  const handleGoBack = () => {
    setActiveId(null);
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  /* Create a brand new blank notebook document */
  const createBlankNotebook = () => {
    const newId = Date.now().toString();
    const newNotebook: Notebook = {
      id: newId,
      title: t.untitledPage || 'Untitled',
      icon: '📄',
      content: '',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: 'Just now',
      isPinned: false,
      fontFamily: 'Inter',
      fontSize: 16,
      isFullWidth: false,
    };

    setNotebooks((prev) => [newNotebook, ...prev]);
    setActiveId(newId);
  };

  /* Update specific property of active notebook */
  const updateNotebook = (id: string, field: keyof Notebook, value: any) => {
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === id
          ? {
            ...nb,
            [field]: value,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          : nb
      )
    );
  };

  /* Toggle page pin state (Favorites) */
  const togglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === id ? { ...nb, isPinned: !nb.isPinned } : nb))
    );
  };

  /* Delete notebook page */
  const deleteNotebook = (id: string) => {
    const updated = notebooks.filter((nb) => nb.id !== id);
    setNotebooks(updated);
    setDiscardConfirmId(null);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  /* ==========================================================================
     ADDED: Execute rich text formatting and immediately sync active attribute state
     ========================================================================== */
  const execFormatting = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current && activeId) {
      updateNotebook(activeId, 'content', editorRef.current.innerHTML);
    }
    // Re-evaluate active formatting attributes so buttons highlight in real-time
    updateActiveFormatting();
  };

  /* ==========================================================================
     ADDED: Font Size Handler (START)
     ==========================================================================
     Applies font size change to highlighted text selection and updates document state
  */
  const handleFontSizeChange = (sizePx: number) => {
    if (!activeNotebook) return;
    updateNotebook(activeNotebook.id, 'fontSize', sizePx);

    // If text is selected inside editor, wrap selection in span with font-size style
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${sizePx}px`;
      range.surroundContents(span);
      if (editorRef.current && activeId) {
        updateNotebook(activeId, 'content', editorRef.current.innerHTML);
      }
    }
  };
  /* ==========================================================================
     ADDED: Font Size Handler (END)
     ========================================================================== */

  /* ==========================================================================
     ADDED: Print / PDF & Word Export Handlers (START)
     ==========================================================================
     1. handlePrintPdf: Triggers browser print preview dialog (supports Save to PDF)
     2. handleExportWord: Generates MS Word compliant .doc file blob and initiates download
  */
  const handlePrintPdf = () => {
    if (!activeNotebook) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const documentTitle = activeNotebook.title || t.untitledPage || 'Notebook';
    const documentContent = editorRef.current ? editorRef.current.innerHTML : activeNotebook.content;
    const documentIcon = activeNotebook.icon || '📄';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${dir}">
        <head>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #111827;
              line-height: 1.6;
            }
            .header {
              display: flex;
              align-items: center;
              gap: 12px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .icon { font-size: 36px; }
            .title { font-size: 32px; font-weight: bold; margin: 0; }
            .meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
            .content { font-size: ${activeNotebook.fontSize || 16}px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="icon">${documentIcon}</span>
            <div>
              <h1 class="title">${documentTitle}</h1>
              <div class="meta">Created: ${activeNotebook.createdAt} | Updated: ${activeNotebook.updatedAt}</div>
            </div>
          </div>
          <div class="content">${documentContent}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportWord = () => {
    if (!activeNotebook) return;

    const documentTitle = activeNotebook.title || t.untitledPage || 'Notebook';
    const documentContent = editorRef.current ? editorRef.current.innerHTML : activeNotebook.content;
    const documentIcon = activeNotebook.icon || '📄';

    // HTML header formatted specifically for Microsoft Word compatibility
    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${documentTitle}</title>
          <style>
            body { font-family: Calibri, Arial, sans-serif; font-size: ${activeNotebook.fontSize || 16}px; line-height: 1.5; color: #111827; }
            h1 { font-size: 28pt; color: #1f2937; margin-bottom: 12pt; }
            .meta { font-size: 10pt; color: #6b7280; border-bottom: 1pt solid #e5e7eb; padding-bottom: 8pt; margin-bottom: 16pt; }
          </style>
        </head>
        <body>
          <h1>${documentIcon} ${documentTitle}</h1>
          <div class="meta">Task Flow Document | Updated: ${activeNotebook.updatedAt}</div>
          <div>${documentContent}</div>
        </body>
      </html>
    `;

    // Create Blob object of type application/msword
    const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  /* ==========================================================================
     ADDED: Print / PDF & Word Export Handlers (END)
     ========================================================================== */

  /* Copy plain content text to user clipboard */
  const copyContentToClipboard = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Calculate word count and character count statistics */
  const getStats = () => {
    if (!activeNotebook || !activeNotebook.content) return { words: 0, chars: 0 };
    const cleanText = activeNotebook.content.replace(/<[^>]*>/g, ' ').trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    return { words, chars: cleanText.length };
  };

  /* Filter notebooks based on user search query */
  const filteredNotebooks = notebooks.filter((nb) =>
    nb.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotebooks = filteredNotebooks.filter((nb) => nb.isPinned);
  const unpinnedNotebooks = filteredNotebooks.filter((nb) => !nb.isPinned);

  const stats = getStats();

  /* Fallback loading placeholder while client hydration finishes */
  if (!mounted) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-sm">
        {t.loadingWorkspace || 'Loading Notion workspace...'}
      </div>
    );
  }

  return (
    /* ==========================================================================
       UPDATED: Background & borders matched to other components on Dashboard & workspace
       (bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl)
       ========================================================================== */
    <div
      className="flex flex-col h-[calc(100vh-6rem)] min-h-[600px] w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-3 sm:p-4 transition-colors"
      dir={dir}
    >
      {/* Top Header Navigation Bar */}
      <header className="h-11 px-3 mb-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-md flex items-center justify-between shrink-0 select-none shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 rounded-md transition-colors"
            title="Toggle Sidebar"
          >
            <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {activeNotebook && (
            <>
              {/* Back button */}
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 rounded-md transition-colors"
                title={t.backToPages}
              >
                <svg className="w-3.5 h-3.5 stroke-[2.5] rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>{t.backToPages}</span>
              </button>
              <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-700" />
            </>
          )}

          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
            <span className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer font-medium">{t.notebookTitle}</span>
            <span>/</span>
            {activeNotebook ? (
              <div className="flex items-center gap-1.5 truncate">
                <span>{activeNotebook.icon || '📄'}</span>
                {editingTitleId === 'header-' + activeNotebook.id ? (
                  <input
                    type="text"
                    value={activeNotebook.title}
                    onChange={(e) => updateNotebook(activeNotebook.id, 'title', e.target.value)}
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingTitleId(null)}
                    autoFocus
                    className="bg-white dark:bg-zinc-950 px-1 border border-zinc-300 dark:border-zinc-700 rounded outline-none text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                  />
                ) : (
                  <span
                    onClick={() => setEditingTitleId('header-' + activeNotebook.id)}
                    className="font-semibold text-zinc-900 dark:text-zinc-100 truncate cursor-pointer hover:underline"
                    title="Click to rename"
                  >
                    {activeNotebook.title || t.untitledPage}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.noPageSelected}</span>
            )}
          </div>
        </div>

        {activeNotebook && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Full Width mode */}
            <button
              onClick={() => updateNotebook(activeNotebook.id, 'isFullWidth', !activeNotebook.isFullWidth)}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all ${activeNotebook.isFullWidth
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-2xs'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
            >
              {t.fullWidth}
            </button>
            {/* Toggle Pin Favorite */}
            <button
              onClick={() => togglePin(activeNotebook.id)}
              className={`p-1.5 rounded-md text-xs transition-colors ${activeNotebook.isPinned
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                }`}
              title={activeNotebook.isPinned ? t.unpinPage : t.pinPage}
            >
              ★
            </button>
          </div>
        )}
      </header>

      {/* Main Container Split: Sidebar + Editor */}
      <div className="flex flex-1 h-full w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
        {/* Sidebar Panel */}
        {sidebarOpen && (
          <aside className="w-60 sm:w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-950/80 shrink-0 select-none">
            {/* Create New Page Button */}
            <div className="p-2.5 border-b border-zinc-200/70 dark:border-zinc-800/70">
              <button
                onClick={createBlankNotebook}
                className="w-full py-2 px-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs transition-all active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">+</span>
                  <span>{t.addPage}</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">⌘N</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-2">
              <input
                type="text"
                placeholder={t.searchNotes}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder-zinc-400"
              />
            </div>

            {/* Notebook Pages Navigation List */}
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
              {/* Favorites Section */}
              {pinnedNotebooks.length > 0 && (
                <div>
                  <div className="px-2 mb-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    {t.favorites}
                  </div>
                  <div className="space-y-0.5">
                    {pinnedNotebooks.map((nb) => (
                      <div
                        key={nb.id}
                        onClick={() => setActiveId(nb.id)}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all ${activeId === nb.id
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70'
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <span className="text-sm shrink-0">{nb.icon || '📄'}</span>
                          <span className="truncate">{nb.title || t.untitledPage}</span>
                        </div>
                        <button
                          onClick={(e) => togglePin(nb.id, e)}
                          className={`opacity-0 group-hover:opacity-100 text-xs transition-opacity ${activeId === nb.id ? 'text-amber-300 hover:text-white' : 'text-amber-500 hover:text-zinc-400'
                            }`}
                        >
                          ★
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Private Pages Section */}
              <div>
                <div className="px-2 mb-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  {t.privatePages}
                </div>
                <div className="space-y-0.5">
                  {unpinnedNotebooks.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-zinc-400 italic">{t.noPagesFound}</div>
                  ) : (
                    unpinnedNotebooks.map((nb) => (
                      <div
                        key={nb.id}
                        onClick={() => setActiveId(nb.id)}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all ${activeId === nb.id
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70'
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <span className="text-sm shrink-0">{nb.icon || '📄'}</span>
                          <span className="truncate">{nb.title || t.untitledPage}</span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => togglePin(nb.id, e)}
                            className={`p-0.5 ${activeId === nb.id ? 'text-white/80 hover:text-white' : 'text-zinc-400 hover:text-amber-500'}`}
                            title={t.pinPage}
                          >
                            ☆
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiscardConfirmId(nb.id);
                            }}
                            className={`p-0.5 ${activeId === nb.id ? 'text-white/80 hover:text-red-200' : 'text-zinc-400 hover:text-red-500'}`}
                            title={t.deletePage}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Document Workspace Editor */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900 relative">
          {activeNotebook ? (
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
              {/* Optional Cover Image Banner */}
              {activeNotebook.coverColor && (
                <div className={`h-32 w-full shrink-0 relative ${activeNotebook.coverColor}`}>
                  <button
                    onClick={() => updateNotebook(activeNotebook.id, 'coverColor', undefined)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs transition-all"
                  >
                    {t.removeCover}
                  </button>
                </div>
              )}

              {/* ==========================================================================
                 UPDATED: Rich Text Formatting Toolbar with Active Checked Colors,
                 Font Size Controls, and Print/Word Export Methods
                 ==========================================================================
                 When activeFormats.<attribute> is true, the button is highlighted with
                 bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white shadow-xs
              */}
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-6 py-2 border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between text-xs text-zinc-500 flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/70 flex-wrap">
                  {/* Bold Button */}
                  <button
                    onClick={() => execFormatting('bold')}
                    title={t.bold}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.bold
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 font-bold shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold'
                      }`}
                  >
                    B
                  </button>

                  {/* Italic Button */}
                  <button
                    onClick={() => execFormatting('italic')}
                    title={t.italic}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.italic
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 italic shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 italic'
                      }`}
                  >
                    I
                  </button>

                  {/* Underline Button */}
                  <button
                    onClick={() => execFormatting('underline')}
                    title={t.underline}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.underline
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 underline shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 underline'
                      }`}
                  >
                    U
                  </button>

                  {/* Strikethrough Button */}
                  <button
                    onClick={() => execFormatting('strikeThrough')}
                    title={t.strikethrough}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.strikeThrough
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 line-through shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 line-through'
                      }`}
                  >
                    S
                  </button>

                  <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

                  {/* ==========================================================================
                     ADDED: Font Size Selector Control UI (START)
                     ==========================================================================
                     Allows user to choose text font size (12px - 32px)
                  */}
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.fontSize || 'Font'}:</span>
                    <select
                      value={activeNotebook.fontSize || 16}
                      onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                      className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-indigo-500"
                    >
                      {FONT_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* ==========================================================================
                     ADDED: Font Size Selector Control UI (END)
                     ========================================================================== */}

                  <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

                  {/* Bullet List Button */}
                  <button
                    onClick={() => execFormatting('insertUnorderedList')}
                    title={t.unorderedList}
                    className={`px-2 h-7 rounded text-xs font-medium transition-all ${activeFormats.insertUnorderedList
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                      }`}
                  >
                    • {t.unorderedList}
                  </button>

                  {/* Numbered List Button */}
                  <button
                    onClick={() => execFormatting('insertOrderedList')}
                    title={t.orderedList}
                    className={`px-2 h-7 rounded text-xs font-medium transition-all ${activeFormats.insertOrderedList
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs ring-1 ring-indigo-500 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                      }`}
                  >
                    1. {t.orderedList}
                  </button>

                  <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

                  {/* Text Alignment Left */}
                  <button
                    onClick={() => execFormatting('justifyLeft')}
                    title={t.alignLeft}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.justifyLeft
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs ring-1 ring-indigo-500'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                      }`}
                  >
                    ←
                  </button>

                  {/* Text Alignment Center */}
                  <button
                    onClick={() => execFormatting('justifyCenter')}
                    title={t.alignCenter}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.justifyCenter
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs ring-1 ring-indigo-500'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                      }`}
                  >
                    ↔
                  </button>

                  {/* Text Alignment Right */}
                  <button
                    onClick={() => execFormatting('justifyRight')}
                    title={t.alignRight}
                    className={`w-7 h-7 rounded text-xs transition-all ${activeFormats.justifyRight
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs ring-1 ring-indigo-500'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                      }`}
                  >
                    →
                  </button>
                </div>

                {/* ==========================================================================
                   ADDED: Print/PDF & Word Export Toolbar Buttons (START)
                   ==========================================================================
                   Buttons for exporting document as MS Word (.doc) and printing / saving to PDF
                */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Export Word (.doc) Button */}
                  <button
                    onClick={handleExportWord}
                    title={t.exportWord || 'Export Word'}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 rounded-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>📝</span>
                    <span>{t.exportWord || 'Word'}</span>
                  </button>

                  {/* Print / Save to PDF Button */}
                  <button
                    onClick={handlePrintPdf}
                    title={t.printPdf || 'Print / PDF'}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 rounded-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>🖨️</span>
                    <span>{t.printPdf || 'Print/PDF'}</span>
                  </button>

                  {/* Copy content button */}
                  <button
                    onClick={copyContentToClipboard}
                    className="px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    {copied ? t.copiedContent : t.copyContent}
                  </button>
                </div>
                {/* ==========================================================================
                   ADDED: Print/PDF & Word Export Toolbar Buttons (END)
                   ========================================================================== */}
              </div>

              {/* Document Title & Content Editable Canvas */}
              <div
                className={`flex-1 w-full mx-auto px-6 sm:px-10 py-8 flex flex-col transition-all ${activeNotebook.isFullWidth ? 'max-w-none' : 'max-w-3xl'
                  }`}
              >
                <div className="group relative mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Emoji Icon Selection */}
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-4xl hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-xl transition-colors"
                        title={t.changeIcon}
                      >
                        {activeNotebook.icon || '📄'}
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute top-14 left-0 z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl p-2 grid grid-cols-4 gap-1.5 w-48">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                updateNotebook(activeNotebook.id, 'icon', emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cover Image Add Button */}
                    {!activeNotebook.coverColor && (
                      <button
                        onClick={() =>
                          updateNotebook(
                            activeNotebook.id,
                            'coverColor',
                            COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)]
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 px-2.5 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-all"
                      >
                        {t.addCover}
                      </button>
                    )}
                  </div>

                  {/* Document Title Input */}
                  <input
                    type="text"
                    value={activeNotebook.title}
                    onChange={(e) => updateNotebook(activeNotebook.id, 'title', e.target.value)}
                    placeholder={t.untitledPage}
                    className="w-full text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 tracking-tight"
                  />
                </div>

                {/* ContentEditable Document Area with Dynamic Font Size */}
                <div
                  key={activeNotebook.id}
                  ref={editorRef}
                  contentEditable
                  style={{ fontSize: `${activeNotebook.fontSize || 16}px` }}
                  onKeyUp={updateActiveFormatting}
                  onMouseUp={updateActiveFormatting}
                  onClick={updateActiveFormatting}
                  onFocus={updateActiveFormatting}
                  onInput={() => {
                    if (editorRef.current && activeId) {
                      updateNotebook(activeId, 'content', editorRef.current.innerHTML);
                    }
                    updateActiveFormatting();
                  }}
                  className="flex-1 w-full bg-transparent outline-none text-zinc-800 dark:text-zinc-200 leading-relaxed min-h-[350px] font-normal placeholder-zinc-400 focus:outline-none"
                />

                {/* Document Bottom Footer Stats */}
                <div className="mt-12 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400 select-none">
                  <div className="flex items-center gap-3">
                    <span>{stats.words} {t.words}</span>
                    <span>•</span>
                    <span>{stats.chars} {t.characters}</span>
                  </div>
                  <span>{t.edited} {activeNotebook.updatedAt}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State when no page is active */
            <div className="flex flex-col items-center justify-center flex-1 text-zinc-400 text-sm">
              <span className="text-4xl mb-3">📄</span>
              <p>{t.noPageSelected}</p>
              <button
                onClick={createBlankNotebook}
                className="mt-3 px-3.5 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold shadow-2xs hover:opacity-90 transition-all active:scale-95"
              >
                {t.createFirstPage}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog for Deleting Pages */}
      {discardConfirmId && (
        <div className="animate-scale-up fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{t.deletePageTitle}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.deletePageConfirm}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDiscardConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {t.cancelDelete}
              </button>
              <button
                onClick={() => deleteNotebook(discardConfirmId)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
              >
                {t.deletePage}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}