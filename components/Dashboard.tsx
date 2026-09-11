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
  AlertCircle
} from 'lucide-react';
import { Taskadder } from './Taskadder';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleAddTask = (newTaskData: {
    title: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskData.title,
      dueDate: newTaskData.dueDate,
      priority: newTaskData.priority,
      status: 'Pending',
    };
    setTasks((prev) => [newTask, ...prev]);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg shadow-xs transition-transform duration-200 hover:scale-105">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-black dark:text-white">
              Task Flow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {mounted && darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-800 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>
            
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Welcome back! Here is an overview of your tasks.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: totalTasks, icon: List },
            { label: 'In Progress', value: inProgressTasks, icon: Clock },
            { label: 'Completed', value: completedTasks, icon: CheckCircle2 },
            { label: 'Pending', value: pendingTasks, icon: AlertCircle },
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
              Recent Tasks
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg">
                {(['All', 'Pending', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer active:scale-95 ${
                      filter === tab
                        ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tab}
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
                  className="p-4 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-200 animate-[fadeIn_0.25s_ease-out]"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${
                        task.status === 'Completed'
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
                        className={`font-medium transition-all duration-200 ${
                          task.status === 'Completed'
                            ? 'text-zinc-400 dark:text-zinc-500 line-through'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Due {task.dueDate} • {task.priority} Priority
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${
                      task.status === 'In Progress'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                        : task.status === 'Pending'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                        : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-sm animate-[fadeIn_0.3s_ease-out]">
                No tasks available. Click "Create New Task" to add your first task.
              </div>
            )}
          </div>
        </div>
      </main>

      <Taskadder
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default Dashboard;