'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Activity,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Smile,
  Target,
  LayoutGrid,
  CheckSquare,
  Sparkles,
  Trophy,
} from 'lucide-react';

export type HabitType = 'Good' | 'Bad' | 'Normal';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type Category = 'Health' | 'Fitness' | 'Mindset' | 'Work' | 'Personal';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  category: Category;
  timeOfDay: TimeOfDay;
  targetValue?: number; // e.g., 2000 (ml water), 20 (pages)
  unit?: string; // e.g., "ml", "pages", "mins"
  createdAt: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  rating: number; // 1-5
  mood?: string;
  energy?: 'Low' | 'Medium' | 'High';
  journal: string;
  wins: string[];
  habitsProgress: Record<string, number>; // habitId -> value achieved (1 for boolean, N for numeric)
}

const MOOD_OPTIONS = ['😊 Happy', '🎯 Focused', '⚡ Energetic', '🧘 Calm', '😴 Tired', '😤 Stressed'];
const CATEGORY_COLORS: Record<Category, string> = {
  Health: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Fitness: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Mindset: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Work: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Personal: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
};

export const DailyNotebook: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'manage'>('today');

  // Persistence States
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, DayLog>>({});

  // New Habit Form State
  const [habitForm, setHabitForm] = useState<{
    name: string;
    type: HabitType;
    category: Category;
    timeOfDay: TimeOfDay;
    targetValue: string;
    unit: string;
  }>({
    name: '',
    type: 'Good',
    category: 'Personal',
    timeOfDay: 'Anytime',
    targetValue: '',
    unit: '',
  });

  const [newWinInput, setNewWinInput] = useState('');

  // Load Saved Data
  useEffect(() => {
    const savedHabits = localStorage.getItem('tf_v2_habits');
    const savedLogs = localStorage.getItem('tf_v2_day_logs');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // Save Changes
  useEffect(() => {
    localStorage.setItem('tf_v2_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('tf_v2_day_logs', JSON.stringify(logs));
  }, [logs]);

  // Current Log Setup
  const currentLog: DayLog = useMemo(() => {
    return (
      logs[selectedDate] || {
        date: selectedDate,
        rating: 0,
        mood: '',
        energy: 'Medium',
        journal: '',
        wins: [],
        habitsProgress: {},
      }
    );
  }, [logs, selectedDate]);

  const updateCurrentLog = (updates: Partial<DayLog>) => {
    setLogs((prev) => ({
      ...prev,
      [selectedDate]: { ...currentLog, ...updates },
    }));
  };

  // Habit Toggle & Numeric Update
  const handleHabitProgress = (habit: Habit, delta?: number) => {
    const currentProgress = currentLog.habitsProgress[habit.id] || 0;
    const target = habit.targetValue || 1;

    let nextValue: number;
    if (habit.targetValue && delta !== undefined) {
      nextValue = Math.max(0, currentProgress + delta);
    } else {
      nextValue = currentProgress >= target ? 0 : target;
    }

    updateCurrentLog({
      habitsProgress: {
        ...currentLog.habitsProgress,
        [habit.id]: nextValue,
      },
    });
  };

  // Streak Calculation for a Habit
  const calculateStreak = (habitId: string) => {
    let streak = 0;
    const curr = new Date(selectedDate);

    while (true) {
      const dateStr = curr.toISOString().split('T')[0];
      const log = logs[dateStr];
      const target = habits.find((h) => h.id === habitId)?.targetValue || 1;
      const progress = log?.habitsProgress?.[habitId] || 0;

      if (progress >= target) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Add / Delete Habit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitForm.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitForm.name.trim(),
      type: habitForm.type,
      category: habitForm.category,
      timeOfDay: habitForm.timeOfDay,
      targetValue: habitForm.targetValue ? Number(habitForm.targetValue) : undefined,
      unit: habitForm.unit.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    setHabitForm({
      name: '',
      type: 'Good',
      category: 'Personal',
      timeOfDay: 'Anytime',
      targetValue: '',
      unit: '',
    });
    setActiveTab('today');
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Add Win
  const handleAddWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinInput.trim()) return;
    updateCurrentLog({ wins: [...currentLog.wins, newWinInput.trim()] });
    setNewWinInput('');
  };

  const removeWin = (index: number) => {
    updateCurrentLog({ wins: currentLog.wins.filter((_, i) => i !== index) });
  };

  // Date Navigation
  const changeDate = (days: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  // Calculated Stats
  const yearStr = selectedDate.substring(0, 4);
  const monthStr = selectedDate.substring(0, 7);

  const monthLogs = Object.values(logs).filter((l) => l.date.startsWith(monthStr));
  const yearLogs = Object.values(logs).filter((l) => l.date.startsWith(yearStr));

  const totalHabitChecksToday = Object.values(currentLog.habitsProgress).filter(
    (val) => val > 0
  ).length;

  const todayCompletionRate = habits.length
    ? Math.round((totalHabitChecksToday / habits.length) * 100)
    : 0;

  const totalMonthChecks = monthLogs.reduce(
    (acc, l) => acc + Object.values(l.habitsProgress || {}).filter((v) => v > 0).length,
    0
  );

  const totalYearChecks = yearLogs.reduce(
    (acc, l) => acc + Object.values(l.habitsProgress || {}).filter((v) => v > 0).length,
    0
  );

  // 7-Day Week Dates Generation for Weekly Matrix
  const weekDates = useMemo(() => {
    const curr = new Date(selectedDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(curr.setDate(diff));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [selectedDate]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-4 sm:p-6 space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Daily OS & Habit System</h2>
            <p className="text-xs text-zinc-400">Track habits, progress, and daily recaps</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 cursor-pointer"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-blue-500" /> Today's Completion
          </span>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold">{todayCompletionRate}%</p>
            <span className="text-[10px] text-zinc-400">
              {totalHabitChecksToday}/{habits.length}
            </span>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Active Habits
          </span>
          <p className="text-lg font-bold">{habits.length}</p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Monthly Checks
          </span>
          <p className="text-lg font-bold">{totalMonthChecks}</p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-purple-500" /> Yearly Progress
          </span>
          <p className="text-lg font-bold">{totalYearChecks}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === 'today'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" /> Daily Focus
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === 'weekly'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Weekly Grid
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === 'manage'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> Manage Habits
        </button>
      </div>

      {/* TAB 1: DAILY FOCUS */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Mood, Energy, & Day Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" /> Day Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateCurrentLog({ rating: star })}
                    className="p-1 cursor-pointer transition transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= currentLog.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-400 flex items-center gap-1">
                <Smile className="w-3 h-3 text-emerald-500" /> Mood
              </label>
              <select
                value={currentLog.mood || ''}
                onChange={(e) => updateCurrentLog({ mood: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
              >
                <option value="">Select Mood...</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Energy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-500" /> Energy Level
              </label>
              <div className="flex gap-1">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateCurrentLog({ energy: level })}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium border transition cursor-pointer ${
                      currentLog.energy === level
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grouped Habit Checklist by Time of Day */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Habits Checklist
            </h3>

            {habits.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <p className="text-xs text-zinc-400">No habits added yet.</p>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="text-xs font-medium underline text-black dark:text-white"
                >
                  Create your first habit
                </button>
              </div>
            ) : (
              (['Morning', 'Afternoon', 'Evening', 'Anytime'] as TimeOfDay[]).map((time) => {
                const groupHabits = habits.filter((h) => h.timeOfDay === time);
                if (groupHabits.length === 0) return null;

                return (
                  <div key={time} className="space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                      {time === 'Morning' && '🌅 Morning'}
                      {time === 'Afternoon' && '☀️ Afternoon'}
                      {time === 'Evening' && '🌙 Evening'}
                      {time === 'Anytime' && '⏱️ Anytime'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groupHabits.map((habit) => {
                        const progress = currentLog.habitsProgress[habit.id] || 0;
                        const target = habit.targetValue || 1;
                        const isDone = progress >= target;
                        const streak = calculateStreak(habit.id);

                        return (
                          <div
                            key={habit.id}
                            className={`p-3 rounded-xl border transition flex flex-col justify-between gap-2 ${
                              isDone
                                ? 'bg-zinc-100 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700'
                                : 'bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div
                                className="flex items-center gap-2 cursor-pointer overflow-hidden"
                                onClick={() => handleHabitProgress(habit)}
                              >
                                {habit.type === 'Good' && (
                                  <CheckCircle2
                                    className={`w-4 h-4 shrink-0 ${
                                      isDone
                                        ? 'text-emerald-500 fill-emerald-500/20'
                                        : 'text-zinc-400'
                                    }`}
                                  />
                                )}
                                {habit.type === 'Bad' && (
                                  <XCircle
                                    className={`w-4 h-4 shrink-0 ${
                                      isDone ? 'text-rose-500 fill-rose-500/20' : 'text-zinc-400'
                                    }`}
                                  />
                                )}
                                {habit.type === 'Normal' && (
                                  <Activity
                                    className={`w-4 h-4 shrink-0 ${
                                      isDone ? 'text-blue-500' : 'text-zinc-400'
                                    }`}
                                  />
                                )}
                                <span
                                  className={`text-xs font-medium truncate ${
                                    isDone ? 'line-through text-zinc-400' : ''
                                  }`}
                                >
                                  {habit.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium border ${
                                    CATEGORY_COLORS[habit.category]
                                  }`}
                                >
                                  {habit.category}
                                </span>
                                {streak > 0 && (
                                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                    <Flame className="w-3 h-3 fill-amber-500" /> {streak}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Numeric Progress Controls (If Applicable) */}
                            {habit.targetValue && (
                              <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs">
                                <span className="text-[10px] text-zinc-400">
                                  {progress} / {habit.targetValue} {habit.unit}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleHabitProgress(habit, -1)}
                                    className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-md font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => handleHabitProgress(habit, 1)}
                                    className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-bold hover:opacity-80 cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Daily Wins Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Daily Wins & Highlights
            </h3>

            <form onSubmit={handleAddWin} className="flex gap-2">
              <input
                type="text"
                placeholder="What went well today?"
                value={newWinInput}
                onChange={(e) => setNewWinInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                Add
              </button>
            </form>

            {currentLog.wins.length > 0 && (
              <div className="space-y-1.5">
                {currentLog.wins.map((win, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-amber-500">🏆</span> {win}
                    </span>
                    <button
                      onClick={() => removeWin(idx)}
                      className="text-zinc-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Journal Note */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Daily Journal & Notes
            </h3>
            <textarea
              rows={3}
              value={currentLog.journal}
              onChange={(e) => updateCurrentLog({ journal: e.target.value })}
              placeholder="Reflect on your day, learnings, or thoughts..."
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
            />
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY MATRIX */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            7-Day Completion Matrix
          </h3>

          {habits.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-6">No habits configured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2 px-3 font-semibold text-zinc-400">Habit</th>
                    {weekDates.map((date) => {
                      const d = new Date(date);
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const isSelected = date === selectedDate;

                      return (
                        <th
                          key={date}
                          className={`py-2 px-2 text-center font-medium ${
                            isSelected ? 'text-black dark:text-white font-bold' : 'text-zinc-400'
                          }`}
                        >
                          <div>{dayName}</div>
                          <div className="text-[10px]">{dayNum}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {habits.map((habit) => (
                    <tr key={habit.id}>
                      <td className="py-3 px-3 font-medium truncate max-w-[140px]">
                        {habit.name}
                      </td>
                      {weekDates.map((date) => {
                        const log = logs[date];
                        const progress = log?.habitsProgress?.[habit.id] || 0;
                        const target = habit.targetValue || 1;
                        const isDone = progress >= target;

                        return (
                          <td key={date} className="py-3 px-2 text-center">
                            <span
                              className={`inline-block w-5 h-5 rounded-md ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : progress > 0
                                  ? 'bg-amber-400 text-white'
                                  : 'bg-zinc-100 dark:bg-zinc-800'
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANAGE HABITS */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddHabit}
            className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Create New Habit
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drink Water, Read Book..."
                  value={habitForm.name}
                  onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Type
                </label>
                <select
                  value={habitForm.type}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, type: e.target.value as HabitType })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="Good">Good (+)</option>
                  <option value="Normal">Normal</option>
                  <option value="Bad">Bad (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={habitForm.category}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, category: e.target.value as Category })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Time of Day
                </label>
                <select
                  value={habitForm.timeOfDay}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, timeOfDay: e.target.value as TimeOfDay })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Numeric Target (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2000 or 20"
                  value={habitForm.targetValue}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, targetValue: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Unit (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ml, pages, mins"
                  value={habitForm.unit}
                  onChange={(e) => setHabitForm({ ...habitForm, unit: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-xs py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Add Habit
            </button>
          </form>

          {/* Active Habits List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Active Habits ({habits.length})
            </h3>
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                >
                  <div>
                    <p className="font-semibold">{habit.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      {habit.timeOfDay} • {habit.category} {habit.targetValue ? `• ${habit.targetValue} ${habit.unit}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyNotebook;