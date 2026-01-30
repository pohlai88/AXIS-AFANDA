import { useEffect, useCallback } from 'react';

export type ShortcutKey = string;
export type ShortcutHandler = (event: KeyboardEvent) => void;

interface KeyboardShortcut {
  key: ShortcutKey;
  handler: ShortcutHandler;
  description?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

/**
 * Hook for registering keyboard shortcuts
 * Usage:
 * useKeyboardShortcuts([
 *   { key: 'k', meta: true, handler: () => openCommandPalette() },
 *   { key: '/', meta: true, handler: () => focusSearch() },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          handler,
          ctrl = false,
          meta = false,
          shift = false,
          alt = false,
        } = shortcut;

        // Check if all modifiers match
        const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = meta ? event.metaKey : !event.metaKey;
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
        const altMatch = alt ? event.altKey : !event.altKey;

        // Check if key matches (case-insensitive)
        const keyMatch = event.key.toLowerCase() === key.toLowerCase();

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          handler(event);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Single keyboard shortcut hook
 * Usage: useKeyboardShortcut('k', () => openPalette(), { meta: true });
 */
export function useKeyboardShortcut(
  key: string,
  handler: ShortcutHandler,
  options: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...modifiers } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        ctrl = false,
        meta = false,
        shift = false,
        alt = false,
      } = modifiers;

      const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
      const metaMatch = meta ? event.metaKey : !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, handler, enabled, modifiers]);
}

/**
 * Escape key handler
 * Usage: useEscapeKey(() => closeModal());
 */
export function useEscapeKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler, enabled]);
}

/**
 * Get platform-specific modifier key name
 */
export function getModifierKey(): 'Cmd' | 'Ctrl' {
  return typeof navigator !== 'undefined' &&
    navigator.platform.toLowerCase().includes('mac')
    ? 'Cmd'
    : 'Ctrl';
}

/**
 * Format shortcut for display
 * Usage: formatShortcut('k', { meta: true }) => "Cmd+K" or "Ctrl+K"
 */
export function formatShortcut(
  key: string,
  options: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
  } = {}
): string {
  const { ctrl, meta, shift, alt } = options;
  const parts: string[] = [];

  if (meta) parts.push(getModifierKey());
  if (ctrl) parts.push('Ctrl');
  if (shift) parts.push('Shift');
  if (alt) parts.push('Alt');
  parts.push(key.toUpperCase());

  return parts.join('+');
}
