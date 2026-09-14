'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Target,
  LayoutGrid,
  CheckSquare,
  Sparkles,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Sunrise,
  Moon,
  Clock,
  ShieldCheck,
  Brain,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export type HabitType = 'Good' | 'Bad' | 'Normal';
export type TimeOfDay = 'Morning' | 'DeepWork' | 'Afternoon' | 'Evening' | 'Anytime';
export type Category = 'Health' | 'Fitness' | 'DeepWork' | 'Mindset' | 'Personal' | 'Systems';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  category: Category;
  timeOfDay: TimeOfDay;
  targetValue?: number;
  unit?: string;
  createdAt: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  rating: number; // 1-5
  mood?: string;
  energy?: 'Low' | 'Medium' | 'High';
  journal: string;
  wins: string[];
  focusMinutes: number;
  habitsProgress: Record<string, number>;
}

interface DailyNotebookProps {
  selectedDateProp?: string;
  onDateChange?: (date: string) => void;
}

export const DailyNotebook: React.FC<DailyNotebookProps> = ({
  selectedDateProp,
  onDateChange,
}) => {
  const { t, dir } = useLanguage();

  const [internalDate, setInternalDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const selectedDate = selectedDateProp || internalDate;

  const handleDateUpdate = (newDate: string) => {
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };

  const [activeTab, setActiveTab] = useState<'today' | 'timer' | 'weekly' | 'manage'>('today');

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
    category: 'DeepWork',
    timeOfDay: 'Morning',
    targetValue: '',
    unit: '',
  });

  const [newWinInput, setNewWinInput] = useState('');

  // ----------------------------------------------------
  // FOCUS TIMER SYSTEM
  // ----------------------------------------------------
  const [timerDurationMinutes, setTimerDurationMinutes] = useState<number>(25);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [linkedHabitId, setLinkedHabitId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerIntervalRef = useRef<any>(null);

  // Play gentle Web Audio chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1 (528Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Note 2 (660Hz - harmonic major third)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(660, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.5);
    } catch (e) {
      console.error('Audio chime failed:', e);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            playChime();

            // Record completed focus minutes
            const completedMins = timerDurationMinutes;
            updateCurrentLog({
              focusMinutes: (currentLog.focusMinutes || 0) + completedMins,
            });

            // If linked to a habit, update that habit's progress
            if (linkedHabitId) {
              const targetHabit = habits.find((h) => h.id === linkedHabitId);
              if (targetHabit) {
                const currentVal = currentLog.habitsProgress[linkedHabitId] || 0;
                const nextVal = targetHabit.unit?.toLowerCase().includes('min')
                  ? currentVal + completedMins
                  : currentVal + 1;
                updateCurrentLog({
                  habitsProgress: {
                    ...currentLog.habitsProgress,
                    [linkedHabitId]: nextVal,
                  },
                });
              }
            }

            alert(`${t.timerFinishedTitle} - ${completedMins} ${t.loggedMinutes}`);
            return timerDurationMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerDurationMinutes, linkedHabitId]);

  const handleSetTimerPreset = (minutes: number) => {
    setIsTimerRunning(false);
    setTimerDurationMinutes(minutes);
    setTimerSecondsRemaining(minutes * 60);
  };

  const handleToggleTimer = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const dummyCtx = new AudioCtx();
        if (dummyCtx.state === 'suspended') {
          dummyCtx.resume();
        }
      }
    } catch (e) {}
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsRemaining(timerDurationMinutes * 60);
  };

  // Quick launch timer from a habit
  const launchTimerForHabit = (habitId: string, defaultMinutes?: number) => {
    setLinkedHabitId(habitId);
    const mins = defaultMinutes || 25;
    handleSetTimerPreset(mins);
    setActiveTab('timer');
  };

  // ----------------------------------------------------
  // PERSISTENCE & DATA
  // ----------------------------------------------------
  useEffect(() => {
    const savedHabits = localStorage.getItem('tf_v2_habits');
    const savedLogs = localStorage.getItem('tf_v2_day_logs');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Clean default habits
      const defaults: Habit[] = [
        { id: 'h1', name: 'Deep Work Sprint', type: 'Good', category: 'DeepWork', timeOfDay: 'DeepWork', targetValue: 50, unit: 'mins', createdAt: new Date().toISOString() },
        { id: 'h2', name: 'Physical Fitness & Movement', type: 'Good', category: 'Fitness', timeOfDay: 'Morning', targetValue: 30, unit: 'mins', createdAt: new Date().toISOString() },
        { id: 'h3', name: 'Technical Reading', type: 'Good', category: 'Mindset', timeOfDay: 'Evening', targetValue: 20, unit: 'pages', createdAt: new Date().toISOString() },
      ];
      setHabits(defaults);
      localStorage.setItem('tf_v2_habits', JSON.stringify(defaults));
    }
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('tf_v2_habits', JSON.stringify(habits));
    }
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
        focusMinutes: 0,
        habitsProgress: {},
      }
    );
  }, [logs, selectedDate]);

  const updateCurrentLog = (updates: Partial<DayLog>) => {
    setLogs((prev) => {
      const updated = {
        ...prev,
        [selectedDate]: { ...currentLog, ...updates },
      };
      localStorage.setItem('tf_v2_day_logs', JSON.stringify(updated));
      return updated;
    });
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

  // Streak Calculation
  const calculateStreak = (habitId: string) => {
    let streak = 0;
    const curr = new Date(selectedDate);

    while (true) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

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
      id: `h_${Date.now()}`,
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
      category: 'DeepWork',
      timeOfDay: 'Morning',
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
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    handleDateUpdate(`${y}-${m}-${d}`);
  };

  // Calculated Stats
  const monthStr = selectedDate.substring(0, 7);
  const monthLogs = Object.values(logs).filter((l) => l.date.startsWith(monthStr));

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

  // 7-Day Matrix Dates
  const weekDates = useMemo(() => {
    const curr = new Date(selectedDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${dateNum}`);
    }
    return dates;
  }, [selectedDate]);

  // Format timer digital display
  const formatTimerDigits = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Category Badges
  const CATEGORY_STYLES: Record<Category, { label: string; badge: string }> = {
    Health: { label: t.catHealth, badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    Fitness: { label: t.catFitness, badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
    DeepWork: { label: t.catDeepWork, badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    Mindset: { label: t.catMindset, badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    Personal: { label: t.catPersonal, badge: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20' },
    Systems: { label: t.catSystems, badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  };

  // State Options (Replacing mediocre emojis)
  const STATE_OPTIONS = [
    { id: 'focus', label: t.stateDeepFocus, icon: Brain },
    { id: 'peak', label: t.statePeakEnergy, icon: Zap },
    { id: 'flow', label: t.stateOptimalFlow, icon: Target },
    { id: 'calm', label: t.stateCalmExecution, icon: ShieldCheck },
    { id: 'fatigue', label: t.stateFatigue, icon: Clock },
    { id: 'overload', label: t.stateOverloaded, icon: Activity },
  ];

  const TIME_BLOCKS: { id: TimeOfDay; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'Morning', label: t.timeMorning, icon: Sunrise },
    { id: 'DeepWork', label: t.timeDeepWork, icon: Brain },
    { id: 'Afternoon', label: t.timeAfternoon, icon: Sun },
    { id: 'Evening', label: t.timeEvening, icon: Moon },
    { id: 'Anytime', label: t.timeAnytime, icon: Clock },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-5 sm:p-6 space-y-6" dir={dir}>
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {t.dailyOsTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.dailyOsSubtitle}
            </p>
          </div>
        </div>

        {/* Date Stepper */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={() => changeDate(-1)}
            aria-label="Previous Day"
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateUpdate(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 cursor-pointer"
          />
          <button
            onClick={() => changeDate(1)}
            aria-label="Next Day"
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-blue-500" /> {t.todayCompletion}
          </span>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{todayCompletionRate}%</p>
            <span className="text-[10px] text-zinc-400 font-medium">
              {totalHabitChecksToday}/{habits.length}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> {t.activeHabitsCount}
          </span>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{habits.length}</p>
        </div>

        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-indigo-500" /> {t.focusMinutesToday}
          </span>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{currentLog.focusMinutes || 0}</p>
            <span className="text-[10px] text-zinc-400">mins</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> {t.monthlyStreakScore}
          </span>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{totalMonthChecks}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
            activeTab === 'today'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{t.dailyFocus}</span>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
            activeTab === 'timer'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>{t.focusTimer}</span>
          {isTimerRunning && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
            activeTab === 'weekly'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t.weeklyGrid}</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
            activeTab === 'manage'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.manageHabits}</span>
        </button>
      </div>

      {/* TAB 1: DAILY EXECUTION */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Mental State & Energy Check-in */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl">
            {/* Day Rating */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" /> {t.dayRating}
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

            {/* Mindset / State */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-500" /> {t.stateAndMindset}
              </label>
              <select
                value={currentLog.mood || ''}
                onChange={(e) => updateCurrentLog({ mood: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-zinc-800 dark:text-zinc-200 font-medium"
              >
                <option value="">Select State...</option>
                {STATE_OPTIONS.map((st) => (
                  <option key={st.id} value={st.label}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Energy Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> {t.energyLevel}
              </label>
              <div className="flex gap-1.5">
                {(['Low', 'Medium', 'High'] as const).map((level) => {
                  const labelMap = {
                    Low: t.energyLow,
                    Medium: t.energyMedium,
                    High: t.energyHigh,
                  };
                  const isSelected = currentLog.energy === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateCurrentLog({ energy: level })}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-xs'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                      }`}
                    >
                      {labelMap[level]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grouped Routine Checklist by Time Block */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.habitsChecklist}
            </h3>

            {habits.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <p className="text-xs text-zinc-400">{t.noHabitsConfigured}</p>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="text-xs font-semibold underline text-black dark:text-white cursor-pointer"
                >
                  {t.createFirstHabit}
                </button>
              </div>
            ) : (
              TIME_BLOCKS.map((block) => {
                const groupHabits = habits.filter((h) => h.timeOfDay === block.id);
                if (groupHabits.length === 0) return null;
                const BlockIcon = block.icon;

                return (
                  <div key={block.id} className="space-y-2">
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <BlockIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{block.label}</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {groupHabits.map((habit) => {
                        const progress = currentLog.habitsProgress[habit.id] || 0;
                        const target = habit.targetValue || 1;
                        const isDone = progress >= target;
                        const streak = calculateStreak(habit.id);
                        const catStyle = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.Personal;

                        return (
                          <div
                            key={habit.id}
                            className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-2.5 ${
                              isDone
                                ? 'bg-zinc-100/90 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700'
                                : 'bg-zinc-50/60 dark:bg-zinc-950/50 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              {/* Habit Check Toggle */}
                              <div
                                className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
                                onClick={() => handleHabitProgress(habit)}
                              >
                                {habit.type === 'Good' && (
                                  <CheckCircle2
                                    className={`w-4.5 h-4.5 shrink-0 transition ${
                                      isDone
                                        ? 'text-emerald-600 fill-emerald-600/20'
                                        : 'text-zinc-400 hover:text-black dark:hover:text-white'
                                    }`}
                                  />
                                )}
                                {habit.type === 'Bad' && (
                                  <XCircle
                                    className={`w-4.5 h-4.5 shrink-0 transition ${
                                      isDone ? 'text-rose-500 fill-rose-500/20' : 'text-zinc-400'
                                    }`}
                                  />
                                )}
                                {habit.type === 'Normal' && (
                                  <Activity
                                    className={`w-4.5 h-4.5 shrink-0 transition ${
                                      isDone ? 'text-blue-500' : 'text-zinc-400'
                                    }`}
                                  />
                                )}
                                <span
                                  className={`text-xs font-semibold truncate ${
                                    isDone ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                                  }`}
                                >
                                  {habit.name}
                                </span>
                              </div>

                              {/* Habit metadata pills & quick timer launch */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => launchTimerForHabit(habit.id, habit.targetValue && habit.unit?.includes('min') ? habit.targetValue : 25)}
                                  className="w-7 h-7 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-center transition cursor-pointer active:scale-90"
                                  title="Start Focus Timer for this routine"
                                >
                                  <Timer className="w-3.5 h-3.5" />
                                </button>

                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${catStyle.badge}`}>
                                  {catStyle.label}
                                </span>

                                {streak > 0 && (
                                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                    <Flame className="w-3 h-3 fill-amber-500" />
                                    <span>{streak}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Numeric Progress Controls */}
                            {habit.targetValue && (
                              <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs">
                                <span className="text-[10px] font-medium text-zinc-400">
                                  {progress} / {habit.targetValue} {habit.unit}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleHabitProgress(habit, -1)}
                                    className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 font-bold flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-90 cursor-pointer text-xs"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleHabitProgress(habit, 1)}
                                    className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center hover:opacity-80 active:scale-90 cursor-pointer text-xs"
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

          {/* Daily Wins & Key Results */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.dailyWinsTitle}</span>
            </h3>

            <form onSubmit={handleAddWin} className="flex gap-2">
              <input
                type="text"
                placeholder={t.addWinPlaceholder}
                value={newWinInput}
                onChange={(e) => setNewWinInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition cursor-pointer shadow-xs"
              >
                {t.addWinButton}
              </button>
            </form>

            {currentLog.wins.length > 0 && (
              <div className="space-y-1.5">
                {currentLog.wins.map((win, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{win}</span>
                    </span>
                    <button
                      onClick={() => removeWin(idx)}
                      className="text-zinc-400 hover:text-rose-500 transition cursor-pointer p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Executive Journal & Reflection */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.dailyJournalTitle}
            </h3>
            <textarea
              rows={3}
              value={currentLog.journal}
              onChange={(e) => updateCurrentLog({ journal: e.target.value })}
              placeholder={t.dailyJournalPlaceholder}
              className="w-full text-xs p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
            />
          </div>
        </div>
      )}

      {/* TAB 2: SPECIFIC FOCUS TIMER SYSTEM */}
      {activeTab === 'timer' && (
        <div className="space-y-6 max-w-xl mx-auto py-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {t.timerTitle}
            </h3>
            <p className="text-xs text-zinc-400">
              {t.timerSubtitle}
            </p>
          </div>

          {/* Presets Row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: t.pomodoro25, mins: 25 },
              { label: t.deepWork50, mins: 50 },
              { label: t.quickSprint15, mins: 15 },
              { label: t.shortBreak5, mins: 5 },
            ].map((preset) => {
              const isSelected = timerDurationMinutes === preset.mins;
              return (
                <button
                  key={preset.mins}
                  type="button"
                  onClick={() => handleSetTimerPreset(preset.mins)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Digital Timer Readout Container */}
          <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-5 shadow-xs">
            <div className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-zinc-900 dark:text-zinc-50">
              {formatTimerDigits(timerSecondsRemaining)}
            </div>

            {/* Linked Habit Indicator */}
            <div className="w-full max-w-xs space-y-1 text-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t.linkHabit}
              </label>
              <select
                value={linkedHabitId}
                onChange={(e) => setLinkedHabitId(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer text-zinc-700 dark:text-zinc-300"
              >
                <option value="">{t.selectHabitToTrack}</option>
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} {h.unit ? `(${h.unit})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md ${
                  isTimerRunning
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{t.pauseTimer}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t.startTimer}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                aria-label={t.resetTimer}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                title={soundEnabled ? 'Mute audio chime' : 'Enable audio chime'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY MATRIX */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {t.weeklyGrid}
          </h3>

          {habits.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-6">{t.noHabitsConfigured}</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                    <th className="py-2.5 px-4 font-semibold text-zinc-400">Routine</th>
                    {weekDates.map((date) => {
                      const d = new Date(date);
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const isSelected = date === selectedDate;

                      return (
                        <th
                          key={date}
                          onClick={() => handleDateUpdate(date)}
                          className={`py-2 px-2 text-center cursor-pointer transition ${
                            isSelected ? 'bg-zinc-200/70 dark:bg-zinc-800/80 font-bold' : 'text-zinc-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          <div>{dayName}</div>
                          <div className="text-[10px]">{dayNum}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {habits.map((habit) => (
                    <tr key={habit.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-4 font-semibold truncate max-w-[160px] text-zinc-900 dark:text-zinc-100">
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
                              className={`inline-block w-5 h-5 rounded-md transition ${
                                isDone
                                  ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                                  : progress > 0
                                  ? 'bg-amber-400'
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

      {/* TAB 4: MANAGE HABITS */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddHabit}
            className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              {t.newHabitHeading}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.habitNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.habitNamePlaceholder}
                  value={habitForm.name}
                  onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.habitTypeLabel}
                </label>
                <select
                  value={habitForm.type}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, type: e.target.value as HabitType })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="Good">{t.typeGood}</option>
                  <option value="Normal">{t.typeNeutral}</option>
                  <option value="Bad">{t.typeBreak}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.categoryLabel}
                </label>
                <select
                  value={habitForm.category}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, category: e.target.value as Category })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="DeepWork">{t.catDeepWork}</option>
                  <option value="Health">{t.catHealth}</option>
                  <option value="Fitness">{t.catFitness}</option>
                  <option value="Mindset">{t.catMindset}</option>
                  <option value="Personal">{t.catPersonal}</option>
                  <option value="Systems">{t.catSystems}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.timeBlockLabel}
                </label>
                <select
                  value={habitForm.timeOfDay}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, timeOfDay: e.target.value as TimeOfDay })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <option value="Morning">{t.timeMorning}</option>
                  <option value="DeepWork">{t.timeDeepWork}</option>
                  <option value="Afternoon">{t.timeAfternoon}</option>
                  <option value="Evening">{t.timeEvening}</option>
                  <option value="Anytime">{t.timeAnytime}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.targetValueLabel}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50 or 20"
                  value={habitForm.targetValue}
                  onChange={(e) =>
                    setHabitForm({ ...habitForm, targetValue: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {t.targetUnitLabel}
                </label>
                <input
                  type="text"
                  placeholder="e.g. mins, pages, ml"
                  value={habitForm.unit}
                  onChange={(e) => setHabitForm({ ...habitForm, unit: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-xs py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition cursor-pointer shadow-xs"
            >
              {t.addHabitSubmit}
            </button>
          </form>

          {/* Active Habits List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.activeHabitsCount} ({habits.length})
            </h3>
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{habit.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {habit.timeOfDay} • {habit.category} {habit.targetValue ? `• ${habit.targetValue} ${habit.unit}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    aria-label={t.deleteHabitConfirm}
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