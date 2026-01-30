/**
 * App-Level Component Constants
 * Centralized patterns for consistent app-level components
 */

export const APP_PATTERNS = {
  // Activity timeline patterns
  activityTimeline: {
    loadingCard: "flex items-center justify-center h-32",
    iconContainer: "flex h-8 w-8 items-center justify-center rounded-full bg-muted",
    itemContainer: "flex items-start gap-4 pb-4 last:pb-0",
  },
  
  // Sidebar patterns
  sidebar: {
    container: "flex flex-col h-full",
    footer: "mt-auto",
    menuItem: "flex items-center gap-2",
    badge: "ml-auto text-xs",
  },
  
  // Navigation patterns
  navigation: {
    active: "bg-accent text-accent-foreground",
    hover: "hover:bg-accent hover:text-accent-foreground",
    transition: "transition-colors duration-200",
  },
  
  // Card section patterns
  sectionCards: {
    container: "grid grid-cols-1 gap-4 px-4 lg:px-6",
    cardGradient: "bg-gradient-to-t from-primary/5 to-card dark:from-card dark:to-card",
    responsive: "@xl/main:grid-cols-2 @5xl/main:grid-cols-4",
    containerQuery: "@container/card",
  },
  
  // Form patterns
  form: {
    container: "space-y-4",
    field: "space-y-2",
    label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    input: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  },
  
  // Loading patterns
  loading: {
    skeleton: "animate-pulse rounded-md bg-muted",
    spinner: "animate-spin",
    overlay: "fixed inset-0 bg-background/80 backdrop-blur-sm",
  },
  
  // Empty state patterns
  emptyState: {
    container: "flex h-full min-h-96 flex-col items-center justify-center p-8 text-center",
    icon: "mx-auto h-12 w-12 text-muted-foreground",
    title: "mt-4 text-lg font-semibold",
    description: "mt-2 text-sm text-muted-foreground",
  },
  
  // Status patterns
  status: {
    success: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    warning: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950",
    error: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
    info: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  },
} as const;

export const ACTIVITY_TYPES = {
  approval: {
    icon: "CheckSquare",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  message: {
    icon: "MessageSquare",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  team: {
    icon: "Users",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
  system: {
    icon: "Activity",
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900",
  },
} as const;

export const ROUTES = {
  dashboard: "/app",
  inbox: "/app/inbox",
  omnichannel: "/app/omnichannel",
  approvals: "/app/approvals",
  activity: "/app/activity",
  tasks: "/app/tasks",
  consultations: "/app/consultations",
  whiteboards: "/app/whiteboards",
  teams: "/app/settings/teams",
  settings: "/app/settings",
  help: "/app/help",
} as const;

export const BADGE_VARIANTS = {
  success: "default",
  warning: "secondary",
  error: "destructive",
  info: "outline",
  neutral: "outline",
} as const;
