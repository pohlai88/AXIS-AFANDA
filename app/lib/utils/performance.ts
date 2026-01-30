/**
 * Performance utility functions
 */

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  if (typeof window === 'undefined') return;

  const start = performance.now();

  return () => {
    const end = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  };
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(callback: () => void, options?: IdleRequestOptions) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Lazy load component code
 */
export function lazyLoadWithRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): Promise<{ default: T }> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries > 0) {
          console.warn(`Retrying lazy load... (${retries} attempts left)`);
          setTimeout(() => {
            lazyLoadWithRetry(importFn, retries - 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        } else {
          reject(error);
        }
      });
  });
}

/**
 * Preload component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  importFn().catch(() => {
    // Silently fail preload
  });
}

/**
 * Check if on slow connection
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  return (
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    connection?.saveData === true
  );
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  return {
    // Time to first byte
    ttfb: navigation?.responseStart - navigation?.requestStart,
    // DOM content loaded
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    // Page load
    loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
    // First paint
    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
    // First contentful paint
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
  };
}
