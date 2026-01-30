import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
  showDetails?: boolean;
}

/**
 * Error fallback UI with recovery options
 * Usage: Used automatically by ErrorBoundary or can be used standalone
 */
export function ErrorFallback({ error, onReset, showDetails = false }: ErrorFallbackProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/app');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-full min-h-96 items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription className="mt-2">
                We encountered an unexpected error. Don't worry, your data is safe.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Details (Development/Debug) */}
          {showDetails && error && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Error Details</span>
              </div>
              <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="text-xs text-muted-foreground overflow-auto max-h-48 mt-2">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {onReset && (
              <Button onClick={onReset} className="btn-gold-lux">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={handleReload}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
            <Button variant="ghost" onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact support with the error details above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Compact error fallback for smaller spaces
 */
export function CompactErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
      <h4 className="text-sm font-medium text-foreground mb-1">Something went wrong</h4>
      <p className="text-xs text-muted-foreground mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {onReset && (
        <Button size="sm" variant="outline" onClick={onReset}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Try Again
        </Button>
      )}
    </div>
  );
}
