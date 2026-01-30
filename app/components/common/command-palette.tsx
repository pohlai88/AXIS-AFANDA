'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Calendar,
  CheckSquare,
  FileText,
  MessageSquare,
  Pencil,
  Users,
  Home,
  Settings,
  Search,
} from 'lucide-react';
import { useKeyboardShortcut } from '@/app/hooks/use-keyboard-shortcuts';
import { CompactEmptyState } from '@/app/components/common/empty-states';

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Command Palette (Cmd+K / Ctrl+K)
 * Quick navigation and actions
 */
export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Cmd/Ctrl+K to open
  useKeyboardShortcut('k', () => setOpen(true), { meta: true });

  // Escape key already handled by CommandDialog

  const navigationItems: CommandItem[] = useMemo(
    () => [
      {
        id: 'home',
        label: 'Home',
        icon: Home,
        onSelect: () => {
          router.push('/app');
          setOpen(false);
        },
        keywords: ['dashboard', 'home', 'start'],
      },
      {
        id: 'consultations',
        label: 'Consultations',
        icon: Calendar,
        onSelect: () => {
          router.push('/app/consultations');
          setOpen(false);
        },
        keywords: ['meetings', 'consultations', 'video', 'schedule'],
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: CheckSquare,
        onSelect: () => {
          router.push('/app/tasks');
          setOpen(false);
        },
        keywords: ['tasks', 'todos', 'checklist'],
      },
      {
        id: 'approvals',
        label: 'Approvals',
        icon: FileText,
        onSelect: () => {
          router.push('/app/approvals');
          setOpen(false);
        },
        keywords: ['approvals', 'pending', 'review'],
      },
      {
        id: 'inbox',
        label: 'Inbox',
        icon: MessageSquare,
        onSelect: () => {
          router.push('/app/inbox');
          setOpen(false);
        },
        keywords: ['inbox', 'messages', 'conversations', 'chat'],
      },
      {
        id: 'whiteboards',
        label: 'Whiteboards',
        icon: Pencil,
        onSelect: () => {
          router.push('/app/whiteboards');
          setOpen(false);
        },
        keywords: ['whiteboards', 'canvas', 'draw', 'diagram'],
      },
      {
        id: 'teams',
        label: 'Teams',
        icon: Users,
        onSelect: () => {
          router.push('/app/settings/teams');
          setOpen(false);
        },
        keywords: ['teams', 'members', 'organization'],
      },
    ],
    [router, setOpen]
  );

  const actionItems: CommandItem[] = useMemo(
    () => [
      {
        id: 'search',
        label: 'Search...',
        icon: Search,
        onSelect: () => {
          // TODO: Focus search input
          setOpen(false);
        },
        keywords: ['search', 'find'],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        onSelect: () => {
          router.push('/app/settings');
          setOpen(false);
        },
        keywords: ['settings', 'preferences', 'config'],
      },
    ],
    [router, setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-96">
        <CommandEmpty>
          <CompactEmptyState
            icon={Search}
            title="No results found"
            description="Try a different search term"
          />
        </CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={item.onSelect}
                keywords={item.keywords}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="Actions">
          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={item.onSelect}
                keywords={item.keywords}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Global command palette provider
 * Add this to your root layout
 */
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CommandPalette />
    </>
  );
}
