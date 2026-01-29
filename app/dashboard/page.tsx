"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTenant } from "@/app/providers/tenant-provider"
import {
  defaultUser,
  getSidebarNavMain,
  getSidebarProjects,
  getSidebarSecondary,
  buildTeamsFromTenants,
} from "@/app/config/sidebar-data"

// Hydration-safe mounting check
function useIsMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
}

// Sidebar skeleton for SSR
function SidebarSkeleton() {
  return (
    <div className="bg-sidebar text-sidebar-foreground hidden md:flex h-svh w-64 flex-col border-r">
      <div className="flex flex-col gap-2 p-2">
        <div className="h-12 bg-sidebar-accent/50 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 p-2 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-sidebar-accent/30 rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const { tenant, tenants, setTenant } = useTenant()
  const pathname = usePathname()
  const mounted = useIsMounted()

  const teams = buildTeamsFromTenants(tenants)
  const navMain = getSidebarNavMain(pathname)
  const projects = getSidebarProjects(pathname)
  const navSecondary = getSidebarSecondary(pathname)

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
    <SidebarProvider>
      {mounted ? (
        <AppSidebar
          user={defaultUser}
          teams={teams}
          activeTeamId={tenant?.id}
          onTeamChange={handleTeamChange}
          navMain={navMain}
          projects={projects}
          navSecondary={navSecondary}
        />
      ) : (
        <SidebarSkeleton />
      )}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
