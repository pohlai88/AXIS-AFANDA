"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  MessageSquare,
  Video,
  Settings,
  HelpCircle,
  Users,
  Shield,
  Search,
  Activity,
} from "lucide-react";
import { getEnabledModules } from "@/app/lib/module-registry";
import { useTenant } from "@/app/providers/tenant-provider";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Inbox", url: "/app/inbox", icon: Inbox },
  { title: "Approvals", url: "/app/approvals", icon: CheckSquare },
  { title: "Activity", url: "/app/activity", icon: Activity },
  { title: "Omnichannel", url: "/app/omnichannel", icon: MessageSquare },
  { title: "Consultations", url: "/app/consultations", icon: Video },
];

const settingsItems = [
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Teams", url: "/app/settings/teams", icon: Users },
  { title: "Modules", url: "/app/settings/modules", icon: Shield },
  { title: "Help", url: "/app/help", icon: HelpCircle },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { tenant } = useTenant();
  const [search, setSearch] = React.useState("");

  const modules = getEnabledModules();

  const handleSelect = (url: string) => {
    router.push(url);
    onOpenChange(false);
    setSearch("");
  };

  // Filter items based on search
  const filteredNavigation = navigationItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSettings = settingsItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(search.toLowerCase()) ||
      module.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  <CommandShortcut>⌘{item.title[0]}</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {filteredModules.length > 0 && (
          <CommandGroup heading="Modules">
            {filteredModules.map((module) => {
              const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                LayoutDashboard,
                Inbox,
                CheckSquare,
                MessageSquare,
                Video,
                Activity,
              };
              const Icon = iconMap[module.icon || ""] || Search;
              return (
                <CommandItem
                  key={module.id}
                  value={module.name}
                  onSelect={() => handleSelect(module.route)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{module.name}</span>
                  {module.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {module.description}
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {filteredSettings.length > 0 && (
          <CommandGroup heading="Settings">
            {filteredSettings.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {tenant && (
          <CommandGroup heading="Context">
            <CommandItem disabled>
              <Users className="h-4 w-4" />
              <span>Current Tenant: {tenant.name}</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
