"use client";

import * as React from "react";
import { ChevronDown, Plus, Building2, Users, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import { type Tenant } from "@/app/providers/tenant-provider";

// Icons for tenant types
const tenantTypeIcons = {
  individual: User,
  team: Users,
  org: Building2,
} as const;

const tenantTypeLabels = {
  individual: "Personal",
  team: "Team",
  org: "Organization",
} as const;

interface WorkspaceSwitcherProps {
  tenant: Tenant | null;
  tenants: Tenant[];
  onTenantChange: (tenant: Tenant) => void;
}

export function WorkspaceSwitcher({
  tenant,
  tenants,
  onTenantChange,
}: WorkspaceSwitcherProps) {
  const TenantIcon = tenant ? tenantTypeIcons[tenant.type] : Building2;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TenantIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {tenant?.name ?? "AXIS-AFENDA"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {tenant ? tenantTypeLabels[tenant.type] : "Personal"}
                </span>
              </div>
              <ChevronDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {tenants.map((t, index) => {
              const Icon = tenantTypeIcons[t.type];
              return (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => onTenantChange(t)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon className="size-4 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{t.name}</span>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <span className="font-medium text-muted-foreground">
                Create workspace
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
