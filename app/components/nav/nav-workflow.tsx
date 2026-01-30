"use client";

import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";

export interface NavWorkflowItem {
  title: string;
  url: string | null;
  icon: LucideIcon;
  badge?: string | null;
  isActive?: boolean;
  action?: string;
}

interface NavWorkflowProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  label: string;
  items: NavWorkflowItem[];
  onAction?: (action: string) => void;
}

export function NavWorkflow({ label, items, onAction, ...props }: NavWorkflowProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.action ? (
                // Action item (button)
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={item.isActive}
                  onClick={() => onAction?.(item.action!)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                // Navigation item (link)
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                  <Link href={item.url!}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
