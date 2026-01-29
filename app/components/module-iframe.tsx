"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/app/components/error-boundary";
import type { Module } from "@/app/lib/module-registry";

interface ModuleIframeProps {
  module: Module;
  lazy?: boolean;
}

export function ModuleIframe({ module, lazy = true }: ModuleIframeProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = React.useState(!lazy);
  const [retryKey, setRetryKey] = React.useState(0);
  const retryCountRef = React.useRef(0);
  const maxRetries = 3;

  if (!module.url) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Module URL not configured for {module.name}
          </p>
        </div>
      </div>
    );
  }

  const handleLoad = () => {
    setLoading(false);
    setError(null);
    retryCountRef.current = 0;
  };

  const handleError = () => {
    setLoading(false);
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      setTimeout(() => {
        setLoading(true);
        setError(null);
        setRetryKey((k) => k + 1); // Force iframe reload by updating key
      }, 1000 * retryCountRef.current);
    } else {
      setError("Failed to load module after multiple attempts");
    }
  };

  const handleRetry = () => {
    retryCountRef.current = 0;
    setError(null);
    setLoading(true);
    setShouldLoad(true);
    setRetryKey((k) => k + 1);
  };

  // Lazy loading: only load when shouldLoad is true
  if (lazy && !shouldLoad) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button onClick={() => setShouldLoad(true)} variant="outline">
          Load {module.name}
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative h-full w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="layout-stack w-full max-w-md space-y-3">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center space-y-4 max-w-md">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <p className="text-destructive font-medium">Failed to load module</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        )}
        {shouldLoad && (
          <iframe
            key={`${module.id}-${retryKey}`}
            src={module.url}
            className="h-full w-full border-0"
            onLoad={handleLoad}
            onError={handleError}
            title={module.name}
            allow="camera; microphone; fullscreen; autoplay; encrypted-media"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
