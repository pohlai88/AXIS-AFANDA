'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare,
  Send,
  MoreVertical,
  Trash2,
  Edit,
  Reply,
  Pin,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  whiteboardId: string;
  userId: string;
  userName: string;
  userInitials: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
  parentId?: string; // For replies
  mentions?: string[]; // @mentions
  position?: { x: number; y: number }; // Canvas position for contextual comments
}

interface CommentsSidebarProps {
  whiteboardId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onEditComment: (id: string, content: string) => void;
  onDeleteComment: (id: string) => void;
  onPinComment: (id: string) => void;
  currentUserId: string;
}

export function CommentsSidebar({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onPinComment,
  currentUserId,
}: Omit<CommentsSidebarProps, 'whiteboardId'>) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Organize comments: pinned first, then by date
  const pinnedComments = comments.filter((c) => c.isPinned && !c.parentId);
  const regularComments = comments.filter((c) => !c.isPinned && !c.parentId);
  const sortedComments = [...pinnedComments, ...regularComments];

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
    toast.success('Comment added');
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return;
    onEditComment(editingId, editContent);
    setEditingId(null);
    setEditContent('');
    toast.success('Comment updated');
  };

  const handleDelete = (id: string) => {
    onDeleteComment(id);
    toast.success('Comment deleted');
  };

  const handlePin = (id: string) => {
    onPinComment(id);
    toast.success('Comment pinned');
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = getReplies(comment.id);
    const isEditing = editingId === comment.id;
    const isOwnComment = comment.userId === currentUserId;

    return (
      <div key={comment.id} className={isReply ? 'ml-8 mt-2' : ''}>
        <div className="group relative rounded-lg border bg-card p-3 hover:bg-muted/50">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{comment.userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{comment.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {comment.isPinned && (
                <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-xs">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {isOwnComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(comment)}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePin(comment.id)}>
                      <Pin className="mr-2 h-3 w-3" />
                      {comment.isPinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(comment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>

              {/* Reply Button */}
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              )}
            </>
          )}
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        )}

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <div className="ml-8 mt-2 space-y-2 rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Replying to {comment.userName}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => setReplyingTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[60px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmit}>
                <Send className="mr-1 h-3 w-3" />
                Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col border-l bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">Comments</h3>
          <Badge variant="secondary" className="ml-auto">
            {comments.length}
          </Badge>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        {sortedComments.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No comments yet</p>
              <p className="text-xs text-muted-foreground">
                Be the first to comment
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComments.map((comment) => renderComment(comment))}
          </div>
        )}
      </ScrollArea>

      {/* New Comment Input */}
      {!replyingTo && (
        <div className="border-t p-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2 min-h-[80px]"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <kbd className="rounded border px-1">Ctrl</kbd> +{' '}
              <kbd className="rounded border px-1">Enter</kbd> to send
            </p>
            <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="mr-1 h-3 w-3" />
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
