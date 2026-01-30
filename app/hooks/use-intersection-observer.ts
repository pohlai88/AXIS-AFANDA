import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Hook to observe element visibility (for lazy loading, animations)
 * Usage: const { ref, isIntersecting } = useIntersectionObserver();
 */
export function useIntersectionObserver<T extends Element = Element>({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): {
  ref: RefObject<T>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return { ref, isIntersecting, entry };
}

/**
 * Simple visibility hook
 * Usage: const ref = useOnScreen<HTMLDivElement>((isVisible) => { ... });
 */
export function useOnScreen<T extends Element = Element>(
  callback?: (isVisible: boolean) => void,
  options?: UseIntersectionObserverProps
) {
  const { ref, isIntersecting } = useIntersectionObserver<T>(options);

  useEffect(() => {
    if (callback) {
      callback(isIntersecting);
    }
  }, [isIntersecting, callback]);

  return { ref, isVisible: isIntersecting };
}
