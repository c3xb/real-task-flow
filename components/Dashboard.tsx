'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Plus,
  CheckCircle2,
  Clock,
  CheckSquare,
  List,
  Search,
  Check,
  AlertCircle,
  Pencil,
  Trash2,
  Settings,
} from 'lucide-react';
import { Taskadder, TaskData } from './Taskadder';
import { SettingsDrawer } from './SettingsDrawer';
import { useLanguage } from '@/lib/LanguageContext';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'In Progress' | 'Pending' | 'Completed';
}

export const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  // Settings Drawer State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task as any);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: TaskData) => {
    if (taskData.id) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? { ...t, title: taskData.title, dueDate: taskData.dueDate, priority: taskData.priority }
            : t
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: 'Pending',
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const nextStatus =
            task.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Localized status labels
  const statusLabel = (status: Task['status']): string => {
    switch (status) {
      case 'In Progress':
        return t.inProgress;
      case 'Pending':
        return t.pending;
      case 'Completed':
        return t.completed;
    }
  };

  // Localized priority labels
  const priorityLabel = (priority: Task['priority']): string => {
    switch (priority) {
      case 'Low':
        return t.lowPriority;
      case 'Medium':
        return t.mediumPriority;
      case 'High':
        return t.highPriority;
    }
  };

  // Localized filter tab labels
  const filterLabel = (tab: 'All' | 'Pending' | 'Completed'): string => {
    switch (tab) {
      case 'All':
        return t.all;
      case 'Pending':
        return t.pending;
      case 'Completed':
        return t.completed;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'All'
        ? true
        : filter === 'Pending'
          ? task.status !== 'Completed'
          : task.status === 'Completed';

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <div className="mb-0  bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg shadow-xs transition-transform duration-200 hover:scale-105">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-black dark:text-white">
              {t.appName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={t.toggleTheme}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {mounted && darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-800 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
              id="settings-button"
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Settings className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {t.dashboard}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              {t.welcomeMessage}
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createNewTask}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.totalTasks, value: totalTasks, icon: List },
            { label: t.inProgress, value: inProgressTasks, icon: Clock },
            { label: t.completed, value: completedTasks, icon: CheckCircle2 },
            { label: t.pending, value: pendingTasks, icon: AlertCircle },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-black dark:text-white mt-2">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task List Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-lg text-black dark:text-white">
              {t.recentTasks}
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder={t.searchTasks}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 ps-9 pe-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg">
                {(['All', 'Pending', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer active:scale-95 ${filter === tab
                        ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                  >
                    {filterLabel(tab)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-200 animate-[fadeIn_0.25s_ease-out] group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${task.status === 'Completed'
                          ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black scale-100'
                          : 'border-zinc-300 dark:border-zinc-700 bg-transparent hover:border-black dark:hover:border-white'
                        }`}
                    >
                      {task.status === 'Completed' && (
                        <Check className="w-3.5 h-3.5 stroke-[3] animate-[popIn_0.2s_ease-out]" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`font-medium transition-all duration-200 ${task.status === 'Completed'
                            ? 'text-zinc-400 dark:text-zinc-500 line-through'
                            : 'text-black dark:text-white'
                          }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {t.due} {task.dueDate} • {priorityLabel(task.priority)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${task.status === 'In Progress'
                          ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                          : task.status === 'Pending'
                            ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                            : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent'
                        }`}
                    >
                      {statusLabel(task.status)}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        title={t.editTask}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 active:scale-95 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        title={t.deleteTask}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150 active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-sm animate-[fadeIn_0.3s_ease-out]">
                {t.noTasksAvailable}
              </div>
            )}
          </div>
        </div>
      </main>

      <Taskadder
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        initialData={editingTask}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;