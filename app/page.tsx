'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import TaskCalendar from '@/components/Taskcalender';
import DailyNotebook from '@/components/dailynotebook';
import RealNotebook from '@/components/realnotebook';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { dir } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadTasks = () => {
      try {
        const saved = localStorage.getItem('tf_dashboard_tasks');
        if (saved) setTasks(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    };
    loadTasks();
    window.addEventListener('storage', loadTasks);
    return () => window.removeEventListener('storage', loadTasks);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-8" dir={dir}>
      <div className="max-w-6xl mx-auto space-y-6">
        <Dashboard />

        {/* Unified Calendar & Daily OS synced by selectedDate */}
        <div className="max-w-5.3xl mx-auto space-y-6">
          <TaskCalendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={(newDate) => setSelectedDate(newDate)}
          />
          <DailyNotebook
            selectedDateProp={selectedDate}
            onDateChange={(newDate) => setSelectedDate(newDate)}
          />
          <RealNotebook

          />
        </div>
      </div>
    </main>
  );
}