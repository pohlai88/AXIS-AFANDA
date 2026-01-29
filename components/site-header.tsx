"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
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
  Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useCommandPalette } from "@/app/hooks/use-command-palette";

// Route to title/icon mapping
const routeConfig: Record<
  string,
  { title: string; icon: React.ElementType; parent?: string }
> = {
  "/app": { title: "Dashboard", icon: LayoutDashboard },
  "/app/inbox": { title: "Inbox", icon: Mail },
  "/app/omnichannel": { title: "Omnichannel", icon: Users2 },
  "/app/approvals": { title: "Approvals", icon: CheckSquare },
  "/app/approvals/new": {
    title: "New Approval",
    icon: CheckSquare,
    parent: "/app/approvals",
  },
  "/app/activity": { title: "Activity", icon: Activity },
  "/app/consultations": { title: "Consultations", icon: Video },
  "/app/whiteboards": { title: "Whiteboards", icon: Pencil },
  "/app/settings": { title: "Settings", icon: Settings },
  "/app/help": { title: "Help", icon: HelpCircle },
};

function getRouteInfo(pathname: string) {
  // Exact match first
  if (routeConfig[pathname]) {
    return routeConfig[pathname];
  }

  // Check for dynamic routes (e.g., /app/approvals/123)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 3) {
    const baseRoute = `/${segments.slice(0, 2).join("/")}`;
    if (routeConfig[baseRoute]) {
      return {
        ...routeConfig[baseRoute],
        title: routeConfig[baseRoute].title,
        isDetail: true,
        parent: baseRoute,
      };
    }
  }

  // Fallback for nested settings routes
  if (pathname.startsWith("/app/settings/")) {
    const settingName = pathname.split("/").pop();
    return {
      title: settingName
        ? settingName.charAt(0).toUpperCase() + settingName.slice(1)
        : "Settings",
      icon: Settings,
      parent: "/app/settings",
    };
  }

  return { title: "Dashboard", icon: LayoutDashboard };
}

export function SiteHeader() {
  const pathname = usePathname();
  const routeInfo = getRouteInfo(pathname);
  const Icon = routeInfo.icon;
  const { setOpen } = useCommandPalette();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Breadcrumb navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {routeInfo.parent && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={routeInfo.parent}>
                    {routeConfig[routeInfo.parent]?.title ?? "Back"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <Icon className="size-4" />
                <span>{routeInfo.title}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Command palette trigger - search button */}
        <Button
          variant="outline"
          className="ml-auto h-8 w-full max-w-sm justify-start gap-2 text-muted-foreground md:w-64 lg:w-80"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4" />
          <span className="hidden sm:inline-flex">Search or type a command...</span>
          <span className="inline-flex sm:hidden">Search...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </header>
  );
}
