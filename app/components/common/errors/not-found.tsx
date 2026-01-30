import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotFoundProps {
  title?: string;
  description?: string;
  showBack?: boolean;
}

/**
 * 404 Not Found component
 * Usage: <NotFound title="Page not found" description="..." />
 */
export function NotFound({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or has been moved.",
  showBack = true,
}: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-screen-60 items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>

        <p className="text-sm text-muted-foreground mb-8">{description}</p>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => router.push('/app')} className="btn-gold-lux">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          {showBack && (
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
