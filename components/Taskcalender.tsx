'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

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
    onSelectTask?: (task: TaskData) => void;
    onSelectDate?: (dateStr: string) => void;
}

export const Taskcalendar: React.FC<TaskcalendarProps> = ({
    tasks = [],
    onSelectTask,
    onSelectDate,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
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

    const getPriorityBadgeStyle = (priority: TaskData['priority']) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50';
            case 'Medium':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
            case 'Low':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
            default:
                return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
        }
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
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden flex flex-col p-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                        {monthNames[month]} {year}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleToday}
                        className="px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
                    >
                        Today
                    </button>
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Day Column Headers */}
            <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 text-center bg-zinc-50/50 dark:bg-zinc-950/30 mt-3 rounded-t-lg">
                {dayNames.map((day) => (
                    <div key={day} className="py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-zinc-200 dark:bg-zinc-800 gap-[1px] rounded-b-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {calendarGrid.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="bg-zinc-50/30 dark:bg-zinc-950/20 min-h-[70px]" />;
                    }

                    const dateStr = formatDateString(day);

                    // Robust Date Parsing Fix to ensure immediate UI refresh
                    const dayTasks = tasks.filter((t) => {
                        if (!t?.dueDate) return false;
                        const taskFormattedDate = t.dueDate.split('T')[0];
                        return taskFormattedDate === dateStr;
                    });

                    const isToday = dateStr === todayStr;

                    return (
                        <div
                            key={dateStr}
                            onClick={() => onSelectDate && onSelectDate(dateStr)}
                            className={`bg-white dark:bg-zinc-900 min-h-[70px] p-1.5 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 flex flex-col gap-1 cursor-pointer ${
                                isToday ? 'ring-1 ring-inset ring-black dark:ring-white z-10' : ''
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                                        isToday
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : 'text-zinc-700 dark:text-zinc-300'
                                    }`}
                                >
                                    {day}
                                </span>
                                {dayTasks.length > 0 && (
                                    <span className="text-[10px] text-zinc-400 font-medium">
                                        {dayTasks.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[50px] pt-0.5">
                                {dayTasks.map((task, taskIdx) => (
                                    <div
                                        key={task.id || `${task.title}-${taskIdx}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onSelectTask) onSelectTask(task);
                                        }}
                                        className={`p-1 text-[10px] rounded border leading-tight transition-all hover:scale-[1.01] cursor-pointer ${getPriorityBadgeStyle(
                                            task.priority
                                        )}`}
                                    >
                                        <div className="font-medium truncate">{task.title}</div>
                                        {task.estimatedTime && (
                                            <div className="flex items-center gap-0.5 text-[8px] opacity-75 mt-0.5">
                                                <Clock className="w-2 h-2 shrink-0" />
                                                <span>{task.estimatedTime}m</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Taskcalendar;