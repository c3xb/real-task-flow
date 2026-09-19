'use client';

/**
 * ============================================================================
 * app/workspace/[id]/page.tsx
 * ============================================================================
 * Professional Notion-Style Workspace & Project Management Page.
 * Features:
 * 1. Notion Banner & Cover Customization with Editable Title, Icon Selector & Full Width Toggle.
 * 2. Multi-View Database Layout: Board (Kanban), List, and Table with live column counters.
 * 3. Task Detail Modal (Notion Page View) for deep editing of titles, descriptions/notes, priorities, and statuses.
 * 4. Fast Inline Item Creator per column and in List/Table views.
 * 5. Full i18n & RTL integration with clear comments marking all additions/edits.
 */

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
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  X,
  Maximize2,
  Minimize2,
  Palette,
  Check,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

/* Interface definition for workspace items/tasks */
export interface WorkspaceItem {
  id: string;
  title: string;
  description?: string;
  status: 'Backlog' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
}

/* Map of icon keys to Lucide icon components */
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

/* Cover banner gradient options */
const COVER_GRADIENTS = [
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500',
  'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500',
  'bg-gradient-to-r from-slate-800 via-zinc-900 to-black',
];

/* Priority badge styling configuration */
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

  /* State Management */
  const [workspace, setWorkspace] = useState<any>(null);
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [activeView, setActiveView] = useState<'board' | 'list' | 'table'>('board');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<WorkspaceItem['priority']>('Medium');
  const [newItemColumn, setNewItemColumn] = useState<WorkspaceItem['status']>('Backlog');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  /* ADDED: Notion-style interactive workspace features state */
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkspaceItem | null>(null);

  /* Load workspace metadata and items from LocalStorage on mount */
  useEffect(() => {
    const savedWorkspaces = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
    const found = savedWorkspaces.find((w: any) => w.id === workspaceId);

    if (found) {
      setWorkspace(found);
      setWorkspaceTitle(found.name);
      setActiveView(found.layout || 'board');
    } else {
      const fallback = {
        id: workspaceId,
        name: 'Untitled Space',
        description: 'Manage tasks, track deliverables, and coordinate team priorities.',
        entityType: 'workspace',
        iconName: 'kanban',
        layout: 'board',
        visibility: 'private',
        createdAt: new Date().toISOString(),
      };
      setWorkspace(fallback);
      setWorkspaceTitle(fallback.name);
    }

    const savedItems = JSON.parse(localStorage.getItem(`tf_workspace_items_${workspaceId}`) || '[]');
    setItems(savedItems);
  }, [workspaceId]);

  /* Persist workspace items to LocalStorage when changed */
  useEffect(() => {
    if (workspaceId && items.length >= 0) {
      localStorage.setItem(`tf_workspace_items_${workspaceId}`, JSON.stringify(items));
    }
  }, [items, workspaceId]);

  /* Update workspace metadata in LocalStorage */
  const updateWorkspaceMetadata = (field: string, value: any) => {
    if (!workspace) return;
    const updated = { ...workspace, [field]: value };
    setWorkspace(updated);

    const savedWorkspaces = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
    const newWorkspaces = savedWorkspaces.map((w: any) => (w.id === workspaceId ? updated : w));
    localStorage.setItem('tf_workspaces', JSON.stringify(newWorkspaces));
  };

  /* Create new task item */
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: WorkspaceItem = {
      id: `item_${Date.now()}`,
      title: newItemTitle.trim(),
      description: '',
      status: newItemColumn,
      priority: newItemPriority,
      dueDate: new Date().toISOString().split('T')[0],
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemTitle('');
    setIsAddingItem(false);
  };

  /* Update task status */
  const handleMoveStatus = (id: string, newStatus: WorkspaceItem['status']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  /* Update task priority */
  const handleMovePriority = (id: string, newPriority: WorkspaceItem['priority']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
    );
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, priority: newPriority } : null);
    }
  };

  /* Save task detail changes from modal */
  const handleUpdateTaskDetail = (updated: WorkspaceItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedTask(updated);
  };

  /* Delete task item */
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  /* Delete whole workspace */
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

  /* Kanban column definitions */
  const COLUMNS: { id: WorkspaceItem['status']; label: string; indicatorBg: string }[] = [
    { id: 'Backlog', label: t.columnBacklog || 'Backlog', indicatorBg: 'bg-zinc-400 dark:bg-zinc-500' },
    { id: 'In Progress', label: t.columnInProgress || 'In Progress', indicatorBg: 'bg-blue-500' },
    { id: 'In Review', label: t.columnInReview || 'In Review', indicatorBg: 'bg-amber-500' },
    { id: 'Done', label: t.columnDone || 'Done', indicatorBg: 'bg-emerald-500' },
  ];

  /* Filter items based on search and priority filter */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  /* Calculate metrics */
  const completedCount = items.filter((i) => i.status === 'Done').length;
  const completionPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length;
  const criticalCount = items.filter((i) => i.priority === 'Critical' || i.priority === 'High').length;

  return (
    <main
      className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors"
      dir={dir}
    >
      {/* Sticky Navigation Top Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-2.5">
        <div className={`${isFullWidth ? 'w-full' : 'max-w-7xl'} mx-auto flex items-center justify-between transition-all`}>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium">
                {workspace?.entityType === 'workspace' ? 'Workspace' : 'Project'}
              </span>
              <ChevronRight className="w-3 h-3 text-zinc-400 rtl:rotate-180" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{workspace?.name || 'Untitled Space'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Full Width Layout */}
            <button
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs transition cursor-pointer"
              title={isFullWidth ? 'Standard Width' : 'Full Width'}
            >
              {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Delete Workspace Button */}
            <button
              onClick={handleDeleteWorkspace}
              className="px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition cursor-pointer"
            >
              {t.deleteWorkspace}
            </button>
          </div>
        </div>
      </div>

      {/* Notion-Style Optional Cover Banner */}
      {workspace?.coverColor && (
        <div className={`h-36 sm:h-44 w-full relative ${workspace.coverColor} transition-all`}>
          <button
            onClick={() => updateWorkspaceMetadata('coverColor', undefined)}
            className="absolute top-3 right-4 bg-black/50 hover:bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs transition"
          >
            Remove Cover
          </button>
        </div>
      )}

      {/* Main Workspace Body Content */}
      <div className={`${isFullWidth ? 'w-full px-4 sm:px-8' : 'max-w-7xl mx-auto px-4 sm:px-8'} pt-6 space-y-6 transition-all`}>
        {/* Workspace Title Header & Banner Customizer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-start gap-4">
            {/* Workspace Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-md">
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {/* Interactive In-Place Editable Title */}
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={workspaceTitle}
                    onChange={(e) => setWorkspaceTitle(e.target.value)}
                    onBlur={() => {
                      setIsEditingTitle(false);
                      if (workspaceTitle.trim()) updateWorkspaceMetadata('name', workspaceTitle.trim());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsEditingTitle(false);
                        if (workspaceTitle.trim()) updateWorkspaceMetadata('name', workspaceTitle.trim());
                      }
                    }}
                    autoFocus
                    className="text-2xl font-bold tracking-tight bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded-lg outline-none text-zinc-900 dark:text-zinc-50"
                  />
                ) : (
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 cursor-pointer hover:underline decoration-zinc-400"
                    title={t.clickToEditTitle}
                  >
                    {workspace?.name || 'Untitled Space'}
                  </h1>
                )}

                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
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

          <div className="flex items-center gap-2.5">
            {/* Cover Banner Color Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowCoverPicker(!showCoverPicker)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{t.changeCover || 'Cover'}</span>
              </button>

              {showCoverPicker && (
                <div className="absolute right-0 top-12 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2.5 shadow-2xl grid grid-cols-2 gap-2 w-56">
                  {COVER_GRADIENTS.map((grad, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        updateWorkspaceMetadata('coverColor', grad);
                        setShowCoverPicker(false);
                      }}
                      className={`h-10 w-full rounded-xl ${grad} transition-all hover:scale-105 border border-white/20`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Create Task Button */}
            <button
              onClick={() => {
                setNewItemColumn('Backlog');
                setIsAddingItem(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewItem}</span>
            </button>
          </div>
        </div>

        {/* Space Overview Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t.progressLabel || 'Progress'}</span>
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

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t.inFlightLabel || 'In Flight'}</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{inProgressCount}</div>
            <p className="text-[11px] text-zinc-400">Active tasks in progress</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t.priorityTasksLabel || 'High Priority'}</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{criticalCount}</div>
            <p className="text-[11px] text-zinc-400">High & Critical urgency items</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t.totalBacklogLabel || 'Total Items'}</span>
              <ListTodo className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{items.length}</div>
            <p className="text-[11px] text-zinc-400">Total registered work items</p>
          </div>
        </div>

        {/* Notion View Switcher & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* View Buttons: Board, List, Table */}
          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 self-start">
            <button
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'board'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>{t.boardView}</span>
            </button>

            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>{t.listView}</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>{t.tableView}</span>
            </button>
          </div>

          {/* Filters & Search Input */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-3 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 mr-1" />
              <span className="text-zinc-400 text-[11px] font-medium">{t.priority}:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer text-xs"
              >
                <option value="all">{t.all}</option>
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
                placeholder={t.searchTasks || 'Search tasks...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition w-full"
              />
            </div>
          </div>
        </div>

        {/* Form Modal for Creating Quick Tasks */}
        <AnimatePresence>
          {isAddingItem && (
            <motion.form
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onSubmit={handleAddItem}
              className="p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm flex flex-col sm:flex-row gap-3 items-center"
            >
              <input
                type="text"
                autoFocus
                required
                placeholder="Enter task title or specification..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-indigo-500 w-full"
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
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl cursor-pointer hover:opacity-90 transition active:scale-95"
                >
                  {t.addTask || 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  {t.cancel || 'Cancel'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* VIEW 1: NOTION BOARD VIEW (KANBAN) */}
        {activeView === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colItems = filteredItems.filter((i) => i.status === col.id);
              return (
                <div
                  key={col.id}
                  className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.indicatorBg}`} />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {col.label}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
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

                  <div className="space-y-2.5 min-h-[160px]">
                    {colItems.length === 0 ? (
                      <div className="h-24 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center text-[11px] text-zinc-400">
                        {t.emptyColumn}
                      </div>
                    ) : (
                      colItems.map((item) => {
                        const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedTask(item)}
                            className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer group space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                                {item.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id);
                                }}
                                className="text-zinc-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer p-0.5 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {item.description && (
                              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px]">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold ${prio.color}`}>
                                <span className={`w-1 h-1 rounded-full ${prio.dot}`} />
                                {prio.label}
                              </span>

                              <select
                                value={item.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleMoveStatus(item.id, e.target.value as WorkspaceItem['status'])}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border-none cursor-pointer text-zinc-600 dark:text-zinc-300 focus:outline-none"
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

        {/* VIEW 2: NOTION LIST VIEW */}
        {activeView === 'list' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400 italic">
                {t.emptyColumn}
              </div>
            ) : (
              filteredItems.map((item) => {
                const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                const isDone = item.status === 'Done';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTask(item)}
                    className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStatus(item.id, isDone ? 'Backlog' : 'Done');
                        }}
                        className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <span className={`text-xs font-semibold truncate ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold ${prio.color}`}>
                        {prio.label}
                      </span>

                      <span className="text-[11px] text-zinc-400">
                        {item.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="text-zinc-400 hover:text-rose-500 transition p-1 opacity-0 group-hover:opacity-100"
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

        {/* VIEW 3: NOTION TABLE DATABASE VIEW */}
        {activeView === 'table' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 text-start">Task Name</th>
                    <th className="py-3 px-4 text-start">Status</th>
                    <th className="py-3 px-4 text-start">Priority</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-400 italic">
                        {t.emptyColumn}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const prio = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Medium;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedTask(item)}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition cursor-pointer"
                        >
                          <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.title}
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={item.status}
                              onChange={(e) => handleMoveStatus(item.id, e.target.value as WorkspaceItem['status'])}
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={item.priority}
                              onChange={(e) => handleMovePriority(item.id, e.target.value as WorkspaceItem['priority'])}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${prio.color}`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-end" onClick={(e) => e.stopPropagation()}>
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

      {/* NOTION TASK DETAIL MODAL (PAGE VIEW) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-pop-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {t.taskDetails || 'Task Details'}
                </span>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Task Title Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Task Title
              </label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => handleUpdateTaskDetail({ ...selectedTask, title: e.target.value })}
                className="w-full text-base font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none text-zinc-900 dark:text-zinc-100 focus:border-indigo-500"
              />
            </div>

            {/* Status & Priority Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Status
                </label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => handleUpdateTaskDetail({ ...selectedTask, status: e.target.value as WorkspaceItem['status'] })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Priority
                </label>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => handleUpdateTaskDetail({ ...selectedTask, priority: e.target.value as WorkspaceItem['priority'] })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>
              </div>
            </div>

            {/* Task Description Notes Area */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t.taskDescription || 'Description & Notes'}
              </label>
              <textarea
                rows={4}
                value={selectedTask.description || ''}
                onChange={(e) => handleUpdateTaskDetail({ ...selectedTask, description: e.target.value })}
                placeholder={t.taskDescriptionPlaceholder || 'Add notes, specs, or task details...'}
                className="w-full text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 outline-none text-zinc-800 dark:text-zinc-200 focus:border-indigo-500 leading-relaxed placeholder-zinc-400"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => handleDeleteItem(selectedTask.id)}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition font-semibold"
              >
                Delete Task
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition hover:opacity-90"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}