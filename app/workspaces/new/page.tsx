'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  FolderKanban,
  Columns3,
  ListTodo,
  TableProperties,
  Lock,
  Users,
  Globe2,
  Check,
  Compass,
  Code2,
  BookOpen,
  Briefcase,
  Target,
  Zap,
  Cpu,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export type WorkspaceEntityType = 'workspace' | 'project';
export type WorkspaceLayout = 'board' | 'list' | 'table';
export type WorkspaceVisibility = 'private' | 'shared' | 'public';

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  entityType: WorkspaceEntityType;
  iconName: string;
  colorGradient: string;
  colorName: string;
  layout: WorkspaceLayout;
  visibility: WorkspaceVisibility;
  templateId: string;
  createdAt: string;
}

const ICON_OPTIONS = [
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'kanban', label: 'Kanban', icon: FolderKanban },
  { id: 'target', label: 'Target', icon: Target },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'book', label: 'Knowledge', icon: BookOpen },
  { id: 'briefcase', label: 'Business', icon: Briefcase },
  { id: 'zap', label: 'Sprint', icon: Zap },
  { id: 'compass', label: 'Roadmap', icon: Compass },
  { id: 'cpu', label: 'Systems', icon: Cpu },
  { id: 'bookmark', label: 'Vault', icon: Bookmark },
];

const COLOR_THEMES = [
  { name: 'Slate', gradient: 'from-zinc-700 to-zinc-900', border: 'border-zinc-500', ring: 'ring-zinc-500' },
  { name: 'Indigo', gradient: 'from-indigo-500 to-blue-600', border: 'border-indigo-500', ring: 'ring-indigo-500' },
  { name: 'Violet', gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500', ring: 'ring-violet-500' },
  { name: 'Emerald', gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-500', ring: 'ring-emerald-500' },
  { name: 'Amber', gradient: 'from-amber-500 to-orange-600', border: 'border-amber-500', ring: 'ring-amber-500' },
  { name: 'Rose', gradient: 'from-rose-500 to-pink-600', border: 'border-rose-500', ring: 'ring-rose-500' },
  { name: 'Cyan', gradient: 'from-cyan-500 to-sky-600', border: 'border-cyan-500', ring: 'ring-cyan-500' },
];

export default function NewWorkspacePage() {
  const router = useRouter();
  const { t, dir } = useLanguage();

  const [entityType, setEntityType] = useState<WorkspaceEntityType>('workspace');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLOR_THEMES[1]);
  const [templateId, setTemplateId] = useState('sprint');
  const [layout, setLayout] = useState<WorkspaceLayout>('board');
  const [visibility, setVisibility] = useState<WorkspaceVisibility>('private');

  const TEMPLATES = [
    {
      id: 'sprint',
      title: t.templateSprint,
      desc: t.templateSprintDesc,
      icon: FolderKanban,
      defaultLayout: 'board' as WorkspaceLayout,
    },
    {
      id: 'roadmap',
      title: t.templateRoadmap,
      desc: t.templateRoadmapDesc,
      icon: Compass,
      defaultLayout: 'board' as WorkspaceLayout,
    },
    {
      id: 'lifeos',
      title: t.templateLifeOs,
      desc: t.templateLifeOsDesc,
      icon: BookOpen,
      defaultLayout: 'list' as WorkspaceLayout,
    },
    {
      id: 'client',
      title: t.templateClient,
      desc: t.templateClientDesc,
      icon: Briefcase,
      defaultLayout: 'table' as WorkspaceLayout,
    },
    {
      id: 'blank',
      title: t.templateBlank,
      desc: t.templateBlankDesc,
      icon: Layers,
      defaultLayout: 'board' as WorkspaceLayout,
    },
  ];

  const handleTemplateSelect = (tmplId: string, defaultLyt: WorkspaceLayout) => {
    setTemplateId(tmplId);
    setLayout(defaultLyt);
  };

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const workspaceId = `space_${Date.now()}`;
    const newSpace: WorkspaceProject = {
      id: workspaceId,
      name: name.trim(),
      description: description.trim(),
      entityType,
      iconName: selectedIcon,
      colorGradient: selectedColor.gradient,
      colorName: selectedColor.name,
      layout,
      visibility,
      templateId,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('tf_workspaces') || '[]');
    localStorage.setItem('tf_workspaces', JSON.stringify([...existing, newSpace]));

    // Initialize default tasks for this workspace based on template
    let starterItems: any[] = [];
    if (templateId === 'sprint') {
      starterItems = [
        { id: `item_${Date.now()}_1`, title: 'Define user stories and specs', status: 'Backlog', priority: 'High' },
        { id: `item_${Date.now()}_2`, title: 'Build interactive UI prototype', status: 'In Progress', priority: 'High' },
        { id: `item_${Date.now()}_3`, title: 'Design review & edge testing', status: 'In Review', priority: 'Medium' },
        { id: `item_${Date.now()}_4`, title: 'Production release deployment', status: 'Done', priority: 'Low' },
      ];
    } else if (templateId === 'roadmap') {
      starterItems = [
        { id: `item_${Date.now()}_1`, title: 'Market analysis & user feedback', status: 'In Progress', priority: 'High' },
        { id: `item_${Date.now()}_2`, title: 'API Architecture V2 migration', status: 'Backlog', priority: 'Critical' },
        { id: `item_${Date.now()}_3`, title: 'Mobile responsiveness signoff', status: 'Done', priority: 'Medium' },
      ];
    } else {
      starterItems = [
        { id: `item_${Date.now()}_1`, title: 'Initial setup & setup scope', status: 'In Progress', priority: 'Medium' },
        { id: `item_${Date.now()}_2`, title: 'Execute primary milestone', status: 'Backlog', priority: 'High' },
      ];
    }
    localStorage.setItem(`tf_workspace_items_${workspaceId}`, JSON.stringify(starterItems));

    router.push(`/workspace/${workspaceId}`);
  };

  const SelectedIconComponent = ICON_OPTIONS.find((i) => i.id === selectedIcon)?.icon || Sparkles;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-8 popIn" dir={dir}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-2 px-3 -ml-3 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{t.appName}</span>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{t.workspacesTitle}</span>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">New</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.workspaceSetupTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.workspaceSetupSubtitle}
          </p>
        </div>

        {/* Setup Form & Live Notion-Style Preview */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Configuration Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
            {/* Entity Type Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.entityTypeLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('workspace')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${entityType === 'workspace'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>{t.typeWorkspace}</span>
                  </div>
                  <span className={`text-[10px] leading-relaxed ${entityType === 'workspace' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                    {t.typeWorkspaceDesc}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('project')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${entityType === 'project'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <FolderKanban className="w-4 h-4" />
                    <span>{t.typeProject}</span>
                  </div>
                  <span className={`text-[10px] leading-relaxed ${entityType === 'project' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                    {t.typeProjectDesc}
                  </span>
                </button>
              </div>
            </div>

            {/* Name and Slug */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {t.workspaceNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.workspaceNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                />
                {name.trim() && (
                  <p className="text-[11px] text-zinc-400 font-mono mt-1.5">
                    workspace/{generateSlug(name) || 'new'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {t.workspaceDescLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.workspaceDescPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition resize-none"
                />
              </div>
            </div>

            {/* Identity: Icon & Color Selector */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.iconAndColorLabel}
              </label>

              {/* Icon Glyphs */}
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = selectedIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      title={item.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              {/* Color Gradient Badges */}
              <div className="flex items-center gap-2 pt-1">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = selectedColor.name === theme.name;
                  return (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedColor(theme)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.gradient} transition-all cursor-pointer flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Starter Templates */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.starterTemplatesLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEMPLATES.map((tmpl) => {
                  const TmplIcon = tmpl.icon;
                  const isSelected = templateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateSelect(tmpl.id, tmpl.defaultLayout)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-black dark:border-white shadow-xs'
                        : 'bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                        <TmplIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {tmpl.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">
                          {tmpl.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View & Privacy Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {/* Primary View */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t.defaultViewLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLayout('board')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${layout === 'board'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                    <span>{t.viewKanban}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${layout === 'list'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <ListTodo className="w-3.5 h-3.5" />
                    <span>{t.viewList}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('table')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${layout === 'table'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <TableProperties className="w-3.5 h-3.5" />
                    <span>{t.viewTable}</span>
                  </button>
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t.visibilityLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${visibility === 'private'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t.visPrivate}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('shared')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${visibility === 'shared'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t.visShared}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${visibility === 'public'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                      }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{t.visPublic}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Submit Button directly under main inputs */}
            <div className="pt-2 lg:hidden">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.launchWorkspaceBtn}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Notion-Style Card Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.previewLabel}
              </span>

              {/* Notion Card Mock */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md">
                {/* Header Gradient Banner */}
                <div className={`h-20 bg-gradient-to-r ${selectedColor.gradient} relative p-3 flex items-end`}>
                  <div className="absolute -bottom-5 start-4 w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                    <SelectedIconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-8 p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {entityType === 'workspace' ? t.typeWorkspace : t.typeProject}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-1.5 truncate">
                      {name.trim() || 'Untitled Workspace'}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {description.trim() || t.workspaceDescPlaceholder}
                    </p>
                  </div>

                  {/* Notion metadata items */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-[11px] text-zinc-500">
                    <div className="flex items-center justify-between">
                      <span>Framework:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {TEMPLATES.find((t) => t.id === templateId)?.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Default View:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">
                        {layout}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Access:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">
                        {visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action Button (Desktop & Tablet) */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.launchWorkspaceBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
