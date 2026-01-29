'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Network,
  Plus,
  GitBranch,
  Circle,
  Square,
  Diamond,
  Hexagon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MindmapToolbarProps {
  onCreateNode: (text: string, shape?: string) => void;
  onCreateBranch: (text: string) => void;
  disabled?: boolean;
}

const NODE_SHAPES = [
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'diamond', icon: Diamond, label: 'Diamond' },
  { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
];

export function MindmapToolbar({
  onCreateNode,
  onCreateBranch,
  disabled = false,
}: MindmapToolbarProps) {
  const [nodeText, setNodeText] = useState('');
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const [showNodeCreator, setShowNodeCreator] = useState(false);

  const handleCreateNode = () => {
    if (!nodeText.trim()) {
      toast.error('Please enter node text');
      return;
    }

    onCreateNode(nodeText, selectedShape);
    setNodeText('');
    setShowNodeCreator(false);
    toast.success('Node created');
  };

  const handleQuickNode = (text: string) => {
    onCreateNode(text, selectedShape);
    toast.success('Node created');
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
      {/* Mindmap Icon */}
      <div className="flex items-center gap-2 px-2">
        <Network className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Mindmap Tools</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Create Node */}
      <Popover open={showNodeCreator} onOpenChange={setShowNodeCreator}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Plus className="mr-2 h-4 w-4" />
            Add Node
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Create Mind Map Node</h4>
              <p className="text-sm text-muted-foreground">
                Add a new node to your mind map
              </p>
            </div>

            {/* Node Text */}
            <div className="space-y-2">
              <Label htmlFor="node-text">Node Text</Label>
              <Input
                id="node-text"
                placeholder="Enter node text..."
                value={nodeText}
                onChange={(e) => setNodeText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateNode();
                  }
                }}
                autoFocus
              />
            </div>

            {/* Shape Selection */}
            <div className="space-y-2">
              <Label>Shape</Label>
              <div className="grid grid-cols-4 gap-2">
                {NODE_SHAPES.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <Button
                      key={shape.id}
                      variant={selectedShape === shape.id ? 'default' : 'outline'}
                      size="sm"
                      className="h-16 flex-col gap-1"
                      onClick={() => setSelectedShape(shape.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{shape.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleCreateNode} className="flex-1">
                Create Node
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNodeCreator(false);
                  setNodeText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Create Branch */}
      <Button variant="outline" size="sm" onClick={() => onCreateBranch('New Branch')} disabled={disabled}>
        <GitBranch className="mr-2 h-4 w-4" />
        Add Branch
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Quick Nodes */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Quick:</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleQuickNode('Idea')}
          disabled={disabled}
        >
          Idea
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleQuickNode('Task')}
          disabled={disabled}
        >
          Task
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleQuickNode('Note')}
          disabled={disabled}
        >
          Note
        </Button>
      </div>
    </div>
  );
}
