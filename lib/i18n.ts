export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'tr';

export interface Translations {
  // App
  appName: string;

  // Header / Nav
  toggleTheme: string;
  settings: string;
  backToDashboard: string;

  // Dashboard
  dashboard: string;
  welcomeMessage: string;
  createNewTask: string;

  // Metrics
  totalTasks: string;
  inProgress: string;
  completed: string;
  pending: string;

  // Task List
  recentTasks: string;
  searchTasks: string;
  all: string;
  noTasksAvailable: string;
  due: string;
  priority: string;
  editTask: string;
  deleteTask: string;

  // Priority labels
  lowPriority: string;
  mediumPriority: string;
  highPriority: string;

  // Task Adder Modal
  createNewTaskTitle: string;
  editTaskTitle: string;
  taskTitle: string;
  taskTitlePlaceholder: string;
  dueDate: string;
  dueDatePlaceholder: string;
  priorityLabel: string;
  cancel: string;
  addTask: string;
  saveChanges: string;

  // Settings Drawer
  settingsTitle: string;
  languageSection: string;
  english: string;
  arabic: string;
  french: string;
  spanish: string;
  turkish: string;
  close: string;
  workspacesTitle: string;
  workspacesSubtitle: string;
  newWorkspaceOrProject: string;
  activeWorkspaces: string;
  noWorkspacesYet: string;
  openWorkspace: string;

  // Calendar
  calendarTitle: string;
  today: string;
  prevMonth: string;
  nextMonth: string;
  months: string[];
  days: string[];
  tasksScheduled: string;
  habitsCompleted: string;

  // Daily OS & Habits
  dailyOsTitle: string;
  dailyOsSubtitle: string;
  dailyFocus: string;
  weeklyGrid: string;
  manageHabits: string;
  focusTimer: string;

  // Daily Metrics
  todayCompletion: string;
  activeHabitsCount: string;
  focusMinutesToday: string;
  monthlyStreakScore: string;

  // Daily Focus Section
  dayRating: string;
  stateAndMindset: string;
  energyLevel: string;
  energyLow: string;
  energyMedium: string;
  energyHigh: string;
  habitsChecklist: string;
  noHabitsConfigured: string;
  createFirstHabit: string;
  streakDays: string;

  // States / Mindset Pills (Replacing cheesy emojis)
  stateDeepFocus: string;
  statePeakEnergy: string;
  stateOptimalFlow: string;
  stateCalmExecution: string;
  stateFatigue: string;
  stateOverloaded: string;

  // Time Blocks
  timeMorning: string;
  timeDeepWork: string;
  timeAfternoon: string;
  timeEvening: string;
  timeAnytime: string;

  // Habit Categories
  catHealth: string;
  catFitness: string;
  catDeepWork: string;
  catMindset: string;
  catPersonal: string;
  catSystems: string;

  // Habit Types
  typeGood: string;
  typeNeutral: string;
  typeBreak: string;

  // Focus Timer
  timerTitle: string;
  timerSubtitle: string;
  pomodoro25: string;
  deepWork50: string;
  quickSprint15: string;
  shortBreak5: string;
  customTimer: string;
  startTimer: string;
  pauseTimer: string;
  resetTimer: string;
  linkHabit: string;
  selectHabitToTrack: string;
  timerFinishedTitle: string;
  timerFinishedDesc: string;
  loggedMinutes: string;

  // Wins & Reflection
  dailyWinsTitle: string;
  addWinPlaceholder: string;
  addWinButton: string;
  dailyJournalTitle: string;
  dailyJournalPlaceholder: string;

  // Manage Habits Form
  newHabitHeading: string;
  habitNameLabel: string;
  habitNamePlaceholder: string;
  habitTypeLabel: string;
  categoryLabel: string;
  timeBlockLabel: string;
  targetValueLabel: string;
  targetUnitLabel: string;
  addHabitSubmit: string;
  deleteHabitConfirm: string;

  // Workspace Creation Page (Notion Style)
  workspaceSetupTitle: string;
  workspaceSetupSubtitle: string;
  entityTypeLabel: string;
  typeWorkspace: string;
  typeWorkspaceDesc: string;
  typeProject: string;
  typeProjectDesc: string;
  workspaceNameLabel: string;
  workspaceNamePlaceholder: string;
  workspaceDescLabel: string;
  workspaceDescPlaceholder: string;
  iconAndColorLabel: string;
  starterTemplatesLabel: string;
  templateSprint: string;
  templateSprintDesc: string;
  templateStudy: string;
  templateStudyDesc: string;
  templateBusiness: string;
  templateBusinessDesc: string;
  templateRoadmap: string;
  templateRoadmapDesc: string;
  templateLifeOs: string;
  templateLifeOsDesc: string;
  templateClient: string;
  templateClientDesc: string;
  templateBlank: string;
  templateBlankDesc: string;
  defaultViewLabel: string;
  viewKanban: string;
  viewList: string;
  viewTable: string;
  visibilityLabel: string;
  visPrivate: string;
  visShared: string;
  visPublic: string;
  previewLabel: string;
  launchWorkspaceBtn: string;
  backToHome: string;

  // Workspace Details Page
  boardView: string;
  listView: string;
  tableView: string;
  addNewItem: string;
  columnBacklog: string;
  columnInProgress: string;
  columnInReview: string;
  columnDone: string;
  emptyColumn: string;
  deleteWorkspace: string;
  /* ADDED: Professional Workspace Page translation keys */
  taskDetails: string;
  taskDescription: string;
  taskDescriptionPlaceholder: string;
  changeCover: string;
  progressLabel: string;
  inFlightLabel: string;
  priorityTasksLabel: string;
  totalBacklogLabel: string;
  clickToEditTitle: string;
  /* All-in-One Workspace Keys */
  tabBoard: string;
  tabNotes: string;
  tabMilestones: string;
  tabFocusTimer: string;
  tabResources: string;
  addMilestone: string;
  milestoneTitle: string;
  milestoneTarget: string;
  milestoneProgress: string;
  addResource: string;
  resourceName: string;
  resourceUrl: string;
  focusSession: string;
  logFocusTime: string;
  allInOneOverview: string;
  projectStatus: string;
  statusPlanning: string;
  statusInProgress: string;
  statusOnTrack: string;
  statusInReview: string;
  statusCompleted: string;

  /* ==========================================================================
     ADDED: Notebook / Realnotebook Translation Keys
     ========================================================================== */
  notebookTitle: string;
  notebookSubtitle: string;
  addPage: string;
  searchNotes: string;
  favorites: string;
  privatePages: string;
  noPagesFound: string;
  removeCover: string;
  addCover: string;
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  unorderedList: string;
  orderedList: string;
  subscript: string;
  superscript: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  words: string;
  characters: string;
  edited: string;
  noPageSelected: string;
  createFirstPage: string;
  deletePageTitle: string;
  deletePageConfirm: string;
  cancelDelete: string;
  deletePage: string;
  fullWidth: string;
  pinPage: string;
  unpinPage: string;
  backToPages: string;
  copyContent: string;
  copiedContent: string;
  changeIcon: string;
  untitledPage: string;
  loadingWorkspace: string;
  /* ADDED: Font Size & Print/Word Export translations */
  fontSize: string;
  exportWord: string;
  printPdf: string;

  /* ==========================================================================
     ADDED: App Theme Settings Translation Keys
     ========================================================================== */
  themeSection: string;
  themeMode: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  accentColor: string;
  accentZinc: string;
  accentIndigo: string;
  accentEmerald: string;
  accentOcean: string;
  accentAmber: string;
  accentRose: string;

  /* ==========================================================================
     ADDED: Website Builder Studio Translation Keys
     ========================================================================== */
  websiteBuilder: string;
  previewMode: string;
  editMode: string;
  exportCode: string;
  publishSite: string;
  publishing: string;
  publishedLive: string;
  undo: string;
  redo: string;
  viewDesktop: string;
  viewTablet: string;
  viewMobile: string;
  tabPages: string;
  tabSections: string;
  tabStyles: string;
  tabLayers: string;
  tabSettings: string;
  heroSection: string;
  featuresSection: string;
  pricingSection: string;
  testimonialsSection: string;
  faqSection: string;
  statsSection: string;
  ctaSection: string;
  footerSection: string;
  navbarSection: string;
  addSection: string;
  deleteSection: string;
  duplicateSection: string;
  moveUp: string;
  moveDown: string;
  sectionProperties: string;
  pageSettings: string;
  headingText: string;
  subtitleText: string;
  buttonText: string;
  buttonUrl: string;
  backgroundStyle: string;
  colorPalette: string;
  fontFamily: string;
  borderRadius: string;
  seoTitle: string;
  seoDescription: string;
  customDomain: string;
  starterTemplates: string;
  saasTemplate: string;
  portfolioTemplate: string;
  agencyTemplate: string;
  startupTemplate: string;
  loadTemplate: string;
  copyCode: string;
  codeCopied: string;
  downloadHtml: string;
  downloadReact: string;
  liveUrl: string;
  sitePublishedTitle: string;
  sitePublishedDesc: string;
  visitSite: string;
  addPageBtn: string;
  pageNamePlaceholder: string;
  noSectionsOnPage: string;
  chooseTemplateOrAdd: string;
  monthlyBilling: string;
  annualBilling: string;
  saveChangesBtn: string;
  websiteTheme: string;
}

const translations: Record<Locale, Translations> = {
  en: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Toggle theme',
    settings: 'Settings',
    backToDashboard: 'Back to Dashboard',

    // Dashboard
    dashboard: 'Dashboard',
    welcomeMessage: 'Welcome back! Here is an overview of your tasks.',
    createNewTask: 'Create New Task',

    // Metrics
    totalTasks: 'Total Tasks',
    inProgress: 'In Progress',
    completed: 'Completed',
    pending: 'Pending',

    // Task List
    recentTasks: 'Recent Tasks',
    searchTasks: 'Search tasks...',
    all: 'All',
    noTasksAvailable: 'No tasks available. Click "Create New Task" to add your first task.',
    due: 'Due',
    priority: 'Priority',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',

    // Priority labels
    lowPriority: 'Low Priority',
    mediumPriority: 'Medium Priority',
    highPriority: 'High Priority',

    // Task Adder Modal
    createNewTaskTitle: 'Create New Task',
    editTaskTitle: 'Edit Task',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'e.g. Design landing page hero section',
    dueDate: 'Due Date',
    dueDatePlaceholder: 'e.g. Tomorrow or Sep 20',
    priorityLabel: 'Priority',
    cancel: 'Cancel',
    addTask: 'Add Task',
    saveChanges: 'Save Changes',

    // Settings Drawer
    settingsTitle: 'Settings',
    languageSection: 'Language',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    spanish: 'Español',
    turkish: 'Türkçe',
    close: 'Close',
    workspacesTitle: 'Workspaces & Projects',
    workspacesSubtitle: 'Organize work into dedicated Notion-style spaces',
    newWorkspaceOrProject: '+ New Workspace or Project',
    activeWorkspaces: 'Your Spaces',
    noWorkspacesYet: 'No custom spaces yet. Create one to organize distinct projects.',
    openWorkspace: 'Open',

    // Calendar
    calendarTitle: 'Task & Routine Schedule',
    today: 'Today',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    tasksScheduled: 'tasks',
    habitsCompleted: 'habits completed',

    // Daily OS & Habits
    dailyOsTitle: 'Daily OS & Habit System',
    dailyOsSubtitle: 'Systematic daily execution, focused sessions, and routine metrics',
    dailyFocus: 'Daily Execution',
    weeklyGrid: 'Weekly Matrix',
    manageHabits: 'Habit Systems',
    focusTimer: 'Focus Timer',

    // Daily Metrics
    todayCompletion: "Today's Rate",
    activeHabitsCount: 'Active Routines',
    focusMinutesToday: 'Deep Work Logged',
    monthlyStreakScore: 'Monthly Check-ins',

    // Daily Focus Section
    dayRating: 'Performance Rating',
    stateAndMindset: 'Mental State & Focus',
    energyLevel: 'Energy Level',
    energyLow: 'Low',
    energyMedium: 'Optimal',
    energyHigh: 'Peak',
    habitsChecklist: 'Routine Checklist',
    noHabitsConfigured: 'No routine systems defined for this day.',
    createFirstHabit: 'Configure a habit system',
    streakDays: 'day streak',

    // States / Mindset
    stateDeepFocus: 'Deep Focus',
    statePeakEnergy: 'Peak Energy',
    stateOptimalFlow: 'Flow State',
    stateCalmExecution: 'Calm Execution',
    stateFatigue: 'Recovery Mode',
    stateOverloaded: 'High Friction',

    // Time Blocks
    timeMorning: 'Morning Block',
    timeDeepWork: 'Deep Work Block',
    timeAfternoon: 'Afternoon Sprint',
    timeEvening: 'Evening Wind-down',
    timeAnytime: 'Flexible Window',

    // Habit Categories
    catHealth: 'Health & Vitality',
    catFitness: 'Fitness',
    catDeepWork: 'Deep Work',
    catMindset: 'Mindset & Clarity',
    catPersonal: 'Personal',
    catSystems: 'Systems',

    // Habit Types
    typeGood: 'Core Multiplier',
    typeNeutral: 'Standard Habit',
    typeBreak: 'Habit Avoidance',

    // Focus Timer
    timerTitle: 'Focus Session Engine',
    timerSubtitle: 'Structured intervals linked directly to tasks and habits',
    pomodoro25: '25m Focus',
    deepWork50: '50m Deep Work',
    quickSprint15: '15m Sprint',
    shortBreak5: '5m Rest',
    customTimer: 'Custom',
    startTimer: 'Start Session',
    pauseTimer: 'Pause',
    resetTimer: 'Reset',
    linkHabit: 'Attach to Habit',
    selectHabitToTrack: 'Select habit to log minutes to...',
    timerFinishedTitle: 'Session Completed',
    timerFinishedDesc: 'Focus interval recorded and added to your daily metric log.',
    loggedMinutes: 'mins focused today',

    // Wins & Reflection
    dailyWinsTitle: 'Daily Key Results & Wins',
    addWinPlaceholder: 'Record a major outcome, breakthrough, or win...',
    addWinButton: 'Log Result',
    dailyJournalTitle: 'Executive Journal & Evening Review',
    dailyJournalPlaceholder: 'Reflect on execution cadence, obstacles resolved, and strategy for tomorrow...',

    // Manage Habits Form
    newHabitHeading: 'Define New System / Habit',
    habitNameLabel: 'Habit Name',
    habitNamePlaceholder: 'e.g. Read 20 pages, Deep code sprint...',
    habitTypeLabel: 'Impact Classification',
    categoryLabel: 'Domain Category',
    timeBlockLabel: 'Scheduled Time Block',
    targetValueLabel: 'Target Quantity (Optional)',
    targetUnitLabel: 'Unit (e.g. mins, pages, ml)',
    addHabitSubmit: 'Create Routine System',
    deleteHabitConfirm: 'Delete routine',

    // Workspace Creation Page (Notion Style)
    workspaceSetupTitle: 'Create Workspace or Project',
    workspaceSetupSubtitle: 'Structure initiatives, roadmaps, and workflows in dedicated spaces.',
    entityTypeLabel: 'Space Classification',
    typeWorkspace: 'Workspace Hub',
    typeWorkspaceDesc: 'High-level organizational container for multiple projects and teams',
    typeProject: 'Focused Project',
    typeProjectDesc: 'Dedicated milestone, sprint tracker, or specific initiative',
    workspaceNameLabel: 'Title / Space Name',
    workspaceNamePlaceholder: 'e.g. Engineering Sprint Q4 or Design System',
    workspaceDescLabel: 'Mission & Purpose',
    workspaceDescPlaceholder: 'Describe the key objective or scope of this space...',
    iconAndColorLabel: 'Identity & Icon',
    starterTemplatesLabel: 'Starter Framework',
    templateSprint: 'Agile Sprint Board',
    templateSprintDesc: 'Kanban columns with backlog, active sprints, reviews, and completed items',
    templateStudy: 'Studying & Academic OS',
    templateStudyDesc: 'Course notes, exams, lecture summaries, readings, and deep study blocks',
    templateBusiness: 'Starting a Business Hub',
    templateBusinessDesc: 'Business model, customer discovery, MVP build, finances, and launch milestones',
    templateRoadmap: 'Product Roadmap',
    templateRoadmapDesc: 'Milestones, release stages, and feature prioritization pipeline',
    templateLifeOs: 'Life OS & Operations',
    templateLifeOsDesc: 'Habits, personal goals, weekly reviews, and knowledge base',
    templateClient: 'Client Portal',
    templateClientDesc: 'Deliverables tracker, milestones, feedback logs, and tasks',
    templateBlank: 'Blank Canvas',
    templateBlankDesc: 'Minimal clean slate to structure however you prefer',
    defaultViewLabel: 'Primary View',
    viewKanban: 'Kanban Board',
    viewList: 'Structured List',
    viewTable: 'Data Table',
    visibilityLabel: 'Privacy & Access',
    visPrivate: 'Private Space',
    visShared: 'Team Access',
    visPublic: 'Public Read-Only',
    previewLabel: 'Live Preview',
    launchWorkspaceBtn: 'Create & Open Space',
    backToHome: 'Return to Dashboard',

    // Workspace Details Page
    boardView: 'Board',
    listView: 'List',
    tableView: 'Table',
    addNewItem: 'Add Item',
    columnBacklog: 'Backlog',
    columnInProgress: 'In Progress',
    columnInReview: 'In Review',
    columnDone: 'Done',
    emptyColumn: 'No items in this column',
    deleteWorkspace: 'Delete Space',
    /* ADDED: Workspace detail translations */
    taskDetails: 'Task Details',
    taskDescription: 'Description & Notes',
    taskDescriptionPlaceholder: 'Add detailed specs, acceptance criteria, or notes...',
    changeCover: 'Change Cover',
    progressLabel: 'Overall Progress',
    inFlightLabel: 'In Flight',
    priorityTasksLabel: 'High Priority',
    totalBacklogLabel: 'Total Items',
    clickToEditTitle: 'Click to edit title',
    /* All-in-One Workspace Keys */
    tabBoard: 'Tasks & Board',
    tabNotes: 'Project Notes & Docs',
    tabMilestones: 'Milestones & Goals',
    tabFocusTimer: 'Focus & Study Timer',
    tabResources: 'Resources & Hub',
    addMilestone: 'New Milestone',
    milestoneTitle: 'Milestone Title',
    milestoneTarget: 'Target Deadline',
    milestoneProgress: 'Progress',
    addResource: 'Add Resource Link',
    resourceName: 'Resource Title',
    resourceUrl: 'URL / Link',
    focusSession: 'Focus Session',
    logFocusTime: 'Logged Focus Time',
    allInOneOverview: 'All-in-One Overview',
    projectStatus: 'Status',
    statusPlanning: 'Planning',
    statusInProgress: 'In Progress',
    statusOnTrack: 'On Track',
    statusInReview: 'In Review',
    statusCompleted: 'Completed',

    /* ADDED: English translations for Notebook & App Theme */
    notebookTitle: 'Notebook',
    notebookSubtitle: 'Personal Notion-style document workspace',
    addPage: 'Add new page',
    searchNotes: 'Search notes...',
    favorites: 'Favorites',
    privatePages: 'Private Pages',
    noPagesFound: 'No pages found',
    removeCover: 'Remove cover',
    addCover: '+ Add cover',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    unorderedList: 'Bullet List',
    orderedList: 'Numbered List',
    subscript: 'Subscript',
    superscript: 'Superscript',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    words: 'words',
    characters: 'characters',
    edited: 'Edited',
    noPageSelected: 'No page selected',
    createFirstPage: '+ Create new page',
    deletePageTitle: 'Delete page?',
    deletePageConfirm: 'Are you sure you want to delete this page? This action cannot be undone.',
    cancelDelete: 'Cancel',
    deletePage: 'Delete',
    fullWidth: 'Full width',
    pinPage: 'Pin to Favorites',
    unpinPage: 'Unpin page',
    backToPages: 'Back',
    copyContent: 'Copy',
    copiedContent: 'Copied',
    changeIcon: 'Change icon',
    untitledPage: 'Untitled',
    loadingWorkspace: 'Loading Notion workspace...',
    /* ADDED: Font Size & Print/Word Export translations */
    fontSize: 'Font Size',
    exportWord: 'Export Word',
    printPdf: 'Print / PDF',
    themeSection: 'App Theme',
    themeMode: 'Mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    accentColor: 'Accent Color',
    accentZinc: 'Slate Zinc',
    accentIndigo: 'Indigo Purple',
    accentEmerald: 'Emerald Green',
    accentOcean: 'Ocean Blue',
    accentAmber: 'Sunset Amber',
    accentRose: 'Rose Crimson',
    /* Website Builder Studio */
    websiteBuilder: 'Website Builder',
    previewMode: 'Preview',
    editMode: 'Edit',
    exportCode: 'Export Code',
    publishSite: 'Publish',
    publishing: 'Publishing...',
    publishedLive: 'Published Live',
    undo: 'Undo',
    redo: 'Redo',
    viewDesktop: 'Desktop',
    viewTablet: 'Tablet',
    viewMobile: 'Mobile',
    tabPages: 'Pages',
    tabSections: 'Sections',
    tabStyles: 'Styles',
    tabLayers: 'Layers',
    tabSettings: 'Settings',
    heroSection: 'Hero Banner',
    featuresSection: 'Features Grid',
    pricingSection: 'Pricing Tables',
    testimonialsSection: 'Testimonials',
    faqSection: 'FAQ Accordion',
    statsSection: 'Stats & Metrics',
    ctaSection: 'Call to Action',
    footerSection: 'Footer',
    navbarSection: 'Navigation Bar',
    addSection: 'Add Section',
    deleteSection: 'Delete Section',
    duplicateSection: 'Duplicate Section',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    sectionProperties: 'Section Properties',
    pageSettings: 'Page Settings',
    headingText: 'Heading Text',
    subtitleText: 'Subtitle / Description',
    buttonText: 'Button Text',
    buttonUrl: 'Button Link',
    backgroundStyle: 'Background Style',
    colorPalette: 'Color Palette',
    fontFamily: 'Typography Font',
    borderRadius: 'Corner Radius',
    seoTitle: 'Page SEO Title',
    seoDescription: 'Meta Description',
    customDomain: 'Custom Domain',
    starterTemplates: 'Starter Templates',
    saasTemplate: 'Modern SaaS Platform',
    portfolioTemplate: 'Creative Portfolio',
    agencyTemplate: 'Digital Studio & Agency',
    startupTemplate: 'AI Startup & Tech',
    loadTemplate: 'Apply Template',
    copyCode: 'Copy Code',
    codeCopied: 'Copied to Clipboard!',
    downloadHtml: 'Download HTML File',
    downloadReact: 'Download React TSX',
    liveUrl: 'Live Site URL',
    sitePublishedTitle: 'Your Website is Live!',
    sitePublishedDesc: 'Your changes have been deployed globally to high-speed CDN servers.',
    visitSite: 'Visit Live Site',
    addPageBtn: 'New Page',
    pageNamePlaceholder: 'Page name (e.g. About)',
    noSectionsOnPage: 'No sections on this page yet.',
    chooseTemplateOrAdd: 'Choose a starter template or add sections from the left panel.',
    monthlyBilling: 'Monthly',
    annualBilling: 'Annually (Save 20%)',
    saveChangesBtn: 'Saved Automatically',
    websiteTheme: 'Website Theme',
  },

  ar: {
    // App
    appName: 'تدفق المهام',

    // Header / Nav
    toggleTheme: 'تبديل المظهر',
    settings: 'الإعدادات',
    backToDashboard: 'العودة إلى لوحة التحكم',

    // Dashboard
    dashboard: 'لوحة التحكم',
    welcomeMessage: 'مرحبًا بعودتك! إليك نظرة عامة على مهامك ومساراتك.',
    createNewTask: 'إنشاء مهمة جديدة',

    // Metrics
    totalTasks: 'إجمالي المهام',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتملة',
    pending: 'معلّقة',

    // Task List
    recentTasks: 'المهام الأخيرة',
    searchTasks: 'البحث في المهام...',
    all: 'الكل',
    noTasksAvailable: 'لا توجد مهام. انقر على "إنشاء مهمة جديدة" لإضافة أول مهمة.',
    due: 'الموعد',
    priority: 'الأولوية',
    editTask: 'تعديل المهمة',
    deleteTask: 'حذف المهمة',

    // Priority labels
    lowPriority: 'أولوية منخفضة',
    mediumPriority: 'أولوية متوسطة',
    highPriority: 'أولوية عالية',

    // Task Adder Modal
    createNewTaskTitle: 'إنشاء مهمة جديدة',
    editTaskTitle: 'تعديل المهمة',
    taskTitle: 'عنوان المهمة',
    taskTitlePlaceholder: 'مثال: تصميم قسم الصفحة الرئيسية',
    dueDate: 'تاريخ الاستحقاق',
    dueDatePlaceholder: 'مثال: غدًا أو ٢٠ سبتمبر',
    priorityLabel: 'الأولوية',
    cancel: 'إلغاء',
    addTask: 'إضافة مهمة',
    saveChanges: 'حفظ التغييرات',

    // Settings Drawer
    settingsTitle: 'الإعدادات',
    languageSection: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    spanish: 'Español',
    turkish: 'Türkçe',
    close: 'إغلاق',
    workspacesTitle: 'مساحات العمل والمشاريع',
    workspacesSubtitle: 'نظّم أعمالك في مساحات مخصصة بأسلوب Notion',
    newWorkspaceOrProject: '+ مساحة عمل أو مشروع جديد',
    activeWorkspaces: 'مساحاتك النشطة',
    noWorkspacesYet: 'لا توجد مساحات مخصصة حتى الآن. أنشئ مساحتك الأولى.',
    openWorkspace: 'فتح',

    // Calendar
    calendarTitle: 'جدول المهام والروتين',
    today: 'اليوم',
    prevMonth: 'الشهر السابق',
    nextMonth: 'الشهر القادم',
    months: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    tasksScheduled: 'مهام',
    habitsCompleted: 'عادات مكتملة',

    // Daily OS & Habits
    dailyOsTitle: 'نظام إدارة اليوم والعادات',
    dailyOsSubtitle: 'تنفيذ يومي منهجي، جلسات تركيز عميقة، ومقاييس الأداء',
    dailyFocus: 'التركيز اليومي',
    weeklyGrid: 'المصفوفة الأسبوعية',
    manageHabits: 'إدارة العادات',
    focusTimer: 'مؤقت التركيز',

    // Daily Metrics
    todayCompletion: 'نسبة الإنجاز',
    activeHabitsCount: 'العادات النشطة',
    focusMinutesToday: 'دقائق التركيز اليوم',
    monthlyStreakScore: 'إنجازات الشهر',

    // Daily Focus Section
    dayRating: 'تقييم أداء اليوم',
    stateAndMindset: 'الحالة الذهنية والتركيز',
    energyLevel: 'مستوى الطاقة',
    energyLow: 'منخفض',
    energyMedium: 'مثالي',
    energyHigh: 'أقصى طاقة',
    habitsChecklist: 'قائمة الروتين اليومي',
    noHabitsConfigured: 'لم يتم تحديد عادات لهذا اليوم.',
    createFirstHabit: 'إضافة عادة جديدة',
    streakDays: 'أيام متتالية',

    // States / Mindset
    stateDeepFocus: 'تركيز عميق',
    statePeakEnergy: 'طاقة قصوى',
    stateOptimalFlow: 'حالة انسياب',
    stateCalmExecution: 'تنفيذ هادئ',
    stateFatigue: 'وضع الاستراحة',
    stateOverloaded: 'ضغط مرتفع',

    // Time Blocks
    timeMorning: 'فترة الصباح',
    timeDeepWork: 'فترة العمل العميق',
    timeAfternoon: 'فترة الظهيرة',
    timeEvening: 'فترة المساء',
    timeAnytime: 'وقت مرن',

    // Habit Categories
    catHealth: 'الصحة والحيوية',
    catFitness: 'اللياقة البدنية',
    catDeepWork: 'العمل العميق',
    catMindset: 'الصفاء الذهني',
    catPersonal: 'شخصي',
    catSystems: 'الأنظمة',

    // Habit Types
    typeGood: 'عادة أساسية (+)',
    typeNeutral: 'عادة عادية',
    typeBreak: 'عادة يجب تجنبها (-)',

    // Focus Timer
    timerTitle: 'محرك جلسات التركيز',
    timerSubtitle: 'فترات تركيز مرتبطة مباشرة بالمهام والعادات',
    pomodoro25: '٢٥ دقيقة تركيز',
    deepWork50: '٥٠ دقيقة عمل عميق',
    quickSprint15: '١٥ دقيقة عمل مكثف',
    shortBreak5: '٥ دقائق استراحة',
    customTimer: 'مخصص',
    startTimer: 'بدء الجلسة',
    pauseTimer: 'إيقاف مؤقت',
    resetTimer: 'إعادة ضبط',
    linkHabit: 'ربط بعادة',
    selectHabitToTrack: 'اختر عادة لتسجيل الدقائق لها...',
    timerFinishedTitle: 'اكتملت الجلسة بنجاح',
    timerFinishedDesc: 'تم حفظ دقائق التركيز في سجل إنجازاتك اليومي.',
    loggedMinutes: 'دقيقة تركيز مسجلة اليوم',

    // Wins & Reflection
    dailyWinsTitle: 'الإنجازات والنتائج الرئيسية',
    addWinPlaceholder: 'سجل إنجازًا أو انتصارًا مميزًا اليوم...',
    addWinButton: 'تسجيل الإنجاز',
    dailyJournalTitle: 'المفكرة والمراجعة المسائية',
    dailyJournalPlaceholder: 'دوّن ملاحظاتك حول إنجازاتك، المعوقات التي تجاوزتها، وخطة الغد...',

    // Manage Habits Form
    newHabitHeading: 'إضافة نظام أو عادة جديدة',
    habitNameLabel: 'اسم العادة',
    habitNamePlaceholder: 'مثال: قراءة ٢٠ صفحة، برمجة عميقة...',
    habitTypeLabel: 'تصنيف الأثر',
    categoryLabel: 'المجال',
    timeBlockLabel: 'الفترة الزمنية',
    targetValueLabel: 'الهدف الرقمي (اختياري)',
    targetUnitLabel: 'الوحدة (مثل: دقيقة، صفحة، مل)',
    addHabitSubmit: 'إنشاء العادة',
    deleteHabitConfirm: 'حذف العادة',

    // Workspace Creation Page (Notion Style)
    workspaceSetupTitle: 'إنشاء مساحة عمل أو مشروع',
    workspaceSetupSubtitle: 'نظّم مشاريعك وخططك ضمن مساحات عمل مستقلة واحترافية.',
    entityTypeLabel: 'نوع المساحة',
    typeWorkspace: 'مساحة عمل رئيسية',
    typeWorkspaceDesc: 'مظلة تنظيمية شاملة تضم مشاريع وفرق متعددة',
    typeProject: 'مشروع محدد',
    typeProjectDesc: 'مبادرة أو مرحلة عمل مخصصة ذات أهداف محددة',
    workspaceNameLabel: 'اسم المساحة أو المشروع',
    workspaceNamePlaceholder: 'مثال: خطة الربع الرابع أو تصميم المنظومة',
    workspaceDescLabel: 'الهدف والوصف',
    workspaceDescPlaceholder: 'صف الأهداف الأساسية ونطاق العمل لهذه المساحة...',
    iconAndColorLabel: 'الشعار والهوية',
    starterTemplatesLabel: 'النموذج الأولي',
    templateSprint: 'لوحة إدارة السبرنت (Kanban)',
    templateSprintDesc: 'أعمدة كانبان مع المهام المعلقة، قيد التنفيذ، المراجعة والمكتملة',
    templateStudy: 'نظام الدراسة والتحصيل الأكاديمي',
    templateStudyDesc: 'ملاحظات المحاضرات، الامتحانات، الملخصات، وفترات المذاكرة المركزة',
    templateBusiness: 'إطلاق وتأسيس مشروع تجاري',
    templateBusinessDesc: 'نموذج العمل التجاري، دراسة العملاء، بناء النسخة الأولى، والمراحل الأساسية',
    templateRoadmap: 'خارطة طريق المنتج',
    templateRoadmapDesc: 'مراحل الإطلاق، المعالم الرئيسية، وتحديد الأولويات',
    templateLifeOs: 'نظام إدارة الحياة الشخصية',
    templateLifeOsDesc: 'العادات، الأهداف الشخصية، والمراجعات الدورية',
    templateClient: 'بوابة العملاء والمشاريع',
    templateClientDesc: 'متابعة المخرجات، المواعيد، والتغذية الراجعة',
    templateBlank: 'صفحة فارغة',
    templateBlankDesc: 'مساحة بيضاء خالية لتصممها كما تحب',
    defaultViewLabel: 'العرض الافتراضي',
    viewKanban: 'لوحة كانبان',
    viewList: 'قائمة مهام',
    viewTable: 'جدول بيانات',
    visibilityLabel: 'الخصوصية وصلاحية الوصول',
    visPrivate: 'خاص بي فقط',
    visShared: 'متاح للفريق',
    visPublic: 'عام للقراءة فقط',
    previewLabel: 'معاينة مباشرة',
    launchWorkspaceBtn: 'إنشاء وفتح المساحة',
    backToHome: 'العودة للوحة التحكم',

    // Workspace Details Page
    boardView: 'اللوحة',
    listView: 'القائمة',
    tableView: 'الجدول',
    addNewItem: 'إضافة عنصر',
    columnBacklog: 'قائمة الانتظار',
    columnInProgress: 'قيد التنفيذ',
    columnInReview: 'قيد المراجعة',
    columnDone: 'مكتمل',
    emptyColumn: 'لا توجد عناصر في هذا العمود',
    deleteWorkspace: 'حذف المساحة',
    /* ADDED: Workspace detail translations */
    taskDetails: 'تفاصيل المهمة',
    taskDescription: 'الوصف والملاحظات',
    taskDescriptionPlaceholder: 'إضافة تفاصيل، معايير القبول، أو ملاحظات...',
    changeCover: 'تغيير الغلاف',
    progressLabel: 'التقدم الإجمالي',
    inFlightLabel: 'قيد التنفيذ',
    priorityTasksLabel: 'أولوية عالية',
    totalBacklogLabel: 'إجمالي العناصر',
    clickToEditTitle: 'انقر لتعديل العنوان',
    /* All-in-One Workspace Keys */
    tabBoard: 'المهام واللوحة',
    tabNotes: 'ملاحظات ووثائق المشروع',
    tabMilestones: 'المعالم والأهداف الرئيسية',
    tabFocusTimer: 'مؤقت التركيز والدراسة',
    tabResources: 'المراجع والروابط',
    addMilestone: 'معلم رئيسي جديد',
    milestoneTitle: 'عنوان المعلم أو المرحلة',
    milestoneTarget: 'تاريخ الإنجاز المستهدف',
    milestoneProgress: 'نسبة الإنجاز',
    addResource: 'إضافة رابط مرجعي',
    resourceName: 'اسم المرجع / الأداة',
    resourceUrl: 'رابط URL',
    focusSession: 'جلسة تركيز',
    logFocusTime: 'وقت التركيز المسجل',
    allInOneOverview: 'نظرة شاملة متكاملة',
    projectStatus: 'حالة المشروع',
    statusPlanning: 'قيد التخطيط',
    statusInProgress: 'قيد التنفيذ',
    statusOnTrack: 'على المسار الصحيح',
    statusInReview: 'قيد المراجعة',
    statusCompleted: 'مكتمل',

    /* ADDED: Arabic translations for Notebook & App Theme */
    notebookTitle: 'دفتر الملاحظات',
    notebookSubtitle: 'مساحة مستندات خاصة بنمط نوتشن',
    addPage: 'إضافة صفحة جديدة',
    searchNotes: 'البحث في الملاحظات...',
    favorites: 'المفضلة',
    privatePages: 'الصفحات الخاصة',
    noPagesFound: 'لم يتم العثور على صفحات',
    removeCover: 'إزالة الغلاف',
    addCover: '+ إضافة غلاف',
    bold: 'غامق',
    italic: 'مائل',
    underline: 'تحته خط',
    strikethrough: 'يتوسطه خط',
    unorderedList: 'قائمة نقطية',
    orderedList: 'قائمة رقمية',
    subscript: 'منخفض',
    superscript: 'مرتفع',
    alignLeft: 'محاذاة لليسار',
    alignCenter: 'محاذاة للوسط',
    alignRight: 'محاذاة لليمين',
    words: 'كلمات',
    characters: 'حروف',
    edited: 'تم التعديل',
    noPageSelected: 'لم يتم تحديد أي صفحة',
    createFirstPage: '+ إنشاء صفحة جديدة',
    deletePageTitle: 'حذف الصفحة؟',
    deletePageConfirm: 'هل أنت تأكد من رغبتك في حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.',
    cancelDelete: 'إلغاء',
    deletePage: 'حذف',
    fullWidth: 'العرض الكامل',
    pinPage: 'تثبيت في المفضلة',
    unpinPage: 'إلغاء التثبيت',
    backToPages: 'عودة',
    copyContent: 'نسخ',
    copiedContent: 'تم النسخ',
    changeIcon: 'تغيير الأيقونة',
    untitledPage: 'بدون عنوان',
    loadingWorkspace: 'جاري تحميل مساحة العمل...',
    /* ADDED: Font Size & Print/Word Export translations */
    fontSize: 'حجم الخط',
    exportWord: 'تصدير Word',
    printPdf: 'طباعة / PDF',
    themeSection: 'مظهر التطبيق',
    themeMode: 'النمط',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    themeSystem: 'النظام',
    accentColor: 'اللون المميز',
    accentZinc: 'رمادي صلب',
    accentIndigo: 'بنفسجي نيلي',
    accentEmerald: 'أخضر زمردي',
    accentOcean: 'أزرق محيطي',
    accentAmber: 'برتقالي غروب',
    accentRose: 'وردي قرمزي',
    /* Website Builder Studio (Arabic) */
    websiteBuilder: 'منشئ المواقع',
    previewMode: 'معاينة',
    editMode: 'تعديل',
    exportCode: 'تصدير الكود',
    publishSite: 'نشر الموقع',
    publishing: 'جاري النشر...',
    publishedLive: 'تم النشر مباشرة',
    undo: 'تراجع',
    redo: 'إعادة',
    viewDesktop: 'سطح المكتب',
    viewTablet: 'جهاز لوحي',
    viewMobile: 'هاتف محمول',
    tabPages: 'الصفحات',
    tabSections: 'الأقسام',
    tabStyles: 'التصميم والأنماط',
    tabLayers: 'الطبقات',
    tabSettings: 'الإعدادات',
    heroSection: 'قسم الواجهة الرئيسية (Hero)',
    featuresSection: 'شبكة الميزات',
    pricingSection: 'جداول الأسعار',
    testimonialsSection: 'آراء وتوصيات العملاء',
    faqSection: 'الأسئلة الشائعة',
    statsSection: 'الإحصائيات والأرقام',
    ctaSection: 'دعوة لاتخاذ إجراء (CTA)',
    footerSection: 'تذييل الصفحة',
    navbarSection: 'شريط التنقل العلوي',
    addSection: 'إضافة قسم',
    deleteSection: 'حذف القسم',
    duplicateSection: 'تكرار القسم',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    sectionProperties: 'خصائص القسم',
    pageSettings: 'إعدادات الصفحة',
    headingText: 'عنوان القسم',
    subtitleText: 'الوصف أو النص الفرعي',
    buttonText: 'نص الزر',
    buttonUrl: 'رابط الزر',
    backgroundStyle: 'نمط الخلفية',
    colorPalette: 'لوحة الألوان',
    fontFamily: 'نوع الخط',
    borderRadius: 'استدارة الحواف',
    seoTitle: 'عنوان تحسين محركات البحث (SEO)',
    seoDescription: 'وصف الصفحة التعريفي',
    customDomain: 'النطاق الخاص',
    starterTemplates: 'نماذج وقوالب جاهزة',
    saasTemplate: 'منصة برمجيات حديثة (SaaS)',
    portfolioTemplate: 'معرض أعمال إبداعي',
    agencyTemplate: 'وكالة رقمية واستوديو',
    startupTemplate: 'شركة تقنية وذكاء اصطناعي',
    loadTemplate: 'تطبيق القالب',
    copyCode: 'نسخ الكود',
    codeCopied: 'تم النسخ إلى الحافظة!',
    downloadHtml: 'تحميل ملف HTML',
    downloadReact: 'تحميل مكون React TSX',
    liveUrl: 'رابط الموقع المباشر',
    sitePublishedTitle: 'موقعك متاح الآن على الإنترنت!',
    sitePublishedDesc: 'تم نشر تعديلاتك بنجاح على شبكة توزيع المحتوى العالمية فائقة السرعة.',
    visitSite: 'زيارة الموقع المباشر',
    addPageBtn: 'صفحة جديدة',
    pageNamePlaceholder: 'اسم الصفحة (مثل: من نحن)',
    noSectionsOnPage: 'لا توجد أقسام في هذه الصفحة بعد.',
    chooseTemplateOrAdd: 'اختر قالباً جاهزاً أو أضف أقساماً جديدة من اللوحة الجانبية.',
    monthlyBilling: 'شهرياً',
    annualBilling: 'سنوياً (وفر 20%)',
    saveChangesBtn: 'تم الحفظ تلقائياً',
    websiteTheme: 'مظهر الموقع',
  },

  fr: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Changer le thème',
    settings: 'Paramètres',
    backToDashboard: 'Retour au tableau de bord',

    // Dashboard
    dashboard: 'Tableau de bord',
    welcomeMessage: 'Bon retour ! Voici un aperçu de vos tâches et projets.',
    createNewTask: 'Créer une tâche',

    // Metrics
    totalTasks: 'Total des tâches',
    inProgress: 'En cours',
    completed: 'Terminées',
    pending: 'En attente',

    // Task List
    recentTasks: 'Tâches récentes',
    searchTasks: 'Rechercher des tâches...',
    all: 'Toutes',
    noTasksAvailable: 'Aucune tâche disponible. Cliquez sur « Créer une tâche » pour commencer.',
    due: 'Échéance',
    priority: 'Priorité',
    editTask: 'Modifier la tâche',
    deleteTask: 'Supprimer la tâche',

    // Priority labels
    lowPriority: 'Priorité basse',
    mediumPriority: 'Priorité moyenne',
    highPriority: 'Priorité haute',

    // Task Adder Modal
    createNewTaskTitle: 'Créer une tâche',
    editTaskTitle: 'Modifier la tâche',
    taskTitle: 'Titre de la tâche',
    taskTitlePlaceholder: 'ex. Concevoir la section héros',
    dueDate: 'Date d\'échéance',
    dueDatePlaceholder: 'ex. Demain ou 20 sept.',
    priorityLabel: 'Priorité',
    cancel: 'Annuler',
    addTask: 'Ajouter',
    saveChanges: 'Enregistrer',

    // Settings Drawer
    settingsTitle: 'Paramètres',
    languageSection: 'Langue',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    spanish: 'Español',
    turkish: 'Türkçe',
    close: 'Fermer',
    workspacesTitle: 'Espaces et Projets',
    workspacesSubtitle: 'Organisez votre travail dans des espaces dédiés façon Notion',
    newWorkspaceOrProject: '+ Nouvel Espace ou Projet',
    activeWorkspaces: 'Vos Espaces',
    noWorkspacesYet: 'Aucun espace personnalisé. Créez-en un pour organiser vos projets.',
    openWorkspace: 'Ouvrir',

    // Calendar
    calendarTitle: 'Planning des tâches et routines',
    today: 'Aujourd\'hui',
    prevMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    months: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    tasksScheduled: 'tâches',
    habitsCompleted: 'habitudes terminées',

    // Daily OS & Habits
    dailyOsTitle: 'Système Quotidien & Habitudes',
    dailyOsSubtitle: 'Exécution quotidienne méthodique, sessions focus et métriques',
    dailyFocus: 'Focus Quotidien',
    weeklyGrid: 'Matrice Hebdo',
    manageHabits: 'Gérer Habitudes',
    focusTimer: 'Minuteur Focus',

    // Daily Metrics
    todayCompletion: 'Taux du jour',
    activeHabitsCount: 'Habitudes actives',
    focusMinutesToday: 'Minutes de Focus',
    monthlyStreakScore: 'Suivis du mois',

    // Daily Focus Section
    dayRating: 'Évaluation de la journée',
    stateAndMindset: 'État d\'esprit & Focus',
    energyLevel: 'Niveau d\'énergie',
    energyLow: 'Faible',
    energyMedium: 'Optimal',
    energyHigh: 'Plein régime',
    habitsChecklist: 'Liste des routines',
    noHabitsConfigured: 'Aucune habitude définie pour ce jour.',
    createFirstHabit: 'Créer une routine',
    streakDays: 'jours consécutifs',

    // States / Mindset
    stateDeepFocus: 'Focus Profond',
    statePeakEnergy: 'Énergie Maximale',
    stateOptimalFlow: 'État de Flow',
    stateCalmExecution: 'Exécution Calme',
    stateFatigue: 'Mode Récupération',
    stateOverloaded: 'Surcharge',

    // Time Blocks
    timeMorning: 'Bloc Matin',
    timeDeepWork: 'Travail Profond',
    timeAfternoon: 'Sprint Après-midi',
    timeEvening: 'Soirée & Détente',
    timeAnytime: 'Flexible',

    // Habit Categories
    catHealth: 'Santé & Vitalité',
    catFitness: 'Forme Physique',
    catDeepWork: 'Travail Profond',
    catMindset: 'Clarté Mentale',
    catPersonal: 'Personnel',
    catSystems: 'Systèmes',

    // Habit Types
    typeGood: 'Habitude Clé (+)',
    typeNeutral: 'Habitude Standard',
    typeBreak: 'À Éviter (-)',

    // Focus Timer
    timerTitle: 'Moteur de Session Focus',
    timerSubtitle: 'Intervalles chronométrés reliés directement à vos tâches et habitudes',
    pomodoro25: '25m Focus',
    deepWork50: '50m Travail Profond',
    quickSprint15: '15m Sprint',
    shortBreak5: '5m Pause',
    customTimer: 'Personnalisé',
    startTimer: 'Démarrer',
    pauseTimer: 'Pause',
    resetTimer: 'Réinitialiser',
    linkHabit: 'Lier à une habitude',
    selectHabitToTrack: 'Sélectionner une habitude pour enregistrer le temps...',
    timerFinishedTitle: 'Session Terminée',
    timerFinishedDesc: 'Temps de concentration enregistré dans votre journal du jour.',
    loggedMinutes: 'min de concentration aujourd\'hui',

    // Wins & Reflection
    dailyWinsTitle: 'Victoires & Résultats Clés',
    addWinPlaceholder: 'Enregistrez un accomplissement ou une victoire...',
    addWinButton: 'Ajouter',
    dailyJournalTitle: 'Journal & Bilan du Soir',
    dailyJournalPlaceholder: 'Réfléchissez à vos apprentissages, obstacles résolus et plan de demain...',

    // Manage Habits Form
    newHabitHeading: 'Définir une nouvelle habitude',
    habitNameLabel: 'Nom de l\'habitude',
    habitNamePlaceholder: 'ex. Lire 20 pages, session de code...',
    habitTypeLabel: 'Classification d\'impact',
    categoryLabel: 'Domaine',
    timeBlockLabel: 'Créneau horaire',
    targetValueLabel: 'Objectif chiffré (optionnel)',
    targetUnitLabel: 'Unité (ex. min, pages, ml)',
    addHabitSubmit: 'Créer la routine',
    deleteHabitConfirm: 'Supprimer la routine',

    // Workspace Creation Page (Notion Style)
    workspaceSetupTitle: 'Créer un Espace ou un Projet',
    workspaceSetupSubtitle: 'Structurez vos initiatives et flux de travail dans des espaces dédiés.',
    entityTypeLabel: 'Type d\'espace',
    typeWorkspace: 'Espace de Travail',
    typeWorkspaceDesc: 'Conteneur global pour plusieurs projets et équipes',
    typeProject: 'Projet Dédié',
    typeProjectDesc: 'Initiative spécifique, sprint ou jalon ciblé',
    workspaceNameLabel: 'Titre de l\'espace',
    workspaceNamePlaceholder: 'ex. Sprint Ingénierie T4 ou Refonte Design',
    workspaceDescLabel: 'Objectif et Portée',
    workspaceDescPlaceholder: 'Décrivez la mission ou le périmètre de cet espace...',
    iconAndColorLabel: 'Identité visuelle & Icône',
    starterTemplatesLabel: 'Modèle de départ',
    templateSprint: 'Tableau Sprint Agile',
    templateSprintDesc: 'Colonnes Kanban avec backlog, sprints actifs, revues et tâches terminées',
    templateStudy: 'Espace Études & Révisions',
    templateStudyDesc: 'Notes de cours, préparation aux examens, lectures et sessions de révision',
    templateBusiness: 'Création d\'Entreprise & Startup',
    templateBusinessDesc: 'Modèle économique, études clients, développement du MVP et jalons de lancement',
    templateRoadmap: 'Feuille de Route Produit',
    templateRoadmapDesc: 'Jalons, phases de livraison et pipeline des fonctionnalités',
    templateLifeOs: 'Life OS Personnel',
    templateLifeOsDesc: 'Routines, objectifs personnels, bilans hebdomadaires',
    templateClient: 'Portail Client',
    templateClientDesc: 'Livrables, étapes clés, suivi des retours et tâches',
    templateBlank: 'Page Vierge',
    templateBlankDesc: 'Un espace épuré à organiser selon vos envies',
    defaultViewLabel: 'Vue principale',
    viewKanban: 'Tableau Kanban',
    viewList: 'Liste Structurée',
    viewTable: 'Table de Données',
    visibilityLabel: 'Confidentialité & Accès',
    visPrivate: 'Espace Privé',
    visShared: 'Accès Équipe',
    visPublic: 'Public en Lecture Seule',
    previewLabel: 'Aperçu en Direct',
    launchWorkspaceBtn: 'Créer et Ouvrir l\'Espace',
    backToHome: 'Retour au tableau de bord',

    // Workspace Details Page
    boardView: 'Tableau',
    listView: 'Liste',
    tableView: 'Table',
    addNewItem: 'Ajouter',
    columnBacklog: 'À traiter',
    columnInProgress: 'En cours',
    columnInReview: 'En revue',
    columnDone: 'Terminé',
    emptyColumn: 'Aucun élément dans cette colonne',
    deleteWorkspace: 'Supprimer l\'espace',
    /* ADDED: Workspace detail translations */
    taskDetails: 'Détails de la tâche',
    taskDescription: 'Description & Notes',
    taskDescriptionPlaceholder: 'Ajouter des notes, spécifications ou détails...',
    changeCover: 'Changer la couverture',
    progressLabel: 'Progression globale',
    inFlightLabel: 'En cours',
    priorityTasksLabel: 'Haute priorité',
    totalBacklogLabel: 'Total des éléments',
    clickToEditTitle: 'Cliquer pour modifier le titre',
    /* All-in-One Workspace Keys */
    tabBoard: 'Tâches & Tableau',
    tabNotes: 'Notes & Documents',
    tabMilestones: 'Jalons & Objectifs',
    tabFocusTimer: 'Minuteur de Concentration',
    tabResources: 'Ressources & Liens',
    addMilestone: 'Nouveau Jalon',
    milestoneTitle: 'Titre du jalon',
    milestoneTarget: 'Échéance cible',
    milestoneProgress: 'Progression',
    addResource: 'Ajouter une ressource',
    resourceName: 'Nom de la ressource',
    resourceUrl: 'Lien URL',
    focusSession: 'Session de Focus',
    logFocusTime: 'Temps de focus enregistré',
    allInOneOverview: 'Aperçu Tout-en-Un',
    projectStatus: 'Statut du projet',
    statusPlanning: 'En planification',
    statusInProgress: 'En cours',
    statusOnTrack: 'Sur la bonne voie',
    statusInReview: 'En revue',
    statusCompleted: 'Terminé',

    /* ADDED: French translations for Notebook & App Theme */
    notebookTitle: 'Carnet de notes',
    notebookSubtitle: 'Espace de documents style Notion',
    addPage: 'Ajouter une page',
    searchNotes: 'Rechercher des notes...',
    favorites: 'Favoris',
    privatePages: 'Pages privées',
    noPagesFound: 'Aucune page trouvée',
    removeCover: 'Supprimer la couverture',
    addCover: '+ Ajouter une couverture',
    bold: 'Gras',
    italic: 'Italique',
    underline: 'Souligné',
    strikethrough: 'Barré',
    unorderedList: 'Liste à puces',
    orderedList: 'Liste numérotée',
    subscript: 'Indice',
    superscript: 'Exposant',
    alignLeft: 'Aligner à gauche',
    alignCenter: 'Centrer',
    alignRight: 'Aligner à droite',
    words: 'mots',
    characters: 'caractères',
    edited: 'Modifié',
    noPageSelected: 'Aucune page sélectionnée',
    createFirstPage: '+ Créer une nouvelle page',
    deletePageTitle: 'Supprimer la page ?',
    deletePageConfirm: 'Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.',
    cancelDelete: 'Annuler',
    deletePage: 'Supprimer',
    fullWidth: 'Pleine largeur',
    pinPage: 'Ajouter aux favoris',
    unpinPage: 'Retirer des favoris',
    backToPages: 'Retour',
    copyContent: 'Copier',
    copiedContent: 'Copié',
    changeIcon: 'Changer d\'icône',
    untitledPage: 'Sans titre',
    loadingWorkspace: 'Chargement de l\'espace...',
    /* ADDED: Font Size & Print/Word Export translations */
    fontSize: 'Taille de police',
    exportWord: 'Exporter Word',
    printPdf: 'Imprimer / PDF',
    themeSection: 'Thème de l\'application',
    themeMode: 'Mode',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeSystem: 'Système',
    accentColor: 'Couleur d\'accentuation',
    accentZinc: 'Gris Ardoise',
    accentIndigo: 'Indigo Violet',
    accentEmerald: 'Vert Émeraude',
    accentOcean: 'Bleu Océan',
    accentAmber: 'Ambre Coucher de Soleil',
    accentRose: 'Rose Cramoisi',
    /* Website Builder Studio (French) */
    websiteBuilder: 'Créateur de Site Web',
    previewMode: 'Aperçu',
    editMode: 'Modifier',
    exportCode: 'Exporter le code',
    publishSite: 'Publier',
    publishing: 'Publication en cours...',
    publishedLive: 'En ligne',
    undo: 'Annuler',
    redo: 'Rétablir',
    viewDesktop: 'Ordinateur',
    viewTablet: 'Tablette',
    viewMobile: 'Mobile',
    tabPages: 'Pages',
    tabSections: 'Sections',
    tabStyles: 'Styles',
    tabLayers: 'Calques',
    tabSettings: 'Paramètres',
    heroSection: 'Bannière d\'accueil (Hero)',
    featuresSection: 'Grille de fonctionnalités',
    pricingSection: 'Grille tarifaire',
    testimonialsSection: 'Témoignages clients',
    faqSection: 'FAQ Accordéon',
    statsSection: 'Statistiques et Chiffres',
    ctaSection: 'Appel à l\'action (CTA)',
    footerSection: 'Pied de page',
    navbarSection: 'Barre de navigation',
    addSection: 'Ajouter une section',
    deleteSection: 'Supprimer la section',
    duplicateSection: 'Dupliquer la section',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    sectionProperties: 'Propriétés de la section',
    pageSettings: 'Paramètres de la page',
    headingText: 'Titre principal',
    subtitleText: 'Sous-titre / Description',
    buttonText: 'Texte du bouton',
    buttonUrl: 'Lien du bouton',
    backgroundStyle: 'Style d\'arrière-plan',
    colorPalette: 'Palette de couleurs',
    fontFamily: 'Typographie',
    borderRadius: 'Arrondi des angles',
    seoTitle: 'Titre SEO de la page',
    seoDescription: 'Méta-description',
    customDomain: 'Domaine personnalisé',
    starterTemplates: 'Modèles de démarrage',
    saasTemplate: 'Plateforme SaaS Moderne',
    portfolioTemplate: 'Portfolio Créatif',
    agencyTemplate: 'Studio & Agence Digitale',
    startupTemplate: 'Startup IA & Technologie',
    loadTemplate: 'Appliquer le modèle',
    copyCode: 'Copier le code',
    codeCopied: 'Copié dans le presse-papier !',
    downloadHtml: 'Télécharger fichier HTML',
    downloadReact: 'Télécharger composant React TSX',
    liveUrl: 'URL du site en direct',
    sitePublishedTitle: 'Votre site est en ligne !',
    sitePublishedDesc: 'Vos modifications ont été déployées mondialement sur des serveurs CDN rapides.',
    visitSite: 'Visiter le site en direct',
    addPageBtn: 'Nouvelle page',
    pageNamePlaceholder: 'Nom de la page (ex. À propos)',
    noSectionsOnPage: 'Aucune section sur cette page.',
    chooseTemplateOrAdd: 'Choisissez un modèle de démarrage ou ajoutez des sections depuis le panneau de gauche.',
    monthlyBilling: 'Mensuel',
    annualBilling: 'Annuel (-20%)',
    saveChangesBtn: 'Enregistré automatiquement',
    websiteTheme: 'Thème du site',
  },

  es: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Cambiar tema',
    settings: 'Ajustes',
    backToDashboard: 'Volver al panel principal',

    // Dashboard
    dashboard: 'Panel de Control',
    welcomeMessage: '¡Bienvenido de nuevo! Aquí tienes un resumen de tus tareas y proyectos.',
    createNewTask: 'Crear nueva tarea',

    // Metrics
    totalTasks: 'Total de tareas',
    inProgress: 'En progreso',
    completed: 'Completadas',
    pending: 'Pendientes',

    // Task List
    recentTasks: 'Tareas recientes',
    searchTasks: 'Buscar tareas...',
    all: 'Todas',
    noTasksAvailable: 'No hay tareas. Haz clic en "Crear nueva tarea" para comenzar.',
    due: 'Vence',
    priority: 'Prioridad',
    editTask: 'Editar tarea',
    deleteTask: 'Eliminar tarea',

    // Priority labels
    lowPriority: 'Prioridad baja',
    mediumPriority: 'Prioridad media',
    highPriority: 'Prioridad alta',

    // Task Adder Modal
    createNewTaskTitle: 'Crear tarea',
    editTaskTitle: 'Editar tarea',
    taskTitle: 'Título de la tarea',
    taskTitlePlaceholder: 'ej. Diseñar la sección principal',
    dueDate: 'Fecha de vencimiento',
    dueDatePlaceholder: 'ej. Mañana o 20 de sep.',
    priorityLabel: 'Prioridad',
    cancel: 'Cancelar',
    addTask: 'Añadir tarea',
    saveChanges: 'Guardar cambios',

    // Settings Drawer
    settingsTitle: 'Ajustes',
    languageSection: 'Idioma',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    spanish: 'Español',
    turkish: 'Türkçe',
    close: 'Cerrar',
    workspacesTitle: 'Espacios y Proyectos',
    workspacesSubtitle: 'Organiza tu trabajo en espacios dedicados estilo Notion',
    newWorkspaceOrProject: '+ Nuevo Espacio o Proyecto',
    activeWorkspaces: 'Tus Espacios',
    noWorkspacesYet: 'Aún no hay espacios personalizados. Crea uno para organizar proyectos.',
    openWorkspace: 'Abrir',

    // Calendar
    calendarTitle: 'Calendario de tareas y hábitos',
    today: 'Hoy',
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    tasksScheduled: 'tareas',
    habitsCompleted: 'hábitos completados',

    // Daily OS & Habits
    dailyOsTitle: 'Sistema Diario y Hábitos',
    dailyOsSubtitle: 'Ejecución diaria metódica, sesiones de enfoque y métricas',
    dailyFocus: 'Enfoque Diario',
    weeklyGrid: 'Matriz Semanal',
    manageHabits: 'Gestionar Hábitos',
    focusTimer: 'Temporizador de Enfoque',

    // Daily Metrics
    todayCompletion: 'Tasa de Hoy',
    activeHabitsCount: 'Hábitos Activos',
    focusMinutesToday: 'Minutos de Enfoque',
    monthlyStreakScore: 'Registros del Mes',

    // Daily Focus Section
    dayRating: 'Calificación del Día',
    stateAndMindset: 'Estado Mental y Enfoque',
    energyLevel: 'Nivel de Energía',
    energyLow: 'Bajo',
    energyMedium: 'Óptimo',
    energyHigh: 'Máximo',
    habitsChecklist: 'Lista de Hábitos',
    noHabitsConfigured: 'No hay hábitos definidos para este día.',
    createFirstHabit: 'Configurar un hábito',
    streakDays: 'días en racha',

    // States / Mindset
    stateDeepFocus: 'Enfoque Profundo',
    statePeakEnergy: 'Energía Máxima',
    stateOptimalFlow: 'Estado de Flujo',
    stateCalmExecution: 'Ejecución Serena',
    stateFatigue: 'Modo Descanso',
    stateOverloaded: 'Sobrecarga',

    // Time Blocks
    timeMorning: 'Bloque Mañana',
    timeDeepWork: 'Trabajo Profundo',
    timeAfternoon: 'Sprint Tarde',
    timeEvening: 'Noche y Desconexión',
    timeAnytime: 'Flexible',

    // Habit Categories
    catHealth: 'Salud y Vitalidad',
    catFitness: 'Forma Física',
    catDeepWork: 'Trabajo Profundo',
    catMindset: 'Claridad Mental',
    catPersonal: 'Personal',
    catSystems: 'Sistemas',

    // Habit Types
    typeGood: 'Hábito Clave (+)',
    typeNeutral: 'Hábito Estándar',
    typeBreak: 'A Evitar (-)',

    // Focus Timer
    timerTitle: 'Motor de Sesiones de Enfoque',
    timerSubtitle: 'Intervalos cronometrados vinculados directamente a tus tareas y hábitos',
    pomodoro25: '25m Enfoque',
    deepWork50: '50m Trabajo Profundo',
    quickSprint15: '15m Sprint',
    shortBreak5: '5m Descanso',
    customTimer: 'Personalizado',
    startTimer: 'Iniciar Sesión',
    pauseTimer: 'Pausar',
    resetTimer: 'Reiniciar',
    linkHabit: 'Vincular a un Hábito',
    selectHabitToTrack: 'Seleccionar hábito para registrar tiempo...',
    timerFinishedTitle: 'Sesión Completada',
    timerFinishedDesc: 'Tiempo de concentración guardado en tu registro diario.',
    loggedMinutes: 'min de enfoque hoy',

    // Wins & Reflection
    dailyWinsTitle: 'Logros y Resultados Clave',
    addWinPlaceholder: 'Registra un logro o resultado importante...',
    addWinButton: 'Añadir',
    dailyJournalTitle: 'Diario y Reflexión del Día',
    dailyJournalPlaceholder: 'Reflexiona sobre tu ritmo, obstáculos superados y plan de mañana...',

    // Manage Habits Form
    newHabitHeading: 'Definir nuevo hábito',
    habitNameLabel: 'Nombre del hábito',
    habitNamePlaceholder: 'ej. Leer 20 páginas, programar...',
    habitTypeLabel: 'Impacto',
    categoryLabel: 'Categoría',
    timeBlockLabel: 'Franja horaria',
    targetValueLabel: 'Objetivo numérico (opcional)',
    targetUnitLabel: 'Unidad (ej. min, págs, ml)',
    addHabitSubmit: 'Crear rutina',
    deleteHabitConfirm: 'Eliminar rutina',

    // Workspace Creation Page (Notion Style)
    workspaceSetupTitle: 'Crear Espacio o Proyecto',
    workspaceSetupSubtitle: 'Estructura tus iniciativas y flujos de trabajo en espacios dedicados.',
    entityTypeLabel: 'Tipo de Espacio',
    typeWorkspace: 'Espacio de Trabajo',
    typeWorkspaceDesc: 'Contenedor general para múltiples proyectos y equipos',
    typeProject: 'Proyecto Enfocado',
    typeProjectDesc: 'Iniciativa específica, sprint o hito puntual',
    workspaceNameLabel: 'Nombre del Espacio',
    workspaceNamePlaceholder: 'ej. Sprint Ingeniería Q4 o Sistema de Diseño',
    workspaceDescLabel: 'Objetivo y Propósito',
    workspaceDescPlaceholder: 'Describe la meta principal de este espacio...',
    iconAndColorLabel: 'Identidad e Ícono',
    starterTemplatesLabel: 'Plantilla Inicial',
    templateSprint: 'Tablero de Sprints Agile',
    templateSprintDesc: 'Columnas Kanban con backlog, sprints activos, revisión y completados',
    templateStudy: 'OS de Estudio y Académico',
    templateStudyDesc: 'Apuntes de clase, exámenes, resúmenes, lecturas y bloques de estudio profundo',
    templateBusiness: 'Lanzamiento de Negocio & Startup',
    templateBusinessDesc: 'Modelo de negocio, validación con clientes, creación de MVP e hitos de lanzamiento',
    templateRoadmap: 'Hoja de Ruta del Producto',
    templateRoadmapDesc: 'Hitos, fases de lanzamiento y priorización de funciones',
    templateLifeOs: 'Life OS Personal',
    templateLifeOsDesc: 'Hábitos, metas personales, revisiones semanales',
    templateClient: 'Portal de Clientes',
    templateClientDesc: 'Seguimiento de entregas, hitos y retroalimentación',
    templateBlank: 'Lienzo en Blanco',
    templateBlankDesc: 'Un espacio limpio para diseñar según tu preferencia',
    defaultViewLabel: 'Vista Principal',
    viewKanban: 'Tablero Kanban',
    viewList: 'Lista Estructurada',
    viewTable: 'Tabla de Datos',
    visibilityLabel: 'Privacidad y Acceso',
    visPrivate: 'Espacio Privado',
    visShared: 'Acceso de Equipo',
    visPublic: 'Público Sólo Lectura',
    previewLabel: 'Vista Previa en Vivo',
    launchWorkspaceBtn: 'Crear y Abrir Espacio',
    backToHome: 'Volver al panel',

    // Workspace Details Page
    boardView: 'Tablero',
    listView: 'Lista',
    tableView: 'Tabla',
    addNewItem: 'Añadir',
    columnBacklog: 'Pendiente',
    columnInProgress: 'En Progreso',
    columnInReview: 'En Revisión',
    columnDone: 'Completado',
    emptyColumn: 'No hay elementos en esta columna',
    deleteWorkspace: 'Eliminar Espacio',
    /* ADDED: Workspace detail translations */
    taskDetails: 'Detalles de la tarea',
    taskDescription: 'Descripción y notas',
    taskDescriptionPlaceholder: 'Añadir notas, especificaciones o detalles...',
    changeCover: 'Cambiar portada',
    progressLabel: 'Progreso general',
    inFlightLabel: 'En curso',
    priorityTasksLabel: 'Alta prioridad',
    totalBacklogLabel: 'Total de elementos',
    clickToEditTitle: 'Haz clic para editar título',
    /* All-in-One Workspace Keys */
    tabBoard: 'Tareas y Tablero',
    tabNotes: 'Notas y Documentos',
    tabMilestones: 'Hitos y Objetivos',
    tabFocusTimer: 'Temporizador de Enfoque',
    tabResources: 'Recursos y Enlaces',
    addMilestone: 'Nuevo Hito',
    milestoneTitle: 'Título del hito',
    milestoneTarget: 'Fecha límite objetivo',
    milestoneProgress: 'Progreso',
    addResource: 'Añadir enlace de recurso',
    resourceName: 'Nombre del recurso',
    resourceUrl: 'Enlace URL',
    focusSession: 'Sesión de Enfoque',
    logFocusTime: 'Tiempo de enfoque registrado',
    allInOneOverview: 'Resumen Todo en Uno',
    projectStatus: 'Estado del proyecto',
    statusPlanning: 'En planificación',
    statusInProgress: 'En progreso',
    statusOnTrack: 'En tiempo',
    statusInReview: 'En revisión',
    statusCompleted: 'Completado',

    /* ADDED: Spanish translations for Notebook & App Theme */
    notebookTitle: 'Cuaderno de notas',
    notebookSubtitle: 'Espacio de documentos estilo Notion',
    addPage: 'Agregar nueva página',
    searchNotes: 'Buscar notas...',
    favorites: 'Favoritos',
    privatePages: 'Páginas privadas',
    noPagesFound: 'No se encontraron páginas',
    removeCover: 'Eliminar portada',
    addCover: '+ Agregar portada',
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    strikethrough: 'Tachado',
    unorderedList: 'Lista con viñetas',
    orderedList: 'Lista numerada',
    subscript: 'Subíndice',
    superscript: 'Superíndice',
    alignLeft: 'Alinear a la izquierda',
    alignCenter: 'Centrar',
    alignRight: 'Alinear a la derecha',
    words: 'palabras',
    characters: 'caracteres',
    edited: 'Editado',
    noPageSelected: 'Ninguna página seleccionada',
    createFirstPage: '+ Crear nueva página',
    deletePageTitle: '¿Eliminar página?',
    deletePageConfirm: '¿Estás seguro de que deseas eliminar esta página? Esta acción no se puede deshacer.',
    cancelDelete: 'Cancelar',
    deletePage: 'Eliminar',
    fullWidth: 'Ancho completo',
    pinPage: 'Fijar a favoritos',
    unpinPage: 'Desfijar página',
    backToPages: 'Volver',
    copyContent: 'Copiar',
    copiedContent: 'Copiado',
    changeIcon: 'Cambiar icono',
    untitledPage: 'Sin título',
    loadingWorkspace: 'Cargando espacio...',
    /* ADDED: Font Size & Print/Word Export translations */
    fontSize: 'Tamaño de fuente',
    exportWord: 'Exportar Word',
    printPdf: 'Imprimir / PDF',
    themeSection: 'Tema de la aplicación',
    themeMode: 'Modo',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',
    accentColor: 'Color de acento',
    accentZinc: 'Gris Pizarra',
    accentIndigo: 'Índigo Violeta',
    accentEmerald: 'Verde Esmeralda',
    accentOcean: 'Azul Océano',
    accentAmber: 'Ámbar Atardecer',
    accentRose: 'Rosa Carmesí',
    /* Website Builder Studio (Spanish) */
    websiteBuilder: 'Creador de Sitios Web',
    previewMode: 'Vista previa',
    editMode: 'Editar',
    exportCode: 'Exportar código',
    publishSite: 'Publicar',
    publishing: 'Publicando...',
    publishedLive: 'Publicado en vivo',
    undo: 'Deshacer',
    redo: 'Rehacer',
    viewDesktop: 'Escritorio',
    viewTablet: 'Tableta',
    viewMobile: 'Móvil',
    tabPages: 'Páginas',
    tabSections: 'Secciones',
    tabStyles: 'Estilos',
    tabLayers: 'Capas',
    tabSettings: 'Ajustes',
    heroSection: 'Banner Principal (Hero)',
    featuresSection: 'Cuadrícula de Características',
    pricingSection: 'Tablas de Precios',
    testimonialsSection: 'Testimonios',
    faqSection: 'Preguntas Frecuentes',
    statsSection: 'Estadísticas y Métricas',
    ctaSection: 'Llamada a la Acción (CTA)',
    footerSection: 'Pie de Página',
    navbarSection: 'Barra de Navegación',
    addSection: 'Añadir sección',
    deleteSection: 'Eliminar sección',
    duplicateSection: 'Duplicar sección',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    sectionProperties: 'Propiedades de la sección',
    pageSettings: 'Ajustes de página',
    headingText: 'Texto del título',
    subtitleText: 'Subtítulo / Descripción',
    buttonText: 'Texto del botón',
    buttonUrl: 'Enlace del botón',
    backgroundStyle: 'Estilo de fondo',
    colorPalette: 'Paleta de colores',
    fontFamily: 'Tipografía',
    borderRadius: 'Radio de bordes',
    seoTitle: 'Título SEO de la página',
    seoDescription: 'Meta descripción',
    customDomain: 'Dominio personalizado',
    starterTemplates: 'Plantillas de inicio',
    saasTemplate: 'Plataforma SaaS Moderna',
    portfolioTemplate: 'Portafolio Creativo',
    agencyTemplate: 'Estudio & Agencia Digital',
    startupTemplate: 'Startup de IA y Tecnología',
    loadTemplate: 'Aplicar plantilla',
    copyCode: 'Copiar código',
    codeCopied: '¡Copiado al portapapeles!',
    downloadHtml: 'Descargar archivo HTML',
    downloadReact: 'Descargar componente React TSX',
    liveUrl: 'URL del sitio en vivo',
    sitePublishedTitle: '¡Tu sitio web está en vivo!',
    sitePublishedDesc: 'Tus cambios se han desplegado globalmente en servidores CDN de alta velocidad.',
    visitSite: 'Visitar sitio en vivo',
    addPageBtn: 'Nueva página',
    pageNamePlaceholder: 'Nombre de página (ej. Nosotros)',
    noSectionsOnPage: 'Aún no hay secciones en esta página.',
    chooseTemplateOrAdd: 'Elige una plantilla o añade secciones desde el panel izquierdo.',
    monthlyBilling: 'Mensual',
    annualBilling: 'Anual (Ahorra 20%)',
    saveChangesBtn: 'Guardado automáticamente',
    websiteTheme: 'Tema del sitio web',
  },

  tr: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Temayı değiştir',
    settings: 'Ayarlar',
    backToDashboard: 'Panele Geri Dön',

    // Dashboard
    dashboard: 'Gösterge Paneli',
    welcomeMessage: 'Tekrar hoş geldiniz! Görevlerinize ve projelerinize genel bir bakış.',
    createNewTask: 'Yeni Görev Oluştur',

    // Metrics
    totalTasks: 'Toplam Görevler',
    inProgress: 'Devam Eden',
    completed: 'Tamamlanan',
    pending: 'Bekleyen',

    // Task List
    recentTasks: 'Son Görevler',
    searchTasks: 'Görev ara...',
    all: 'Tümü',
    noTasksAvailable: 'Görev bulunamadı. İlk görevinizi eklemek için "Yeni Görev Oluştur"a tıklayın.',
    due: 'Son tarih',
    priority: 'Öncelik',
    editTask: 'Görevi Düzenle',
    deleteTask: 'Görevi Sil',

    // Priority labels
    lowPriority: 'Düşük Öncelik',
    mediumPriority: 'Orta Öncelik',
    highPriority: 'Yüksek Öncelik',

    // Task Adder Modal
    createNewTaskTitle: 'Yeni Görev Oluştur',
    editTaskTitle: 'Görevi Düzenle',
    taskTitle: 'Görev Başlığı',
    taskTitlePlaceholder: 'ör. Ana sayfa bölümünü tasarla',
    dueDate: 'Bitiş Tarihi',
    dueDatePlaceholder: 'ör. Yarın veya 20 Eylül',
    priorityLabel: 'Öncelik',
    cancel: 'İptal',
    addTask: 'Görev Ekle',
    saveChanges: 'Değişiklikleri Kaydet',

    // Settings Drawer
    settingsTitle: 'Ayarlar',
    languageSection: 'Dil',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    spanish: 'Español',
    turkish: 'Türkçe',
    close: 'Kapat',
    workspacesTitle: 'Çalışma Alanları ve Projeler',
    workspacesSubtitle: 'İşlerinizi Notion tarzı özel alanlarda organize edin',
    newWorkspaceOrProject: '+ Yeni Çalışma Alanı veya Proje',
    activeWorkspaces: 'Alanlarınız',
    noWorkspacesYet: 'Henüz özel alan yok. Projelerinizi düzenlemek için bir tane oluşturun.',
    openWorkspace: 'Aç',

    // Calendar
    calendarTitle: 'Görev ve Alışkanlık Takvimi',
    today: 'Bugün',
    prevMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
    months: [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ],
    days: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    tasksScheduled: 'görev',
    habitsCompleted: 'alışkanlık tamamlandı',

    // Daily OS & Habits
    dailyOsTitle: 'Günlük OS ve Alışkanlık Sistemi',
    dailyOsSubtitle: 'Sistematik günlük uygulama, odak seansları ve performans metrikleri',
    dailyFocus: 'Günlük Odak',
    weeklyGrid: 'Haftalık Matris',
    manageHabits: 'Alışkanlıkları Yönet',
    focusTimer: 'Odak Sayacı',

    // Daily Metrics
    todayCompletion: 'Bugünkü Oran',
    activeHabitsCount: 'Aktif Rutinler',
    focusMinutesToday: 'Derin Odak Dakikası',
    monthlyStreakScore: 'Aylık Kayıtlar',

    // Daily Focus Section
    dayRating: 'Günün Değerlendirmesi',
    stateAndMindset: 'Zihinsel Durum & Odak',
    energyLevel: 'Enerji Düzeyi',
    energyLow: 'Düşük',
    energyMedium: 'Optimum',
    energyHigh: 'Zirve',
    habitsChecklist: 'Rutin Listesi',
    noHabitsConfigured: 'Bu gün için tanımlanmış rutin yok.',
    createFirstHabit: 'Yeni bir rutin tanımla',
    streakDays: 'günlük seri',

    // States / Mindset
    stateDeepFocus: 'Derin Odak',
    statePeakEnergy: 'Zirve Enerji',
    stateOptimalFlow: 'Akış Durumu',
    stateCalmExecution: 'Sakin İlerleme',
    stateFatigue: 'Dinlenme Modu',
    stateOverloaded: 'Aşırı Yüklenme',

    // Time Blocks
    timeMorning: 'Sabah Bloğu',
    timeDeepWork: 'Derin Çalışma',
    timeAfternoon: 'Öğleden Sonra',
    timeEvening: 'Akşam & Kapanış',
    timeAnytime: 'Esnek Zaman',

    // Habit Categories
    catHealth: 'Sağlık & Canlılık',
    catFitness: 'Spor & Fitness',
    catDeepWork: 'Derin Çalışma',
    catMindset: 'Zihinsel Berraklık',
    catPersonal: 'Kişisel',
    catSystems: 'Sistemler',

    // Habit Types
    typeGood: 'Temel Alışkanlık (+)',
    typeNeutral: 'Standart Alışkanlık',
    typeBreak: 'Kaçınılacak Alışkanlık (-)',

    // Focus Timer
    timerTitle: 'Odak Seansı Motoru',
    timerSubtitle: 'Doğrudan görev ve alışkanlıklarınıza bağlı zaman aralıkları',
    pomodoro25: '25d Odak',
    deepWork50: '50d Derin Çalışma',
    quickSprint15: '15d Hızlı Sprint',
    shortBreak5: '5d Mola',
    customTimer: 'Özel',
    startTimer: 'Seansı Başlat',
    pauseTimer: 'Duraklat',
    resetTimer: 'Sıfırla',
    linkHabit: 'Alışkanlığa Bağla',
    selectHabitToTrack: 'Süre kaydetmek için alışkanlık seçin...',
    timerFinishedTitle: 'Seans Tamamlandı',
    timerFinishedDesc: 'Odak süresi kaydedildi ve günlük günlüğünüze eklendi.',
    loggedMinutes: 'dk odaklanıldı bugün',

    // Wins & Reflection
    dailyWinsTitle: 'Günün Kazanımları & Sonuçları',
    addWinPlaceholder: 'Önemli bir başarıyı veya sonucu kaydedin...',
    addWinButton: 'Kaydet',
    dailyJournalTitle: 'Akşam Değerlendirmesi & Günlük',
    dailyJournalPlaceholder: 'Bugünün gidişatı, aşılan engeller ve yarının planı üzerine düşünceler...',

    // Manage Habits Form
    newHabitHeading: 'Yeni Rutin / Alışkanlık Tanımla',
    habitNameLabel: 'Alışkanlık Adı',
    habitNamePlaceholder: 'ör. 20 sayfa kitap oku, kod yaz...',
    habitTypeLabel: 'Etki Sınıflandırması',
    categoryLabel: 'Kategori',
    timeBlockLabel: 'Zaman Dilimi',
    targetValueLabel: 'Hedef Miktar (İsteğe Bağlı)',
    targetUnitLabel: 'Birim (ör. dk, sayfa, ml)',
    addHabitSubmit: 'Rutin Oluştur',
    deleteHabitConfirm: 'Rutini Sil',

    // Workspace Creation Page (Notion Style)
    workspaceSetupTitle: 'Çalışma Alanı veya Proje Oluştur',
    workspaceSetupSubtitle: 'Girişimlerinizi ve iş akışlarınızı Notion tarzı bağımsız alanlarda yapılandırın.',
    entityTypeLabel: 'Alan Türü',
    typeWorkspace: 'Çalışma Alanı Merkezi',
    typeWorkspaceDesc: 'Birden fazla proje ve ekip için kapsamlı organizasyon alanı',
    typeProject: 'Odaklanmış Proje',
    typeProjectDesc: 'Belirli bir hedef, sprint veya dönüm noktası için özel alan',
    workspaceNameLabel: 'Alan / Proje Başlığı',
    workspaceNamePlaceholder: 'ör. Q4 Mühendislik Sprinti veya Tasarım Sistemi',
    workspaceDescLabel: 'Amaç ve Kapsam',
    workspaceDescPlaceholder: 'Bu alanın ana hedeflerini ve kapsamını açıklayın...',
    iconAndColorLabel: 'Kimlik ve İkon',
    starterTemplatesLabel: 'Başlangıç Şablonu',
    templateSprint: 'Çevik Sprint Panosu',
    templateSprintDesc: 'Backlog, aktif sprint, inceleme ve tamamlanan sütunlu Kanban',
    templateStudy: 'Ders Çalışma & Akademik OS',
    templateStudyDesc: 'Ders notları, sınavlar, özetler, okumalar ve derin çalışma oturumları',
    templateBusiness: 'İş Kurma & Girişim Merkezi',
    templateBusinessDesc: 'İş modeli, müşteri araştırması, MVP geliştirme ve lansman kilometre taşları',
    templateRoadmap: 'Ürün Yol Haritası',
    templateRoadmapDesc: 'Aşamalar, yayın takvimi ve özellik önceliklendirme akışı',
    templateLifeOs: 'Kişisel Yaşam OS',
    templateLifeOsDesc: 'Alışkanlıklar, kişisel hedefler ve haftalık değerlendirmeler',
    templateClient: 'Müşteri Portalı',
    templateClientDesc: 'Teslimat takibi, ara hedefler ve geri bildirim kayıtları',
    templateBlank: 'Boş Sayfa',
    templateBlankDesc: 'Dilediğiniz gibi yapılandırabileceğiniz temiz bir başlangıç',
    defaultViewLabel: 'Birincil Görünüm',
    viewKanban: 'Kanban Panosu',
    viewList: 'Yapılandırılmış Liste',
    viewTable: 'Veri Tablosu',
    visibilityLabel: 'Gizlilik ve Erişim',
    visPrivate: 'Özel Alan',
    visShared: 'Ekip Erişimi',
    visPublic: 'Herkese Açık (Salt Okunur)',
    previewLabel: 'Canlı Önizleme',
    launchWorkspaceBtn: 'Alanı Oluştur ve Aç',
    backToHome: 'Panele Geri Dön',

    // Workspace Details Page
    boardView: 'Pano',
    listView: 'Liste',
    tableView: 'Tablo',
    addNewItem: 'Öğe Ekle',
    columnBacklog: 'Bekleyenler',
    columnInProgress: 'Devam Eden',
    columnInReview: 'İncelemede',
    columnDone: 'Tamamlandı',
    emptyColumn: 'Bu sütunda henüz öğe yok',
    deleteWorkspace: 'Alanı Sil',
    /* ADDED: Workspace detail translations */
    taskDetails: 'Görev Detayları',
    taskDescription: 'Açıklama ve Notlar',
    taskDescriptionPlaceholder: 'Detaylı notlar veya görev kriterleri ekleyin...',
    changeCover: 'Kapağı Değiştir',
    progressLabel: 'Genel İlerleme',
    inFlightLabel: 'Devam Eden',
    priorityTasksLabel: 'Yüksek Öncelik',
    totalBacklogLabel: 'Toplam Öğe',
    clickToEditTitle: 'Başlığı düzenlemek için tıklayın',
    /* All-in-One Workspace Keys */
    tabBoard: 'Görevler ve Pano',
    tabNotes: 'Proje Notları ve Belgeler',
    tabMilestones: 'Aşamalar ve Hedefler',
    tabFocusTimer: 'Odaklanma ve Çalışma Zamanlayıcısı',
    tabResources: 'Kaynaklar ve Bağlantılar',
    addMilestone: 'Yeni Aşama',
    milestoneTitle: 'Aşama Başlığı',
    milestoneTarget: 'Hedef Tarih',
    milestoneProgress: 'İlerleme',
    addResource: 'Kaynak Bağlantısı Ekle',
    resourceName: 'Kaynak Başlığı',
    resourceUrl: 'URL Bağlantısı',
    focusSession: 'Odaklanma Oturumu',
    logFocusTime: 'Kaydedilen Odak Süresi',
    allInOneOverview: 'Hepsi Bir Arada Genel Bakış',
    projectStatus: 'Proje Durumu',
    statusPlanning: 'Planlanıyor',
    statusInProgress: 'Devam Ediyor',
    statusOnTrack: 'Yolunda',
    statusInReview: 'İncelemede',
    statusCompleted: 'Tamamlandı',

    /* ADDED: Turkish translations for Notebook & App Theme */
    notebookTitle: 'Not Defteri',
    notebookSubtitle: 'Notion tarzı kişisel belge alanı',
    addPage: 'Yeni sayfa ekle',
    searchNotes: 'Notlarda ara...',
    favorites: 'Favoriler',
    privatePages: 'Özel Sayfalar',
    noPagesFound: 'Sayfa bulunamadı',
    removeCover: 'Kapağı kaldır',
    addCover: '+ Kapak ekle',
    bold: 'Kalın',
    italic: 'Eğik',
    underline: 'Altı Çizili',
    strikethrough: 'Üstü Çizili',
    unorderedList: 'Maddeli Liste',
    orderedList: 'Numaralı Liste',
    subscript: 'Alt Simge',
    superscript: 'Üst Simge',
    alignLeft: 'Sola Hizala',
    alignCenter: 'Ortala',
    alignRight: 'Sağa Hizala',
    words: 'kelime',
    characters: 'karakter',
    edited: 'Düzenlendi',
    noPageSelected: 'Sayfa seçilmedi',
    createFirstPage: '+ Yeni sayfa oluştur',
    deletePageTitle: 'Sayfa silinsin mi?',
    deletePageConfirm: 'Bu sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    cancelDelete: 'İptal',
    deletePage: 'Sil',
    fullWidth: 'Tam genişlik',
    pinPage: 'Favorilere sabitle',
    unpinPage: 'Sabitlemeyi kaldır',
    backToPages: 'Geri',
    copyContent: 'Kopyala',
    copiedContent: 'Kopyalandı',
    changeIcon: 'Simgeyi değiştir',
    untitledPage: 'Başlıksız',
    loadingWorkspace: 'Çalışma alanı yükleniyor...',
    /* ADDED: Font Size & Print/Word Export translations */
    fontSize: 'Yazı Tipi Boyutu',
    exportWord: 'Word Olarak Aktar',
    printPdf: 'Yazdır / PDF',
    themeSection: 'Uygulama Teması',
    themeMode: 'Mod',
    themeLight: 'Açık',
    themeDark: 'Koyu',
    themeSystem: 'Sistem',
    accentColor: 'Vurgu Rengi',
    accentZinc: 'Kurşuni Gri',
    accentIndigo: 'Çivit Mor',
    accentEmerald: 'Zümrüt Yeşil',
    accentOcean: 'Okyanus Mavi',
    accentAmber: 'Kehribar Turuncu',
    accentRose: 'Gül Kırmızı',
    /* Website Builder Studio (Turkish) */
    websiteBuilder: 'Web Sitesi Oluşturucu',
    previewMode: 'Önizleme',
    editMode: 'Düzenle',
    exportCode: 'Kodu Dışa Aktar',
    publishSite: 'Yayınla',
    publishing: 'Yayınlanıyor...',
    publishedLive: 'Canlı Yayında',
    undo: 'Geri Al',
    redo: 'Yinele',
    viewDesktop: 'Masaüstü',
    viewTablet: 'Tablet',
    viewMobile: 'Mobil',
    tabPages: 'Sayfalar',
    tabSections: 'Bölümler',
    tabStyles: 'Stiller',
    tabLayers: 'Katmanlar',
    tabSettings: 'Ayarlar',
    heroSection: 'Ana Tanıtım (Hero)',
    featuresSection: 'Özellik Izgarası',
    pricingSection: 'Fiyatlandırma Tabloları',
    testimonialsSection: 'Müşteri Yorumları',
    faqSection: 'Sık Sorulan Sorular',
    statsSection: 'İstatistikler ve Veriler',
    ctaSection: 'Harekete Geçirici Mesaj (CTA)',
    footerSection: 'Alt Bilgi (Footer)',
    navbarSection: 'Gezinme Çubuğu (Navbar)',
    addSection: 'Bölüm Ekle',
    deleteSection: 'Bölümü Sil',
    duplicateSection: 'Bölümü Çoğalt',
    moveUp: 'Yukarı Taşı',
    moveDown: 'Aşağı Taşı',
    sectionProperties: 'Bölüm Özellikleri',
    pageSettings: 'Sayfa Ayarları',
    headingText: 'Başlık Metni',
    subtitleText: 'Alt Başlık / Açıklama',
    buttonText: 'Düğme Metni',
    buttonUrl: 'Düğme Bağlantısı',
    backgroundStyle: 'Arka Plan Stili',
    colorPalette: 'Renk Paleti',
    fontFamily: 'Yazı Tipi',
    borderRadius: 'Kenarlık Yuvarlama',
    seoTitle: 'Sayfa SEO Başlığı',
    seoDescription: 'Meta Açıklaması',
    customDomain: 'Özel Alan Adı',
    starterTemplates: 'Başlangıç Şablonları',
    saasTemplate: 'Modern SaaS Platformu',
    portfolioTemplate: 'Yaratıcı Portföy',
    agencyTemplate: 'Dijital Ajans & Stüdyo',
    startupTemplate: 'Yapay Zeka Girişimi',
    loadTemplate: 'Şablonu Uygula',
    copyCode: 'Kodu Kopyala',
    codeCopied: 'Panoya Kopyalandı!',
    downloadHtml: 'HTML Dosyasını İndir',
    downloadReact: 'React TSX Bileşenini İndir',
    liveUrl: 'Canlı Site Bağlantısı',
    sitePublishedTitle: 'Web Siteniz Yayında!',
    sitePublishedDesc: 'Değişiklikleriniz yüksek hızlı global CDN sunucularına başarıyla dağıtıldı.',
    visitSite: 'Canlı Siteyi Ziyaret Et',
    addPageBtn: 'Yeni Sayfa',
    pageNamePlaceholder: 'Sayfa adı (örn. Hakkımızda)',
    noSectionsOnPage: 'Bu sayfada henüz bölüm bulunmuyor.',
    chooseTemplateOrAdd: 'Bir başlangıç şablonu seçin veya sol panelden bölümler ekleyin.',
    monthlyBilling: 'Aylık',
    annualBilling: 'Yıllık (%20 İndirim)',
    saveChangesBtn: 'Otomatik Kaydedildi',
    websiteTheme: 'Site Teması',
  },
};

export default translations;
