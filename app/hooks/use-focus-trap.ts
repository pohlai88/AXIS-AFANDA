import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container (for modals, dialogs)
 * Usage: const ref = useFocusTrap<HTMLDivElement>(isOpen);
 */
export function useFocusTrap<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const container = ref.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: focus last element if first is focused
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: focus first element if last is focused
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return ref;
}

/**
 * Hook to restore focus when component unmounts
 * Usage: useFocusReturn(isOpen);
 */
export function useFocusReturn(enabled = true) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (enabled) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    return () => {
      if (enabled && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled]);
}
