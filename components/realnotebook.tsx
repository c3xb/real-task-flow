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
  tags?: string[];
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPinned, setFilterPinned] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discardConfirmId, setDiscardConfirmId] = useState<string | null>(null);
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

  const duplicateNotebook = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nbToDup = notebooks.find((n) => n.id === id);
    if (!nbToDup) return;

    const duplicated: Notebook = {
      ...nbToDup,
      id: Date.now().toString(),
      title: `${nbToDup.title} (Copy)`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNotebooks((prev) => [duplicated, ...prev]);
    setActiveId(duplicated.id);
  };

  const togglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === id ? { ...nb, isPinned: !nb.isPinned } : nb))
    );
  };

  const discardNotebook = (id: string) => {
    const updated = notebooks.filter((nb) => nb.id !== id);
    setNotebooks(updated);
    setDiscardConfirmId(null);
    if (activeId === id) {
      const nextNotebook = updated.length > 0 ? updated[0].id : null;
      setActiveId(nextNotebook);
      if (!nextNotebook) setMobileView('list');
    }
  };

  const execFormatting = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current && activeId) {
      updateNotebook(activeId, 'content', editorRef.current.innerHTML);
    }
  };

  const copyContentToClipboard = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            body { font-family: ${activeNotebook.fontFamily || 'sans-serif'}; font-size: ${activeNotebook.fontSize || 16}px; padding: 25px; color: #111; line-height: 1.6; }
            h1 { border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 24px; }
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

  const getStats = () => {
    if (!activeNotebook || !activeNotebook.content) return { words: 0, chars: 0, readTime: 0 };
    const cleanText = activeNotebook.content.replace(/<[^>]*>/g, ' ').trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const chars = cleanText.length;
    const readTime = Math.ceil(words / 200);
    return { words, chars, readTime };
  };

  const filteredNotebooks = notebooks
    .filter((nb) => {
      const matchesSearch =
        nb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nb.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPin = filterPinned ? nb.isPinned : true;
      return matchesSearch && matchesPin;
    })
    .sort((a, b) => (!!b.isPinned ? 1 : 0) - (!!a.isPinned ? 1 : 0));

  const stats = getStats();

  if (!mounted) {
    return <div className="p-6 text-zinc-400 dark:text-zinc-500">Loading workspace...</div>;
  }

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100vh-2rem)] md:h-[680px] w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs transition-all">
      
      {/* Sidebar List Section */}
      <div
        className={`${
          mobileView === 'editor' || focusMode ? 'hidden' : 'flex'
        } w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 flex-col bg-zinc-50/60 dark:bg-zinc-950/40 h-full overflow-hidden shrink-0 transition-all`}
      >
        <button
          onClick={createBlankNotebook}
          className="w-full py-2.5 px-4 mb-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <span>+</span> Create Notebook
        </button>

        {/* Search & Filter Bar */}
        <div className="space-y-2 mb-3 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <span className="absolute left-2.5 top-2 text-xs text-zinc-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setFilterPinned(!filterPinned)}
              className={`px-2 py-1 rounded-md border text-[11px] transition-colors flex items-center gap-1 ${
                filterPinned
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              📌 {filterPinned ? 'Showing Pinned' : 'Filter Pinned'}
            </button>
            <span className="text-[10px] text-zinc-400">{filteredNotebooks.length} notes</span>
          </div>
        </div>

        {/* Notebook List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredNotebooks.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-8">
              No notebooks found.
            </p>
          ) : (
            filteredNotebooks.map((nb) => (
              <div
                key={nb.id}
                onClick={() => {
                  setActiveId(nb.id);
                  setMobileView('editor');
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex justify-between items-start group border ${
                  activeId === nb.id
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="truncate pr-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    {nb.isPinned && (
                      <span className="text-xs text-amber-500" title="Pinned">📌</span>
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

                <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => duplicateNotebook(nb.id, e)}
                    className="text-xs p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => togglePin(nb.id, e)}
                    className={`text-xs p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
                      nb.isPinned ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                    title={nb.isPinned ? 'Unpin' : 'Pin'}
                  >
                    📌
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDiscardConfirmId(nb.id);
                    }}
                    className="text-xs p-1 text-zinc-400 hover:text-red-500 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
          mobileView === 'list' && !focusMode ? 'hidden md:flex' : 'flex'
        } flex-1 p-3 sm:p-5 flex-col bg-white dark:bg-zinc-900 h-full overflow-hidden transition-all`}
      >
        {activeNotebook ? (
          <>
            {/* Header / Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 gap-2 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
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

              <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    focusMode
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Toggle Focus Mode"
                >
                  {focusMode ? '📖 Exit Focus' : '🔍 Focus'}
                </button>
                <button
                  onClick={copyContentToClipboard}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Copy Raw Text"
                >
                  {copied ? '✅ Copied' : '📋 Copy'}
                </button>
                <button
                  onClick={exportToWord}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Export Word"
                >
                  📄 Word
                </button>
                <button
                  onClick={exportToPDF}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  title="Export PDF"
                >
                  📑 PDF
                </button>
                <button
                  onClick={() => togglePin(activeNotebook.id)}
                  className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    activeNotebook.isPinned
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  📌 {activeNotebook.isPinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => setDiscardConfirmId(activeNotebook.id)}
                  className="p-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Discard"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Rich Formatting Toolbar */}
            <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-none">
              {/* Font Picker */}
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

              {/* Size Picker */}
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

              {/* Rich Text Format Buttons */}
              <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0.5 shrink-0">
                <button
                  onClick={() => execFormatting('bold')}
                  className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Bold"
                >
                  B
                </button>
                <button
                  onClick={() => execFormatting('italic')}
                  className="w-6 h-6 rounded flex items-center justify-center italic hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Italic"
                >
                  I
                </button>
                <button
                  onClick={() => execFormatting('underline')}
                  className="w-6 h-6 rounded flex items-center justify-center underline hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Underline"
                >
                  U
                </button>
                <button
                  onClick={() => execFormatting('strikeThrough')}
                  className="w-6 h-6 rounded flex items-center justify-center line-through hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Strikethrough"
                >
                  S
                </button>
              </div>

              {/* List Formatting */}
              <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0.5 shrink-0">
                <button
                  onClick={() => execFormatting('insertUnorderedList')}
                  className="px-1.5 h-6 rounded flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  onClick={() => execFormatting('insertOrderedList')}
                  className="px-1.5 h-6 rounded flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Numbered List"
                >
                  1. List
                </button>
              </div>

              {/* Highlight Picker */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 shrink-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Highlight:</span>
                <input
                  type="color"
                  value={activeNotebook.highlightColor || '#fef08a'}
                  onChange={(e) => {
                    updateNotebook(activeNotebook.id, 'highlightColor', e.target.value);
                    execFormatting('hiliteColor', e.target.value);
                  }}
                  className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
                  title="Choose Color"
                />
                <button
                  onClick={() => execFormatting('hiliteColor', activeNotebook.highlightColor || '#fef08a')}
                  className="text-xs px-1 hover:text-zinc-900 dark:hover:text-zinc-100"
                  title="Apply Highlight"
                >
                  🖍️
                </button>
              </div>
            </div>

            {/* Editable Canvas */}
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
              className="flex-1 w-full bg-transparent outline-none text-zinc-800 dark:text-zinc-200 leading-relaxed overflow-y-auto min-h-[200px] p-1"
            />

            {/* Editor Bottom Status Bar */}
            <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
              <div className="flex items-center gap-3">
                <span>{stats.words} words</span>
                <span>{stats.chars} characters</span>
                <span>{stats.readTime} min read</span>
              </div>
              <span>Saved {activeNotebook.updatedAt}</span>
            </div>
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

      {/* Discard Confirmation Modal */}
      {discardConfirmId && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl max-w-sm w-full shadow-lg space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Discard Notebook?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Are you sure you want to delete this notebook? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDiscardConfirmId(null)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => discardNotebook(discardConfirmId)}
                className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}