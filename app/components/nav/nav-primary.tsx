"use client";

import * as React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavPrimaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | null;
  isActive?: boolean;
}

interface NavPrimaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: NavPrimaryItem[];
}

export function NavPrimary({ items, ...props }: NavPrimaryProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
