'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Plus,
  X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { getChannelConfig } from '@/app/lib/utils/channel-icons';

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface ModernComposeBoxProps {
  onSend: (content: string, isPrivate?: boolean) => Promise<void>;
  sending: boolean;
  channelType?: string | null;
  placeholder?: string;
  showPrivateToggle?: boolean;
  showChannelBadge?: boolean;
}

export function ModernComposeBox({
  onSend,
  sending,
  channelType,
  placeholder = 'Type a message...',
  showPrivateToggle = false,
  showChannelBadge = true,
}: ModernComposeBoxProps) {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get channel configuration
  const channelConfig = getChannelConfig(channelType);
  const ChannelIcon = channelConfig.icon;
  const characterLimit = channelConfig.features.characterLimit;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || sending) return;

    await onSend(content, isPrivate);
    setContent('');
    setIsPrivate(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + emoji + content.substring(end);

    setContent(newContent);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="border-t bg-background">
      {/* Channel/Private Indicator */}
      {(showChannelBadge && channelType) || isPrivate ? (
        <div className="flex items-center gap-2 border-b px-4 py-2">
          {showChannelBadge && channelType && (
            <Badge variant="outline" className={`gap-1.5 ${channelConfig.bgColor}`}>
              <ChannelIcon className={`h-3.5 w-3.5 ${channelConfig.color}`} />
              <span className="text-xs">{channelConfig.label}</span>
            </Badge>
          )}
          {isPrivate && (
            <Badge variant="secondary" className="gap-1.5">
              <span className="text-xs">Private Note</span>
              <button
                onClick={() => setIsPrivate(false)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {characterLimit && (
            <span className={`ml-auto text-xs ${content.length > characterLimit * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {content.length}/{characterLimit}
            </span>
          )}
        </div>
      ) : null}

      {/* Main Compose Area */}
      <div className="flex items-end gap-2 p-4">
        {/* Attachment Menu */}
        <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0 rounded-full hover:bg-muted"
              disabled={sending}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Implement file upload
                  setShowAttachMenu(false);
                }}
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Document
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Implement image upload
                  setShowAttachMenu(false);
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Image
              </Button>
              {showPrivateToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsPrivate(!isPrivate);
                    setShowAttachMenu(false);
                  }}
                >
                  <span className="mr-2">🔒</span>
                  Private Note
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isPrivate ? 'Write a private note...' : placeholder}
            className={`w-full resize-none rounded-2xl border bg-muted/50 px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:bg-background focus:ring-2 focus:ring-primary/20 ${isPrivate ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50' : ''
              }`}
            rows={1}
            disabled={sending}
            maxLength={characterLimit}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />

          {/* Emoji Picker Button */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1.5 right-1 h-7 w-7 rounded-full hover:bg-muted"
                disabled={sending}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-0 p-0" align="end">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={350}
                height={400}
                searchPlaceholder="Search emoji..."
                previewConfig={{ showPreview: false }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Send Button */}
        <Button
          onClick={() => handleSubmit()}
          disabled={!content.trim() || sending}
          size="icon"
          className="h-10 w-10 flex-shrink-0 rounded-full"
        >
          {sending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hint */}
      <div className="px-4 pb-2">
        <p className="text-[10px] text-muted-foreground">
          Press <kbd className="rounded border px-1 text-[10px]">Enter</kbd> to send,{' '}
          <kbd className="rounded border px-1 text-[10px]">Shift</kbd> +{' '}
          <kbd className="rounded border px-1 text-[10px]">Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
