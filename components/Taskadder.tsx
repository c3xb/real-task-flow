'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag, AlertCircle, FileText, CheckCircle2, Folder, Clock } from 'lucide-react';
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
    estimatedTime?: number; // In minutes
}

interface TaskadderProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveTask: (task: TaskData) => void;
    initialData?: TaskData | null;
}

export const Taskadder: React.FC<TaskadderProps> = ({
    isOpen,
    onClose,
    onSaveTask,
    initialData,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
    const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
    const [category, setCategory] = useState<'Work' | 'Personal' | 'Study' | 'Health' | 'Other'>('Personal');
    const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
    const { t } = useLanguage();

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setDueDate(initialData.dueDate || '');
            setPriority(initialData.priority || 'Medium');
            setUrgency(initialData.urgency || 'Medium');
            setStatus(initialData.status || 'Pending');
            setCategory(initialData.category || 'Personal');
            setEstimatedTime(initialData.estimatedTime ?? '');
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
            setUrgency('Medium');
            setStatus('Pending');
            setCategory('Personal');
            setEstimatedTime('');
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSaveTask({
            id: initialData?.id,
            title,
            description,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            priority,
            urgency,
            status,
            category,
            estimatedTime: estimatedTime !== '' ? Number(estimatedTime) : undefined,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-[fadeIn_0.2s_ease-out]"
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 transform transition-all animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-black dark:text-white" />
                        <h2 className="text-lg font-semibold text-black dark:text-white">
                            {initialData ? t.editTaskTitle : t.createNewTaskTitle}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95 duration-150"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            {t.taskTitle} *
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            placeholder={t.taskTitlePlaceholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" /> Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add extra details about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 resize-none"
                        />
                    </div>

                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Native Calendar Picker */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                {t.dueDate}
                            </label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Category Option */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Category
                            </label>
                            <div className="relative">
                                <Folder className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as 'Work' | 'Personal' | 'Study' | 'Health' | 'Other')}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 cursor-pointer"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="Study">Study</option>
                                    <option value="Health">Health</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Priority Selection */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                {t.priorityLabel}
                            </label>
                            <div className="relative">
                                <Flag className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 cursor-pointer"
                                >
                                    <option value="Low">{t.lowPriority}</option>
                                    <option value="Medium">{t.mediumPriority}</option>
                                    <option value="High">{t.highPriority}</option>
                                </select>
                            </div>
                        </div>

                        {/* Urgency Selection */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Urgency
                            </label>
                            <div className="relative">
                                <AlertCircle className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <select
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 cursor-pointer"
                                >
                                    <option value="Low">Low Urgency</option>
                                    <option value="Medium">Medium Urgency</option>
                                    <option value="High">High Urgency</option>
                                    <option value="Critical">Critical (Immediate)</option>
                                </select>
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Status
                            </label>
                            <div className="relative">
                                <CheckCircle2 className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Completed')}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150 cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        {/* Estimated Time Option */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Est. Time (mins)
                            </label>
                            <div className="relative">
                                <Clock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 30"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-150"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
                        >
                            {initialData ? t.saveChanges : t.addTask}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Taskadder;