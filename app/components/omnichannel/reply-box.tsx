'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip } from 'lucide-react';
import { getChannelConfig } from '@/app/lib/utils/channel-icons';

interface ReplyBoxProps {
  onSend: (content: string, isPrivate: boolean) => Promise<void>;
  sending: boolean;
  channelType?: string | null;
}

export function ReplyBox({ onSend, sending, channelType }: ReplyBoxProps) {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Get channel configuration
  const channelConfig = getChannelConfig(channelType);
  const ChannelIcon = channelConfig.icon;
  const characterLimit = channelConfig.features.characterLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    await onSend(content, isPrivate);
    setContent('');
    setIsPrivate(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Channel Indicator */}
      {channelType && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`gap-1.5 ${channelConfig.bgColor}`}>
            <ChannelIcon className={`h-3.5 w-3.5 ${channelConfig.color}`} />
            <span className="text-xs">Replying via {channelConfig.label}</span>
          </Badge>
          {characterLimit && (
            <span className="text-xs text-muted-foreground">
              {content.length}/{characterLimit}
            </span>
          )}
        </div>
      )}

      {/* Textarea */}
      <Textarea
        placeholder={isPrivate ? 'Write a private note...' : channelConfig.placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        className={
          isPrivate
            ? 'border-amber-200 bg-amber-50 focus-visible:ring-amber-500 dark:border-amber-900 dark:bg-amber-950'
            : ''
        }
        disabled={sending}
        maxLength={characterLimit}
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Private Note Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="private-note"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={sending}
            />
            <Label
              htmlFor="private-note"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Private note
            </Label>
          </div>

          {/* Attachment Button (placeholder) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={sending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button type="submit" disabled={!content.trim() || sending}>
          {sending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        Press <kbd className="rounded border px-1">Ctrl</kbd> +{' '}
        <kbd className="rounded border px-1">Enter</kbd> to send
      </p>
    </form>
  );
}
