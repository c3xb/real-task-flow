export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'tr';

export interface Translations {
  // App
  appName: string;

  // Header / Nav
  toggleTheme: string;
  settings: string;

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
}

const translations: Record<Locale, Translations> = {
  en: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Toggle theme',
    settings: 'Settings',

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
  },
  ar: {
    // App
    appName: 'تدفق المهام',

    // Header / Nav
    toggleTheme: 'تبديل المظهر',
    settings: 'الإعدادات',

    // Dashboard
    dashboard: 'لوحة التحكم',
    welcomeMessage: 'مرحبًا بعودتك! إليك نظرة عامة على مهامك.',
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
  },
  fr: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Changer le thème',
    settings: 'Paramètres',

    // Dashboard
    dashboard: 'Tableau de bord',
    welcomeMessage: 'Bon retour ! Voici un aperçu de vos tâches.',
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
    taskTitlePlaceholder: 'ex. Concevoir la section héros de la page',
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
  },
  es: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Cambiar tema',
    settings: 'Ajustes',

    // Dashboard
    dashboard: 'Panel',
    welcomeMessage: '¡Bienvenido de nuevo! Aquí tienes un resumen de tus tareas.',
    createNewTask: 'Crear tarea',

    // Metrics
    totalTasks: 'Total de tareas',
    inProgress: 'En progreso',
    completed: 'Completadas',
    pending: 'Pendientes',

    // Task List
    recentTasks: 'Tareas recientes',
    searchTasks: 'Buscar tareas...',
    all: 'Todas',
    noTasksAvailable: 'No hay tareas. Haz clic en "Crear tarea" para añadir la primera.',
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
    taskTitlePlaceholder: 'ej. Diseñar la sección principal de la página',
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
  },
  tr: {
    // App
    appName: 'Task Flow',

    // Header / Nav
    toggleTheme: 'Temayı değiştir',
    settings: 'Ayarlar',

    // Dashboard
    dashboard: 'Gösterge Paneli',
    welcomeMessage: 'Tekrar hoş geldiniz! Görevlerinize genel bir bakış.',
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
  },
};

export default translations;
