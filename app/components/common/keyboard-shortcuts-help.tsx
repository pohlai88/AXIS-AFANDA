'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';
import { useKeyboardShortcut, getModifierKey } from '@/app/hooks/use-keyboard-shortcuts';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: [getModifierKey(), 'K'], description: 'Open command palette', category: 'Navigation' },
  { keys: ['Escape'], description: 'Close dialogs/modals', category: 'Navigation' },
  { keys: [getModifierKey(), '1-7'], description: 'Navigate to page', category: 'Navigation' },

  // Actions
  { keys: [getModifierKey(), 'N'], description: 'Create new item', category: 'Actions' },
  { keys: [getModifierKey(), 'S'], description: 'Save changes', category: 'Actions' },
  { keys: [getModifierKey(), 'F'], description: 'Focus search', category: 'Actions' },

  // Selection
  { keys: ['↑↓'], description: 'Navigate items', category: 'Selection' },
  { keys: ['Enter'], description: 'Open/Select item', category: 'Selection' },
  { keys: [getModifierKey(), 'A'], description: 'Select all', category: 'Selection' },

  // Other
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Other' },
  { keys: [getModifierKey(), 'Z'], description: 'Undo', category: 'Other' },
  { keys: [getModifierKey(), 'Shift', 'Z'], description: 'Redo', category: 'Other' },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  // Press "?" to open help
  useKeyboardShortcut('?', () => setOpen(true), { shift: true });

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-screen-80 overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Quick reference for keyboard shortcuts
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <Badge
                            key={keyIdx}
                            variant="outline"
                            className="font-mono text-xs px-2 py-0.5"
                          >
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Press <Badge variant="outline" className="font-mono">?</Badge> to show this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
