"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ShellSidebar } from "@/app/components/shell-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CommandPalette } from "@/app/components/command-palette";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { CommandPaletteProvider, useCommandPalette } from "@/app/hooks/use-command-palette";
import { useActivityStream } from "@/app/hooks/use-activity-stream";
import { ChatwootWidget } from "@/app/components/chatwoot-widget";
import { useTenant } from "@/app/providers/tenant-provider";
import {
  defaultUser,
  getSidebarNavMain,
  getSidebarProjects,
  getSidebarSecondary,
  buildTeamsFromTenants,
} from "@/app/config/sidebar-data";

// Hydration-safe mounting check using useSyncExternalStore
function useIsMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
}

// Sidebar skeleton for SSR to prevent hydration mismatch
function SidebarSkeleton() {
  return (
    <div
      data-slot="sidebar"
      className="bg-sidebar text-sidebar-foreground hidden md:flex h-svh w-[calc(var(--spacing)*72)] flex-col border-r"
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="h-12 bg-sidebar-accent/50 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 p-2 space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 bg-sidebar-accent/30 rounded-md animate-pulse" />
        ))}
      </div>
      <div className="p-2">
        <div className="h-12 bg-sidebar-accent/50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// Inner layout component that uses command palette context
function AppLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useCommandPalette();
  const { tenant, tenants, setTenant } = useTenant();
  const pathname = usePathname();
  const mounted = useIsMounted();

  // Connect to SSE for real-time updates
  // TODO: Get actual tenant ID from auth context
  useActivityStream(tenant?.id ?? 'mock-tenant-id');

  // Build sidebar data from configuration
  const teams = React.useMemo(() => buildTeamsFromTenants(tenants), [tenants]);
  const navMain = React.useMemo(() => getSidebarNavMain(pathname), [pathname]);
  const projects = React.useMemo(() => getSidebarProjects(pathname), [pathname]);
  const navSecondary = React.useMemo(() => getSidebarSecondary(pathname), [pathname]);

  // Handle team change from sidebar
  const handleTeamChange = React.useCallback(
    (team: { id: string }) => {
      const selectedTenant = tenants.find((t) => t.id === team.id);
      if (selectedTenant) {
        setTenant(selectedTenant);
      }
    },
    [tenants, setTenant]
  );

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        {mounted ? (
          <ShellSidebar />
        ) : (
          <SidebarSkeleton />
        )}
        <SidebarInset>
          <SiteHeader />
          <ErrorBoundary>
            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </ErrorBoundary>
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette open={open} onOpenChange={setOpen} />
      <ChatwootWidget />
    </>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommandPaletteProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </CommandPaletteProvider>
  );
}
