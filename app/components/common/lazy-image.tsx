'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/app/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Lazy-loaded image component
 * Only loads when visible in viewport
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const shouldLoad = priority || isIntersecting;

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ width, height }}
    >
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-[var(--ax-motion-base)]',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      )}
      {!isLoaded && shouldLoad && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
}
