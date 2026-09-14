'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export interface TaskData {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  category?: 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';
  estimatedTime?: number;
}

interface TaskcalendarProps {
  tasks?: TaskData[];
  selectedDate?: string;
  onSelectTask?: (task: TaskData) => void;
  onSelectDate?: (dateStr: string) => void;
}

export const Taskcalendar: React.FC<TaskcalendarProps> = ({
  tasks = [],
  selectedDate,
  onSelectTask,
  onSelectDate,
}) => {
  const { t, dir } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayLogs, setDayLogs] = useState<Record<string, any>>({});
  const [activeHabitsCount, setActiveHabitsCount] = useState<number>(0);

  // Sync with localStorage logs for habit dots
  useEffect(() => {
    const updateLogs = () => {
      try {
        const savedLogs = localStorage.getItem('tf_v2_day_logs');
        const savedHabits = localStorage.getItem('tf_v2_habits');
        if (savedLogs) setDayLogs(JSON.parse(savedLogs));
        if (savedHabits) setActiveHabitsCount(JSON.parse(savedHabits).length);
      } catch (err) {
        console.error(err);
      }
    };
    updateLogs();
    window.addEventListener('storage', updateLogs);
    return () => window.removeEventListener('storage', updateLogs);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = t.months || [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = t.days || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    if (onSelectDate) {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      onSelectDate(`${y}-${m}-${d}`);
    }
  };

  const formatDateString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const calendarGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.push(day);
  }

  const totalSlots = Math.ceil(calendarGrid.length / 7) * 7;
  while (calendarGrid.length < totalSlots) {
    calendarGrid.push(null);
  }

  const todayStr = getLocalDateString(new Date());

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden flex flex-col p-5" dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-[11px] text-zinc-400">
              {t.calendarTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition cursor-pointer"
          >
            {t.today}
          </button>
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label={t.prevMonth}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label={t.nextMonth}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Column Headers */}
      <div className="grid grid-cols-7 text-center bg-zinc-50/70 dark:bg-zinc-950/40 mt-3 rounded-t-xl py-2 border-b border-zinc-100 dark:border-zinc-800">
        {dayNames.map((day) => (
          <div key={day} className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 bg-zinc-100 dark:bg-zinc-800 gap-[1px] rounded-b-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800">
        {calendarGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="bg-zinc-50/40 dark:bg-zinc-950/30 min-h-[78px]" />;
          }

          const dateStr = formatDateString(day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          // Habit completion for this day
          const dayLog = dayLogs[dateStr];
          const completedHabitsCount = dayLog?.habitsProgress
            ? Object.values(dayLog.habitsProgress).filter((v: any) => v > 0).length
            : 0;
          const hasHabitsDone = completedHabitsCount > 0;
          const isAllHabitsDone = activeHabitsCount > 0 && completedHabitsCount >= activeHabitsCount;

          // Tasks for this day
          const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate?.(dateStr)}
              className={`min-h-[78px] p-2 bg-white dark:bg-zinc-900 transition flex flex-col justify-between cursor-pointer group hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
                isSelected
                  ? 'ring-2 ring-inset ring-black dark:ring-white z-10'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition ${
                    isToday
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                      : isSelected
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {day}
                </span>

                {/* Habit indicator dot */}
                {hasHabitsDone && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isAllHabitsDone ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-amber-400'
                    }`}
                    title={
                      isAllHabitsDone
                        ? 'All daily habits completed'
                        : `${completedHabitsCount} habits completed`
                    }
                  />
                )}
              </div>

              {/* Task Badges preview */}
              <div className="space-y-1 mt-1">
                {dayTasks.slice(0, 2).map((t, tIdx) => (
                  <div
                    key={tIdx}
                    onClick={(e) => {
                      if (onSelectTask) {
                        e.stopPropagation();
                        onSelectTask(t);
                      }
                    }}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium truncate ${
                      t.status === 'Completed'
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 line-through'
                        : t.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <span className="text-[9px] text-zinc-400 font-medium ps-1">
                    +{dayTasks.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Taskcalendar;