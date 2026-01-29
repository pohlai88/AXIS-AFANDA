'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pen, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CollaborativeNotesCardProps {
  boardId?: string;
  collaborators?: number;
  readOnly?: boolean;
}

export function CollaborativeNotesCard({
  boardId,
  collaborators = 0,
  readOnly = false,
}: CollaborativeNotesCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Pen className="h-4 w-4" />
          Live Notes
          {collaborators > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              <Users className="h-3 w-3 mr-1" />
              {collaborators} editing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Placeholder for tldraw integration */}
        <div className="flex-1 rounded-lg border-2 border-dashed border-muted bg-muted/20 flex flex-col items-center justify-center p-8 text-center">
          <Pen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Collaborative Whiteboard</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Real-time collaborative notes and drawings will appear here.
            Integration with tldraw coming soon.
          </p>
          {boardId && (
            <Badge variant="outline" className="mt-4">
              Board ID: {boardId}
            </Badge>
          )}
        </div>

        {readOnly && (
          <Alert className="mt-4">
            <AlertDescription className="text-xs">
              View-only mode. You can view but not edit notes from completed meetings.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
