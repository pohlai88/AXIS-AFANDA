"use client";

import * as React from "react";
import { ShellSidebar } from "@/app/components/shell-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CommandPalette } from "@/app/components/command-palette";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { useCommandPalette } from "@/app/hooks/use-command-palette";
import { useActivityStream } from "@/app/hooks/use-activity-stream";
import { ChatwootWidget } from "@/app/components/chatwoot-widget";
import { MagicTodoTrigger } from "@/app/components/magic-todo/magic-todo-trigger";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useCommandPalette();

  // Connect to SSE for real-time updates
  // TODO: Get actual tenant ID from auth context
  useActivityStream('mock-tenant-id');

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
      <ChatwootWidget />
      <MagicTodoTrigger />
    </>
  );
}
