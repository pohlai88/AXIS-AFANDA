import {
  Mail,
  CheckSquare,
  Video,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Activity,
  Users2,
  Pencil,
  FileText,
  Users,
  Building2,
  User,
} from "lucide-react"
import type {
  SidebarUser,
  SidebarTeam,
  SidebarNavItem,
  SidebarProject,
  SidebarSecondaryItem,
} from "@/components/app-sidebar"

// Tenant type icons for workspace switcher
export const tenantTypeIcons = {
  individual: User,
  team: Users,
  org: Building2,
} as const

export const tenantTypeLabels = {
  individual: "Personal",
  team: "Team",
  org: "Organization",
} as const

// Default user (will be replaced with auth context)
export const defaultUser: SidebarUser = {
  name: "User",
  email: "user@example.com",
  avatar: "",
}

// Navigation configuration for AXIS-AFENDA
export function getSidebarNavMain(pathname: string): SidebarNavItem[] {
  return [
    {
      title: "Dashboard",
      url: "/app",
      icon: LayoutDashboard,
      isActive: pathname === "/app",
    },
    {
      title: "Inbox",
      url: "/app/inbox",
      icon: Mail,
      isActive: pathname.startsWith("/app/inbox"),
    },
    {
      title: "Omnichannel",
      url: "/app/omnichannel",
      icon: Users2,
      isActive: pathname.startsWith("/app/omnichannel"),
    },
    {
      title: "Approvals",
      url: "/app/approvals",
      icon: CheckSquare,
      isActive: pathname.startsWith("/app/approvals"),
      items: [
        { title: "All Approvals", url: "/app/approvals" },
        { title: "New Request", url: "/app/approvals/new" },
      ],
    },
    {
      title: "Activity",
      url: "/app/activity",
      icon: Activity,
      isActive: pathname.startsWith("/app/activity"),
    },
    {
      title: "Consultations",
      url: "/app/consultations",
      icon: Video,
      isActive: pathname.startsWith("/app/consultations"),
    },
    {
      title: "Whiteboards",
      url: "/app/whiteboards",
      icon: Pencil,
      isActive: pathname.startsWith("/app/whiteboards"),
    },
  ]
}

// Projects/Organization section
export function getSidebarProjects(pathname: string): SidebarProject[] {
  return [
    {
      name: "Teams",
      url: "/app/settings/teams",
      icon: Users,
      isActive: pathname === "/app/settings/teams" || pathname.startsWith("/app/teams"),
    },
    {
      name: "Templates",
      url: "/app/settings/templates",
      icon: FileText,
      isActive: pathname === "/app/settings/templates",
    },
  ]
}

// Secondary navigation (bottom)
export function getSidebarSecondary(pathname: string): SidebarSecondaryItem[] {
  return [
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/app/help",
      icon: HelpCircle,
    },
  ]
}

// Build teams from tenant context
export function buildTeamsFromTenants(
  tenants: Array<{ id: string; name: string; type: "individual" | "team" | "org" }>
): SidebarTeam[] {
  return tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    logo: tenantTypeIcons[tenant.type],
    plan: tenantTypeLabels[tenant.type],
  }))
}
