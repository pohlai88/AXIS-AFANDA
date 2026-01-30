import { useState, useEffect, useRef, useMemo } from 'react';

interface UseVirtualScrollProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
  }>;
  totalHeight: number;
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollToIndex: (index: number) => void;
}

/**
 * Hook for virtual scrolling (render only visible items)
 * Usage:
 * const { virtualItems, totalHeight, scrollRef } = useVirtualScroll({
 *   itemCount: 10000,
 *   itemHeight: 50,
 *   containerHeight: 600,
 * });
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualScrollProps): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Total height of all items
  const totalHeight = itemCount * itemHeight;

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        size: itemHeight,
      });
    }
    return items;
  }, [visibleRange, itemHeight]);

  // Handle scroll
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to index
  const scrollToIndex = (index: number) => {
    const element = scrollRef.current;
    if (!element) return;

    const targetScroll = index * itemHeight;
    element.scrollTop = targetScroll;
  };

  return {
    virtualItems,
    totalHeight,
    scrollRef,
    scrollToIndex,
  };
}
