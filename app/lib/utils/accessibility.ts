/**
 * Accessibility utility functions
 */

/**
 * Generate a unique ID for ARIA labels
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Format number for screen readers
 * Example: 1000 -> "1 thousand"
 */
export function formatNumberForScreenReader(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${Math.floor(num / 1000)} thousand`;
  return `${Math.floor(num / 1000000)} million`;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Skip link component helper
 */
export function createSkipLink(targetId: string, label = 'Skip to main content') {
  return {
    href: `#${targetId}`,
    label,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
  };
}

/**
 * ARIA label helpers
 */
export const ariaLabels = {
  loading: (context?: string) => `Loading${context ? ` ${context}` : ''}`,
  error: (context?: string) => `Error${context ? ` in ${context}` : ''}`,
  success: (context?: string) => `Success${context ? ` in ${context}` : ''}`,
  sortAscending: (column: string) => `Sort ${column} in ascending order`,
  sortDescending: (column: string) => `Sort ${column} in descending order`,
  removeFilter: (filter: string) => `Remove ${filter} filter`,
  closeDialog: () => 'Close dialog',
  openMenu: () => 'Open menu',
  pagination: (page: number, total: number) => `Page ${page} of ${total}`,
};
