'use client';

import { useParams, useRouter } from 'next/navigation';
import { TldrawBoard, type BackgroundType } from '@/app/components/whiteboards/tldraw-board';
import { CommentsSidebar, type Comment } from '@/app/components/whiteboards/comments-sidebar';
import { TagsManager, type WhiteboardTag } from '@/app/components/whiteboards/tags-manager';
import { MindmapToolbar } from '@/app/components/whiteboards/mindmap-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  MoreVertical,
  Share2,
  Download,
  Settings,
  Users,
  Save,
  Grid3x3,
  Minus,
  LayoutGrid,
  MessageSquare,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function WhiteboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const whiteboardId = params.id as string;

  // Initialize whiteboard name from mock data (avoids setState in effect)
  const [whiteboardName, setWhiteboardName] = useState(() => {
    const mockNames: Record<string, string> = {
      'wb-1': 'Product Roadmap Q1 2026',
      'wb-2': 'Customer Journey Map',
      'wb-3': 'Architecture Diagram',
    };
    return mockNames[whiteboardId] || 'Untitled Whiteboard';
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('default');
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMindmapTools, setShowMindmapTools] = useState(false);
  const [editor, setEditor] = useState<unknown>(null);

  // Tags state
  const [selectedTags, setSelectedTags] = useState<WhiteboardTag[]>([
    { id: 'tag-1', name: 'Design', color: 'bg-purple-500' },
  ]);
  const [availableTags, setAvailableTags] = useState<WhiteboardTag[]>([
    { id: 'tag-1', name: 'Design', color: 'bg-purple-500' },
    { id: 'tag-2', name: 'Planning', color: 'bg-blue-500' },
    { id: 'tag-3', name: 'Draft', color: 'bg-gray-500' },
  ]);

  // Comments state - use static timestamps for mock data
  const [comments, setComments] = useState<Comment[]>(() => {
    const now = Date.now();
    return [
      {
        id: 'comment-1',
        whiteboardId,
        userId: '1',
        userName: 'John Doe',
        userInitials: 'JD',
        content: 'Great work on the initial design! I think we should add more detail to the user flow section.',
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
      },
      {
        id: 'comment-2',
        whiteboardId,
        userId: '2',
        userName: 'Jane Smith',
        userInitials: 'JS',
        content: 'Agreed! Also, can we discuss the color scheme in tomorrow\'s meeting?',
        createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
        parentId: 'comment-1',
      },
    ];
  });

  const currentUserId = '1'; // Mock current user

  // Mock collaborators (will be replaced with real data)
  const collaborators = [
    { id: '1', name: 'John Doe', initials: 'JD' },
    { id: '2', name: 'Jane Smith', initials: 'JS' },
  ];

  const handleSaveName = () => {
    setIsEditingName(false);
    toast.success('Whiteboard name updated');
    // In production, save to API
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf') => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    // In production, implement export functionality
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
    // In production, implement sharing functionality
  };

  const handleEditorMount = (editor: unknown) => {
    console.log('✅ tldraw editor mounted:', editor);
    setEditor(editor);

    // Auto-save indicator
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Tag handlers
  const handleAddTag = (tag: WhiteboardTag) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleCreateTag = (name: string, color: string) => {
    const newTag: WhiteboardTag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setAvailableTags([...availableTags, newTag]);
  };

  // Comment handlers
  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      whiteboardId,
      userId: currentUserId,
      userName: 'John Doe',
      userInitials: 'JD',
      content,
      createdAt: new Date().toISOString(),
      parentId,
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (id: string, content: string) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c
      )
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id && c.parentId !== id));
  };

  const handlePinComment = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCreateNode = (text: string) => {
    if (!editor) return;
    // TODO: Implement node creation logic
    console.log('Creating node:', text);
  };

  const handleCreateBranch = (text: string) => {
    if (!editor) return;
    // TODO: Implement branch creation logic
    console.log('Creating branch:', text);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-2">
        {/* Left: Back + Name */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/app/whiteboards')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {isEditingName ? (
            <Input
              value={whiteboardName}
              onChange={(e) => setWhiteboardName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setIsEditingName(false);
                  setWhiteboardName(whiteboardName);
                }
              }}
              className="h-8 w-64"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="rounded px-2 py-1 text-sm font-medium hover:bg-muted"
            >
              {whiteboardName}
            </button>
          )}

          {/* Auto-save Indicator */}
          {isSaving && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save className="h-3 w-3 animate-pulse" />
              Saving...
            </span>
          )}

          {/* Tags */}
          <TagsManager
            selectedTags={selectedTags}
            availableTags={availableTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onCreateTag={handleCreateTag}
          />
        </div>

        {/* Right: Collaborators + Actions */}
        <div className="flex items-center gap-3">
          {/* Collaborators */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {collaborators.map((user) => (
                <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Users className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Comments Toggle */}
          <Button
            variant={showComments ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments
            {comments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {comments.length}
              </Badge>
            )}
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="mr-2 h-4 w-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize className="mr-2 h-4 w-4" />
                Fullscreen
              </>
            )}
          </Button>

          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('png')}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('svg')}>
                Export as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Background Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Background
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Canvas Background</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={backgroundType} onValueChange={(value) => setBackgroundType(value as BackgroundType)}>
                <DropdownMenuRadioItem value="default">
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  Default Grid
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="horizontal-lines">
                  <Minus className="mr-2 h-4 w-4" />
                  Horizontal Lines
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="square-grid">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Square Grid
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowMindmapTools(!showMindmapTools)}>
                <Settings className="mr-2 h-4 w-4" />
                {showMindmapTools ? 'Hide' : 'Show'} Mindmap Tools
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete Whiteboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mindmap Toolbar (when enabled) */}
      {showMindmapTools && (
        <div className="border-b bg-background px-4 py-2">
          <MindmapToolbar
            onCreateNode={handleCreateNode}
            onCreateBranch={handleCreateBranch}
            disabled={!editor}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* tldraw Canvas */}
        <div className="flex-1">
          <TldrawBoard
            persistenceKey={`whiteboard-${whiteboardId}`}
            onMount={handleEditorMount}
            backgroundType={backgroundType}
          />
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-96">
            <CommentsSidebar
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onPinComment={handlePinComment}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
