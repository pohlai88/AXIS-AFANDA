"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTenant } from "@/app/providers/tenant-provider";
import { useTheme } from "@/app/providers/theme-provider";
import {
  allCommandGroups,
  type CommandItem as CommandItemData,
  type CommandGroup as CommandGroupData,
} from "@/app/config/command-data";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { tenant } = useTenant();
  const { setTheme } = useTheme();

  // Execute command and close palette
  const runCommand = React.useCallback(
    (callback: () => void) => {
      onOpenChange(false);
      callback();
    },
    [onOpenChange]
  );

  // Handle action commands
  const handleAction = React.useCallback(
    (action: string) => {
      switch (action) {
        case "toggle-magic-todo":
          window.dispatchEvent(new CustomEvent("toggle-magic-todo"));
          break;
        case "theme-light":
          setTheme("light");
          document.documentElement.classList.remove("dark");
          break;
        case "theme-dark":
          setTheme("dark");
          document.documentElement.classList.add("dark");
          break;
        case "theme-system":
          setTheme("system");
          document.documentElement.classList.remove("dark");
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
          }
          break;
        case "logout":
          router.push("/api/auth/logout");
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    },
    [router, setTheme]
  );

  // Handle item selection
  const handleSelect = React.useCallback(
    (item: CommandItemData) => {
      if (item.type === "navigation") {
        runCommand(() => router.push(item.href));
      } else if (item.type === "action") {
        runCommand(() => handleAction(item.action));
      }
    },
    [router, runCommand, handleAction]
  );

  // Render a single command item
  const renderCommandItem = (item: CommandItemData) => {
    const Icon = item.icon;
    return (
      <CommandItem
        key={item.id}
        value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
        onSelect={() => handleSelect(item)}
        disabled={item.disabled}
      >
        <Icon />
        <span>{item.label}</span>
        {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
      </CommandItem>
    );
  };

  // Render a command group
  const renderCommandGroup = (group: CommandGroupData, index: number) => (
    <React.Fragment key={group.id}>
      {index > 0 && <CommandSeparator />}
      <CommandGroup heading={group.heading}>
        {group.items.map(renderCommandItem)}
      </CommandGroup>
    </React.Fragment>
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Render all command groups from configuration */}
        {allCommandGroups.map((group, index) => renderCommandGroup(group, index))}

        {/* Current workspace context */}
        {tenant && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Context">
              <CommandItem disabled value="workspace">
                <Building2 />
                <span>Workspace: {tenant.name}</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
