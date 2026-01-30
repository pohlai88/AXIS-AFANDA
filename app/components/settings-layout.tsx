"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Grid3x3,
  Plug,
  Shield,
  User,
  Users,
  MessageSquare,
  Video,
  Bell,
  Activity,
  CreditCard,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/app/components/ui/sidebar";

const settingsNav = [
  { name: "General", icon: Settings, href: "/app/settings" },
  { name: "Conversations", icon: MessageSquare, href: "/app/settings/conversations" },
  { name: "Collaboration", icon: Video, href: "/app/settings/collaboration" },
  { name: "Notifications", icon: Bell, href: "/app/settings/notifications" },
  { name: "Teams", icon: Users, href: "/app/settings/teams" },
  { name: "Modules", icon: Grid3x3, href: "/app/settings/modules" },
  { name: "Integrations", icon: Plug, href: "/app/settings/integrations" },
  { name: "Security", icon: Shield, href: "/app/settings/security" },
  { name: "Diagnostics", icon: Activity, href: "/app/settings/diagnostics" },
  { name: "Billing", icon: CreditCard, href: "/app/settings/account" },
  { name: "Profile", icon: User, href: "/app/settings/profile" },
];

export function SettingsLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider className="items-start">
      <Sidebar collapsible="none" className="hidden md:flex border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsNav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/app/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
