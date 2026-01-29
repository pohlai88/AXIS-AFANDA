'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Plus, Loader2 } from 'lucide-react';

interface AISuggestion {
  id: string;
  text: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface AISuggestionsPanelProps {
  meetingId: string;
  onAddTask?: (suggestion: AISuggestion) => void;
}

export function AISuggestionsPanel({ meetingId, onAddTask }: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate AI detection (replace with actual API)
    const timer = setTimeout(() => {
      setSuggestions([
        {
          id: '1',
          text: 'Submit budget approval request',
          assignee: 'Sarah Chen',
          priority: 'high',
        },
        {
          id: '2',
          text: 'Post job listings for 2 developers',
          assignee: 'Mike Johnson',
          priority: 'medium',
        },
        {
          id: '3',
          text: 'Update product roadmap',
          priority: 'medium',
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [meetingId]);

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddTask = (suggestion: AISuggestion) => {
    onAddTask?.(suggestion);
    console.log('Adding task from suggestion:', suggestion);
  };

  if (loading) {
    return (
      <Card className="bg-lux-gold-soft border-lux-gold">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-lux-gold animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">
            AI analyzing meeting notes...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-lux-gold-soft border-lux-gold">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lux-gold" />
          AI Detected Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-2 p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`suggestion-${suggestion.id}`}
              checked={selectedSuggestions.has(suggestion.id)}
              onCheckedChange={() => toggleSuggestion(suggestion.id)}
              className="mt-0.5"
            />
            <Label
              htmlFor={`suggestion-${suggestion.id}`}
              className="flex-1 text-sm cursor-pointer"
            >
              {suggestion.text}
              {suggestion.assignee && (
                <span className="text-xs text-muted-foreground block mt-1">
                  → {suggestion.assignee}
                </span>
              )}
            </Label>
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0 h-7 w-7 p-0"
              onClick={() => handleAddTask(suggestion)}
              title="Add as task"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
