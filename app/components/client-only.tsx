/**
 * Client-only wrapper component
 * 
 * Prevents hydration mismatches by only rendering children after mount.
 * Use this for components with dynamic IDs or client-only features.
 */

"use client";

import * as React from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
