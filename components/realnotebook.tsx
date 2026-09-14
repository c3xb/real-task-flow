'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface Notebook {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  fontFamily?: string;
  fontSize?: number;
  highlightColor?: string;
}

const STORAGE_KEY = 'task-flow-realnotebooks';

const FONT_OPTIONS = [
  'Arial',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Nunito',
  'Ubuntu',
  'Georgia',
  'Times New Roman',
  'Merriweather',
  'Playfair Display',
  'PT Serif',
  'Courier New',
  'Fira Code',
  'Monaco',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Verdana',
  'Garamond',
];

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 64];

export default function Realnotebook() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Notebook[] = JSON.parse(saved);
        setNotebooks(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    }
  }, [notebooks, mounted]);

  const activeNotebook = notebooks.find((nb) => nb.id === activeId);

  useEffect(() => {
    if (editorRef.current && activeNotebook) {
      if (editorRef.current.innerHTML !== activeNotebook.content) {
        editorRef.current.innerHTML = activeNotebook.content || '';
      }
    }
  }, [activeId, mobileView]);

  const createBlankNotebook = () => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title: `Notebook ${notebooks.length + 1}`,
      content: '',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: false,
      fontFamily: 'Inter',
      fontSize: 16,
      highlightColor: '#fef08a',
    };

    setNotebooks((prev) => [newNotebook, ...prev]);
    setActiveId(newNotebook.id);
    setMobileView('editor');
  };

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

  const togglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === id ? { ...nb, isPinned: !nb.isPinned } : nb))
    );
  };

  const discardNotebook = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notebooks.filter((nb) => nb.id !== id);
    setNotebooks(updated);
    if (activeId === id) {
      const nextNotebook = updated.length > 0 ? updated[0].id : null;
      setActiveId(nextNotebook);
      if (!nextNotebook) setMobileView('list');
    }
  };

  const applyUnderline = () => {
    document.execCommand('underline', false);
    if (editorRef.current && activeId) {
      updateNotebook(activeId, 'content', editorRef.current.innerHTML);
    }
  };

  const applyHighlight = (color: string) => {
    document.execCommand('hiliteColor', false, color);
    if (editorRef.current && activeId) {
      updateNotebook(activeId, 'content', editorRef.current.innerHTML);
    }
  };

  const exportToWord = () => {
    if (!activeNotebook) return;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" +
      activeNotebook.title +
      '</title></head><body>';
    const footer = '</body></html>';
    const html = header + `<h1>${activeNotebook.title}</h1>` + activeNotebook.content + footer;
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNotebook.title || 'notebook'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!activeNotebook) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeNotebook.title || 'Notebook'}</title>
          <style>
            body { font-family: ${activeNotebook.fontFamily || 'sans-serif'}; font-size: ${activeNotebook.fontSize || 16}px; padding: 20px; color: #000; }
            h1 { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${activeNotebook.title || 'Untitled Notebook'}</h1>
          <div>${activeNotebook.content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const sortedNotebooks = [...notebooks].sort((a, b) => {
    if (!!a.isPinned === !!b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });

  if (!mounted) {
    return <div className="p-6 text-zinc-400 dark:text-zinc-500">Loading notebooks...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] md:h-[620px] w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs">
      
      {/* Sidebar List Section */}
      <div
        className={`${
          mobileView === 'editor' ? 'hidden md:flex' : 'flex'
        } w-full md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 flex-col bg-zinc-50/50 dark:bg-zinc-950/40 h-full overflow-hidden`}
      >
        <button
          onClick={createBlankNotebook}
          className="w-full py-2.5 px-4 mb-3 sm:mb-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <span>+</span> Create New Notebook
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sortedNotebooks.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-8">
              No notebooks available. Click "Create New Notebook" to add your first notebook.
            </p>
          ) : (
            sortedNotebooks.map((nb) => (
              <div
                key={nb.id}
                onClick={() => {
                  setActiveId(nb.id);
                  setMobileView('editor');
                }}
                className={`p-3 sm:p-3.5 rounded-xl cursor-pointer transition-all flex justify-between items-start group border ${
                  activeId === nb.id
                    ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="truncate pr-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    {nb.isPinned && (
                      <span className="text-xs text-amber-500 dark:text-amber-400" title="Pinned">📌</span>
                    )}
                    {editingTitleId === nb.id ? (
                      <input
                        type="text"
                        value={nb.title}
                        onChange={(e) => updateNotebook(nb.id, 'title', e.target.value)}
                        onBlur={() => setEditingTitleId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingTitleId(null)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-1 py-0.5 border border-zinc-300 dark:border-zinc-700 rounded outline-none w-full"
                      />
                    ) : (
                      <h4
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingTitleId(nb.id);
                        }}
                        className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100"
                        title="Double-click to rename"
                      >
                        {nb.title || 'Untitled'}
                      </h4>
                    )}
                  </div>
                  <p
                    className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1"
                    dangerouslySetInnerHTML={{ __html: nb.content || 'Empty notebook...' }}
                  />
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1.5">{nb.createdAt}</span>
                </div>

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => togglePin(nb.id, e)}
                    className={`text-xs p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
                      nb.isPinned ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                    title={nb.isPinned ? 'Unpin' : 'Pin'}
                  >
                    📌
                  </button>
                  <button
                    onClick={(e) => discardNotebook(nb.id, e)}
                    className="text-xs p-1.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title="Discard"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor Section */}
      <div
        className={`${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        } flex-1 p-3 sm:p-5 flex-col bg-white dark:bg-zinc-900 h-full overflow-hidden`}
      >
        {activeNotebook ? (
          <>
            {/* Header / Title Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 pb-2 sm:mb-3 sm:pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-2 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
                  title="Back to list"
                >
                  ← Back
                </button>
                <input
                  type="text"
                  value={activeNotebook.title}
                  onChange={(e) => updateNotebook(activeNotebook.id, 'title', e.target.value)}
                  placeholder="Notebook Title"
                  className="text-lg sm:text-xl font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
                <button
                  onClick={exportToWord}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Export as Word"
                >
                  📄 <span className="hidden sm:inline">Word</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Export as PDF"
                >
                  📑 <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={() => togglePin(activeNotebook.id)}
                  className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    activeNotebook.isPinned
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  📌 <span className="hidden sm:inline">{activeNotebook.isPinned ? 'Pinned' : 'Pin'}</span>
                </button>
                <button
                  onClick={() => discardNotebook(activeNotebook.id)}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Discard"
                >
                  🗑️ <span className="hidden sm:inline">Discard</span>
                </button>
              </div>
            </div>

            {/* Mobile Scrollable Formatting Toolbar */}
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none">
              <select
                value={activeNotebook.fontFamily || 'Inter'}
                onChange={(e) => updateNotebook(activeNotebook.id, 'fontFamily', e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 outline-none text-xs font-medium cursor-pointer shrink-0"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 shrink-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Size:</span>
                <select
                  value={activeNotebook.fontSize || 16}
                  onChange={(e) => updateNotebook(activeNotebook.id, 'fontSize', Number(e.target.value))}
                  className="bg-transparent text-zinc-900 dark:text-zinc-100 outline-none text-xs font-medium cursor-pointer"
                >
                  {FONT_SIZES.map((size) => (
                    <option key={size} value={size} className="bg-white dark:bg-zinc-900">
                      {size}px
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={applyUnderline}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold underline transition-colors shrink-0"
                title="Underline Selected Text"
              >
                U
              </button>

              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 shrink-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Highlight:</span>
                <input
                  type="color"
                  value={activeNotebook.highlightColor || '#fef08a'}
                  onChange={(e) => {
                    updateNotebook(activeNotebook.id, 'highlightColor', e.target.value);
                    applyHighlight(e.target.value);
                  }}
                  className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
                  title="Choose Highlight Color"
                />
                <button
                  onClick={() => applyHighlight(activeNotebook.highlightColor || '#fef08a')}
                  className="text-xs px-1 hover:text-zinc-900 dark:hover:text-zinc-100"
                  title="Apply Highlight"
                >
                  🖍️
                </button>
              </div>

              <span className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 ml-auto whitespace-nowrap shrink-0">
                Saved {activeNotebook.updatedAt}
              </span>
            </div>

            {/* ContentEditable Text Area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={() => {
                if (editorRef.current && activeId) {
                  updateNotebook(activeId, 'content', editorRef.current.innerHTML);
                }
              }}
              style={{
                fontFamily: activeNotebook.fontFamily || 'Inter',
                fontSize: `${activeNotebook.fontSize || 16}px`,
              }}
              className="flex-1 w-full bg-transparent outline-none text-zinc-800 dark:text-zinc-200 leading-relaxed overflow-y-auto min-h-[200px]"
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-zinc-400 dark:text-zinc-500 text-sm">
            <p className="text-center">Select a notebook or create a new one to start writing.</p>
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden mt-4 py-2 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs"
            >
              View Notebook List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}