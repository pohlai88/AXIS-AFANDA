"use client";

import * as React from "react";
import { TenantProvider } from "@/app/providers/tenant-provider";
import { ShellSidebar } from "@/app/components/shell-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CommandPalette } from "@/app/components/command-palette";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { useCommandPalette } from "@/app/hooks/use-command-palette";

// Mock tenants for development (will be replaced with Keycloak later)
const mockTenants = [
  { id: "1", name: "Acme Corp", type: "org" as const },
  { id: "2", name: "Engineering Team", type: "team" as const },
  { id: "3", name: "John Doe", type: "individual" as const },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useCommandPalette();

  return (
    <TenantProvider tenants={mockTenants} initialTenant={mockTenants[0]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <ShellSidebar variant="inset" />
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
    </TenantProvider>
  );
}
