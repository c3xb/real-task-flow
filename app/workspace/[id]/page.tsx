'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Columns3,
  ListTodo,
  TableProperties,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  FolderKanban,
  Target,
  Code2,
  BookOpen,
  Briefcase,
  Zap,
  Compass,
  Cpu,
  Bookmark,
  Search,
  Calendar,
  MoreHorizontal,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Check,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export interface WorkspaceItem {
  id: string;
  title: string;
  description?: string;
  status: 'Backlog' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  kanban: FolderKanban,
  target: Target,
  code: Code2,
  book: BookOpen,
  briefcase: Briefcase,
  zap: Zap,
  compass: Compass,
  cpu: Cpu,
  bookmark: Bookmark,
};

const PRIORITY_CONFIG: Record<WorkspaceItem['priority'], { label: string; color: string; dot: string }> = {
  Low: { label: 'Low', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800', dot: 'bg-zinc-400' },
  Medium: { label: 'Medium', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30', dot: 'bg-blue-500' },
  High: { label: 'High', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30', dot: 'bg-amber-500' },
  Critical: { label: 'Critical', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30', dot: 'bg-rose-500' },
};

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const workspaceId = unwrappedParams.id;
  const router = useRouter();
  const { t, dir } = useLanguage();

  const [workspace, setWorkspace] = useState<any>(null);
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [activeView, setActiveView] = useState<'board' | 'list' | 'table'>('board');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<WorkspaceItem['priority']>('Medium');
  const [newItemColumn, setNewItemColumn] = useState<WorkspaceItem['status']>('Backlog');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    const savedWorkspaces = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
    const found = savedWorkspaces.find((w: any) => w.id === workspaceId);

    if (found) {
      setWorkspace(found);
      setActiveView(found.layout || 'board');
    } else {
      setWorkspace({
        id: workspaceId,
        name: 'Untitled Space',
        description: 'Manage tasks, track deliverables, and coordinate team priorities.',
        entityType: 'workspace',
        iconName: 'kanban',
        layout: 'board',
        visibility: 'private',
        createdAt: new Date().toISOString(),
      });
    }

    const savedItems = JSON.parse(localStorage.getItem(`tf_workspace_items_${workspaceId}`) || '[]');
    setItems(savedItems);
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId && items.length >= 0) {
      localStorage.setItem(`tf_workspace_items_${workspaceId}`, JSON.stringify(items));
    }
  }, [items, workspaceId]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: WorkspaceItem = {
      id: `item_${Date.now()}`,
      title: newItemTitle.trim(),
      status: newItemColumn,
      priority: newItemPriority,
      dueDate: new Date().toISOString().split('T')[0],
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemTitle('');
    setIsAddingItem(false);
  };

  const handleMoveStatus = (id: string, newStatus: WorkspaceItem['status']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleMovePriority = (id: string, newPriority: WorkspaceItem['priority']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteWorkspace = () => {
    if (confirm('Are you sure you want to delete this space?')) {
      const savedWorkspaces = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
      const filtered = savedWorkspaces.filter((w: any) => w.id !== workspaceId);
      localStorage.setItem('tf_workspaces', JSON.stringify(filtered));
      localStorage.removeItem(`tf_workspace_items_${workspaceId}`);
      router.push('/');
    }
  };

  const IconComponent = workspace?.iconName ? ICON_MAP[workspace.iconName] || FolderKanban : FolderKanban;

  const COLUMNS: { id: WorkspaceItem['status']; label: string; indicatorBg: string }[] = [
    { id: 'Backlog', label: t.columnBacklog || 'Backlog', indicatorBg: 'bg-zinc-400 dark:bg-zinc-500' },
    { id: 'In Progress', label: t.columnInProgress || 'In Progress', indicatorBg: 'bg-blue-500' },
    { id: 'In Review', label: t.columnInReview || 'In Review', indicatorBg: 'bg-amber-500' },
    { id: 'Done', label: t.columnDone || 'Done', indicatorBg: 'bg-emerald-500' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const completedCount = items.filter((i) => i.status === 'Done').length;
  const completionPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length;
  const criticalCount = items.filter((i) => i.priority === 'Critical' || i.priority === 'High').length;

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 selection:bg-indigo-500/20 selection:text-indigo-600" dir={dir}>
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium">{workspace?.entityType === 'workspace' ? 'Workspace' : 'Project'}</span>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{workspace?.name || 'Untitled Space'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteWorkspace}
              className="px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition cursor-pointer"
            >
              Delete Space
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {workspace?.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                  {workspace?.entityType || 'Workspace'}
                </span>
              </div>
              {workspace?.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setNewItemColumn('Backlog');
                setIsAddingItem(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Progress</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{completionPercentage}%</span>
              <span className="text-xs text-zinc-400">{completedCount} of {items.length} done</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">In Flight</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{inProgressCount}</div>
            <p className="text-[11px] text-zinc-400">Tasks actively being worked on</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Priority Tasks</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{criticalCount}</div>
            <p className="text-[11px] text-zinc-400">High & Critical urgency items</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Total Backlog</span>
              <ListTodo className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{items.length}</div>
            <p className="text-[11px] text-zinc-400">Total registered work items</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1 bg-zinc-200/50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 self-start">
            <button
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeView === 'board'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeView === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-2.5 py-1 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 mr-1" />
              <span className="text-zinc-400 text-[11px]">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer text-xs"
              >
                <option value="all">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition w-full"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isAddingItem && (
            <motion.form
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onSubmit={handleAddItem}
              className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row gap-3 items-center"
            >
              <input
                type="text"
                autoFocus
                required
                placeholder="Enter task name or details..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-zinc-400 w-full"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={newItemPriority}
                  onChange={(e) => setNewItemPriority(e.target.value as WorkspaceItem['priority'])}
                  className="text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>

                <select
                  value={newItemColumn}
                  onChange={(e) => setNewItemColumn(e.target.value as WorkspaceItem['status'])}
                  className="text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl cursor-pointer hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {activeView === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colItems = filteredItems.filter((i) => i.status === col.id);
              return (
                <div
                  key={col.id}
                  className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.indicatorBg}`} />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {col.label}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {colItems.length}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setNewItemColumn(col.id);
                        setIsAddingItem(true);
                      }}
                      className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 min-h-[160px]">
                    {colItems.length === 0 ? (
                      <div className="h-24 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center text-[11px] text-zinc-400">
                        Empty column
                      </div>
                    ) : (
                      colItems.map((item) => {
                        const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition group space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                                {item.title}
                              </p>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-zinc-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer p-0.5 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px]">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium ${prio.color}`}>
                                <span className={`w-1 h-1 rounded-full ${prio.dot}`} />
                                {prio.label}
                              </span>

                              <select
                                value={item.status}
                                onChange={(e) => handleMoveStatus(item.id, e.target.value as WorkspaceItem['status'])}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border-none cursor-pointer text-zinc-600 dark:text-zinc-300 focus:outline-none"
                              >
                                {COLUMNS.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === 'list' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-2xs divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No items match your active search or filters
              </div>
            ) : (
              filteredItems.map((item) => {
                const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      <button
                        onClick={() => handleMoveStatus(item.id, item.status === 'Done' ? 'Backlog' : 'Done')}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition shrink-0 ${
                          item.status === 'Done'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {item.status === 'Done' && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <span
                        className={`text-xs font-medium truncate ${
                          item.status === 'Done' ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium ${prio.color}`}>
                        <span className={`w-1 h-1 rounded-full ${prio.dot}`} />
                        {prio.label}
                      </span>

                      <select
                        value={item.status}
                        onChange={(e) => handleMoveStatus(item.id, e.target.value as WorkspaceItem['status'])}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border-none cursor-pointer text-zinc-700 dark:text-zinc-300 focus:outline-none"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-zinc-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer p-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeView === 'table' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/50 text-[11px] font-semibold text-zinc-400">
                    <th className="py-3 px-4 font-medium">Task</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Priority</th>
                    <th className="py-3 px-4 text-end font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-400">
                        No tasks registered
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                      return (
                        <tr key={item.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {item.title}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={item.status}
                              onChange={(e) => handleMoveStatus(item.id, e.target.value as WorkspaceItem['status'])}
                              className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border-none cursor-pointer text-zinc-700 dark:text-zinc-300 focus:outline-none"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={item.priority}
                              onChange={(e) => handleMovePriority(item.id, e.target.value as WorkspaceItem['priority'])}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded border cursor-pointer focus:outline-none ${prio.color}`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-end">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-zinc-400 hover:text-rose-500 transition cursor-pointer p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}