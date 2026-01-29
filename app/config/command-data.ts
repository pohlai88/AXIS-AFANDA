import {
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageSquare,
  Video,
  Settings,
  HelpCircle,
  Users,
  Activity,
  Pencil,
  FileText,
  Sparkles,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Lock,
  Link2,
  Wrench,
  type LucideIcon,
} from "lucide-react"

// Command item types
export interface CommandItemData {
  id: string
  label: string
  icon: LucideIcon
  shortcut?: string
  keywords?: string[]
  disabled?: boolean
}

export interface CommandNavigationItem extends CommandItemData {
  type: "navigation"
  href: string
}

export interface CommandActionItem extends CommandItemData {
  type: "action"
  action: string
}

export type CommandItem = CommandNavigationItem | CommandActionItem

export interface CommandGroup {
  id: string
  heading: string
  items: CommandItem[]
}

// Navigation commands
export const navigationCommands: CommandGroup = {
  id: "navigation",
  heading: "Navigation",
  items: [
    {
      id: "dashboard",
      type: "navigation",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/app",
      shortcut: "⌘D",
      keywords: ["home", "main"],
    },
    {
      id: "inbox",
      type: "navigation",
      label: "Inbox",
      icon: Mail,
      href: "/app/inbox",
      shortcut: "⌘I",
      keywords: ["messages", "mail"],
    },
    {
      id: "omnichannel",
      type: "navigation",
      label: "Omnichannel",
      icon: MessageSquare,
      href: "/app/omnichannel",
      shortcut: "⌘O",
      keywords: ["chat", "conversations", "support"],
    },
  ],
}

// Workflow commands
export const workflowCommands: CommandGroup = {
  id: "workflow",
  heading: "Workflow",
  items: [
    {
      id: "approvals",
      type: "navigation",
      label: "Approvals",
      icon: CheckSquare,
      href: "/app/approvals",
      shortcut: "⌘A",
      keywords: ["requests", "pending"],
    },
    {
      id: "new-approval",
      type: "navigation",
      label: "New Approval",
      icon: CheckSquare,
      href: "/app/approvals/new",
      keywords: ["create", "request"],
    },
    {
      id: "activity",
      type: "navigation",
      label: "Activity",
      icon: Activity,
      href: "/app/activity",
      keywords: ["history", "log", "audit"],
    },
    {
      id: "tasks",
      type: "action",
      label: "Tasks (MagicTodo)",
      icon: Sparkles,
      action: "toggle-magic-todo",
      shortcut: "⌘T",
      keywords: ["todo", "tasks", "magic"],
    },
  ],
}

// Collaboration commands
export const collaborationCommands: CommandGroup = {
  id: "collaboration",
  heading: "Collaboration",
  items: [
    {
      id: "consultations",
      type: "navigation",
      label: "Consultations",
      icon: Video,
      href: "/app/consultations",
      shortcut: "⌘C",
      keywords: ["meetings", "video", "call"],
    },
    {
      id: "whiteboards",
      type: "navigation",
      label: "Whiteboards",
      icon: Pencil,
      href: "/app/whiteboards",
      shortcut: "⌘W",
      keywords: ["draw", "sketch", "tldraw"],
    },
  ],
}

// Organization commands
export const organizationCommands: CommandGroup = {
  id: "organization",
  heading: "Organization",
  items: [
    {
      id: "teams",
      type: "navigation",
      label: "Teams",
      icon: Users,
      href: "/app/settings/teams",
      keywords: ["groups", "members"],
    },
    {
      id: "templates",
      type: "navigation",
      label: "Templates",
      icon: FileText,
      href: "/app/settings/templates",
      keywords: ["forms", "presets"],
    },
  ],
}

// Settings commands
export const settingsCommands: CommandGroup = {
  id: "settings",
  heading: "Settings",
  items: [
    {
      id: "settings",
      type: "navigation",
      label: "Settings",
      icon: Settings,
      href: "/app/settings",
      shortcut: "⌘,",
      keywords: ["preferences", "config"],
    },
    {
      id: "profile",
      type: "navigation",
      label: "Profile",
      icon: User,
      href: "/app/settings/profile",
      keywords: ["account", "user"],
    },
    {
      id: "notifications",
      type: "navigation",
      label: "Notifications",
      icon: Bell,
      href: "/app/settings/notifications",
      keywords: ["alerts", "bell"],
    },
    {
      id: "security",
      type: "navigation",
      label: "Security",
      icon: Lock,
      href: "/app/settings/security",
      keywords: ["password", "2fa"],
    },
    {
      id: "integrations",
      type: "navigation",
      label: "Integrations",
      icon: Link2,
      href: "/app/settings/integrations",
      keywords: ["connect", "apps"],
    },
    {
      id: "diagnostics",
      type: "navigation",
      label: "Diagnostics",
      icon: Wrench,
      href: "/app/settings/diagnostics",
      keywords: ["debug", "tools"],
    },
  ],
}

// Theme commands
export const themeCommands: CommandGroup = {
  id: "theme",
  heading: "Theme",
  items: [
    {
      id: "light-mode",
      type: "action",
      label: "Light Mode",
      icon: Sun,
      action: "theme-light",
      keywords: ["bright", "day"],
    },
    {
      id: "dark-mode",
      type: "action",
      label: "Dark Mode",
      icon: Moon,
      action: "theme-dark",
      keywords: ["night"],
    },
    {
      id: "system-theme",
      type: "action",
      label: "System Theme",
      icon: Laptop,
      action: "theme-system",
      keywords: ["auto", "default"],
    },
  ],
}

// Help & Account commands
export const helpCommands: CommandGroup = {
  id: "help",
  heading: "Help & Account",
  items: [
    {
      id: "help",
      type: "navigation",
      label: "Help Center",
      icon: HelpCircle,
      href: "/app/help",
      shortcut: "⌘?",
      keywords: ["support", "docs"],
    },
    {
      id: "logout",
      type: "action",
      label: "Log out",
      icon: LogOut,
      action: "logout",
      keywords: ["sign out", "exit"],
    },
  ],
}

// All command groups in order
export const allCommandGroups: CommandGroup[] = [
  navigationCommands,
  workflowCommands,
  collaborationCommands,
  organizationCommands,
  settingsCommands,
  themeCommands,
  helpCommands,
]

// Get all commands as flat array (for search)
export function getAllCommands(): CommandItem[] {
  return allCommandGroups.flatMap((group) => group.items)
}
