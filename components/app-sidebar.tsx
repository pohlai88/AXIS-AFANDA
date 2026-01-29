"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher, type TeamSwitcherTeam } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Type definitions for sidebar data
export interface SidebarUser {
  name: string
  email: string
  avatar: string
}

export interface SidebarTeam {
  id: string
  name: string
  logo: React.ElementType
  plan: string
}

export interface SidebarNavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface SidebarProject {
  name: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export interface SidebarSecondaryItem {
  title: string
  url: string
  icon: React.ElementType
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SidebarUser
  teams: SidebarTeam[]
  activeTeamId?: string
  onTeamChange?: (team: TeamSwitcherTeam) => void
  navMain: SidebarNavItem[]
  projects?: SidebarProject[]
  navSecondary?: SidebarSecondaryItem[]
}

export function AppSidebar({
  user,
  teams,
  activeTeamId,
  onTeamChange,
  navMain,
  projects,
  navSecondary,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={teams}
          activeTeamId={activeTeamId}
          onTeamChange={onTeamChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {projects && projects.length > 0 && (
          <NavProjects projects={projects} />
        )}
        {navSecondary && navSecondary.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
