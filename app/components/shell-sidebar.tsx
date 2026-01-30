"use client";

import * as React from "react";
import Link from "next/link";
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
  Sparkles,
  FileText,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/app/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useTenant } from "@/app/providers/tenant-provider";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { NotificationCenter } from "@/app/components/notification-center";
import { useCommandPalette } from "@/app/hooks/use-command-palette";

// Import proper nav components
import {
  NavPrimary,
  NavWorkflow,
  NavActions,
  WorkspaceSwitcher,
  type NavPrimaryItem,
  type NavWorkflowItem,
} from "@/app/components/nav";

export function ShellSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { tenant, setTenant, tenants } = useTenant();
  const pathname = usePathname();
  const { setOpen: setCommandPaletteOpen } = useCommandPalette();

  // Handle sidebar actions (MagicTodo, etc.)
  const handleAction = React.useCallback((action: string) => {
    if (action === "magic-todo") {
      window.dispatchEvent(new CustomEvent("toggle-magic-todo"));
    }
  }, []);

  // Build navigation items with active state based on current path
  const navPrimaryItems: NavPrimaryItem[] = React.useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/app",
        icon: LayoutDashboard,
        isActive: pathname === "/app",
      },
      {
        title: "Inbox",
        url: "/app/inbox",
        icon: Mail,
        badge: "3",
        isActive: pathname.startsWith("/app/inbox"),
      },
      {
        title: "Omnichannel",
        url: "/app/omnichannel",
        icon: Users2,
        badge: "12",
        isActive: pathname.startsWith("/app/omnichannel"),
      },
    ],
    [pathname]
  );

  const navWorkflowItems: NavWorkflowItem[] = React.useMemo(
    () => [
      {
        title: "Approvals",
        url: "/app/approvals",
        icon: CheckSquare,
        badge: "5",
        isActive: pathname.startsWith("/app/approvals"),
      },
      {
        title: "Activity",
        url: "/app/activity",
        icon: Activity,
        isActive: pathname.startsWith("/app/activity"),
      },
      {
        title: "Tasks",
        url: "/app/tasks",
        icon: Sparkles,
        badge: "7",
        isActive: pathname.startsWith("/app/tasks"),
      },
    ],
    [pathname]
  );

  const navCollaborationItems: NavWorkflowItem[] = React.useMemo(
    () => [
      {
        title: "Consultations",
        url: "/app/consultations",
        icon: Video,
        isActive: pathname.startsWith("/app/consultations"),
      },
      {
        title: "Whiteboards",
        url: "/app/whiteboards",
        icon: Pencil,
        isActive: pathname.startsWith("/app/whiteboards"),
      },
    ],
    [pathname]
  );

  const navOrganizationItems: NavWorkflowItem[] = React.useMemo(
    () => [
      {
        title: "Teams",
        url: "/app/settings/teams",
        icon: Users,
        isActive: pathname === "/app/settings/teams" || pathname.startsWith("/app/teams"),
      },
      {
        title: "Templates",
        url: "/app/settings/templates",
        icon: FileText,
        isActive: pathname === "/app/settings/templates",
      },
    ],
    [pathname]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          tenant={tenant}
          tenants={tenants}
          onTenantChange={setTenant}
        />
      </SidebarHeader>

      <SidebarContent>
        {/* Quick actions - Search */}
        <NavActions onSearch={() => setCommandPaletteOpen(true)} />

        <SidebarSeparator />

        {/* Primary navigation */}
        <NavPrimary items={navPrimaryItems} />

        <SidebarSeparator />

        {/* Workflow section */}
        <NavWorkflow
          label="Workflow"
          items={navWorkflowItems}
          onAction={handleAction}
        />

        {/* Collaboration section */}
        <NavWorkflow
          label="Collaboration"
          items={navCollaborationItems}
        />

        {/* Organization section */}
        <NavWorkflow
          label="Organization"
          items={navOrganizationItems}
        />

        {/* Secondary navigation - pushed to bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  isActive={pathname.startsWith("/app/settings") &&
                    !pathname.startsWith("/app/settings/teams") &&
                    !pathname.startsWith("/app/settings/templates")}
                >
                  <Link href="/app/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Help"
                  isActive={pathname.startsWith("/app/help")}
                >
                  <Link href="/app/help">
                    <HelpCircle />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
              <NotificationCenter />
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser
          user={{
            name: "User",
            email: "user@example.com",
            avatar: "",
          }}
        />
      </SidebarFooter>

      {/* Rail for resize handle - shadcn best practice */}
      <SidebarRail />
    </Sidebar>
  );
}
