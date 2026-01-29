"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  CheckSquare,
  MessageSquare,
  Video,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Activity,
  Users2,
  Pencil,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useTenant } from "@/app/providers/tenant-provider";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { NotificationCenter } from "@/app/components/notification-center";

const navMain = [
  {
    title: "Dashboard",
    url: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Inbox",
    url: "/app/inbox",
    icon: Mail,
    description: "Internal team communication",
  },
  {
    title: "Omnichannel",
    url: "/app/omnichannel",
    icon: Users2,
    description: "Customer conversations across all channels",
  },
  {
    title: "Approvals",
    url: "/app/approvals",
    icon: CheckSquare,
  },
  {
    title: "Activity",
    url: "/app/activity",
    icon: Activity,
  },
  {
    title: "Consultations",
    url: "/app/consultations",
    icon: Video,
  },
  {
    title: "Whiteboards",
    url: "/app/whiteboards",
    icon: Pencil,
    description: "Collaborative infinite canvas",
  },
];

const navSecondary = [
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
];

export function ShellSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { tenant } = useTenant();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/app">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-semibold">
                    A
                  </div>
                  <span className="text-base font-semibold">AXIS-AFENDA</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="mt-auto">
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center gap-2 p-2 border-t">
          <NotificationCenter />
          <ThemeToggle />
        </div>
        <NavUser
          user={{
            name: "User",
            email: "user@example.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
