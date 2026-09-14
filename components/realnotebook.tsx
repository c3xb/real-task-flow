'use client';

import React, { useState, useEffect } from 'react';

export interface Notebook {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isPinned?: boolean;
}

const STORAGE_KEY = 'task-flow-realnotebooks';

export default function RealNotebook() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed: Notebook[] = JSON.parse(saved);
                setNotebooks(parsed);
                if (parsed.length > 0) setActiveId(parsed[0].id);
            } catch (e) { }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
        }
    }, [notebooks, mounted]);

    const createBlankNotebook = () => {
        const newNotebook: Notebook = {
            id: Date.now().toString(),
            title: `Notebook ${notebooks.length + 1}`,
            content: '',
            createdAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPinned: false,
        };

        setNotebooks((prev) => [newNotebook, ...prev]);
        setActiveId(newNotebook.id);
    };

    const updateNotebook = (id: string, field: 'title' | 'content', value: string) => {
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
            setActiveId(updated.length > 0 ? updated[0].id : null);
        }
    };

    // Keep pinned notebooks sorted at the top
    const sortedNotebooks = [...notebooks].sort((a, b) => {
        if (!!a.isPinned === !!b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
    });

    const activeNotebook = notebooks.find((nb) => nb.id === activeId);

    if (!mounted) {
        return <div className="p-6 text-zinc-400 dark:text-zinc-500">Loading notebooks...</div>;
    }

    return (
        <div className="flex h-[550px] w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/40">
                <button
                    onClick={createBlankNotebook}
                    className="w-full py-2.5 px-4 mb-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
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
                                onClick={() => setActiveId(nb.id)}
                                className={`p-3.5 rounded-xl cursor-pointer transition-all flex justify-between items-start group border ${activeId === nb.id
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
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
                                        {nb.content || 'Empty notebook...'}
                                    </p>
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-2">{nb.createdAt}</span>
                                </div>

                                {/* Sidebar Quick Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => togglePin(nb.id, e)}
                                        className={`text-xs p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${nb.isPinned ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                                            }`}
                                        title={nb.isPinned ? 'Unpin' : 'Pin'}
                                    >
                                        📌
                                    </button>
                                    <button
                                        onClick={(e) => discardNotebook(nb.id, e)}
                                        className="text-xs p-1 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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

            {/* Editor Area */}
            <div className="flex-1 p-6 flex flex-col bg-white dark:bg-zinc-900">
                {activeNotebook ? (
                    <>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-4">
                            <input
                                type="text"
                                value={activeNotebook.title}
                                onChange={(e) => updateNotebook(activeNotebook.id, 'title', e.target.value)}
                                placeholder="Notebook Title"
                                className="text-xl font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 w-full"
                            />

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => togglePin(activeNotebook.id)}
                                    className={`p-1.5 px-2.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${activeNotebook.isPinned
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium'
                                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    📌 {activeNotebook.isPinned ? 'Pinned' : 'Pin'}
                                </button>
                                <button
                                    onClick={() => discardNotebook(activeNotebook.id)}
                                    className="p-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                                >
                                    🗑️ Discard
                                </button>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap ml-2">
                                    Saved {activeNotebook.updatedAt}
                                </span>
                            </div>
                        </div>

                        <textarea
                            value={activeNotebook.content}
                            onChange={(e) => updateNotebook(activeNotebook.id, 'content', e.target.value)}
                            placeholder="Start typing your notes here..."
                            className="flex-1 w-full bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm leading-relaxed"
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-zinc-400 dark:text-zinc-500 text-sm">
                        <p>Select a notebook or create a new one to start writing.</p>
                    </div>
                )}
            </div>
        </div>
    );
}