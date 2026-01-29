'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Tag, X, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface WhiteboardTag {
  id: string;
  name: string;
  color: string;
}

// Predefined tag colors
const TAG_COLORS = [
  { name: 'Gray', value: 'bg-gray-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
];

// Common tag suggestions
const SUGGESTED_TAGS = [
  { name: 'Design', color: 'bg-purple-500' },
  { name: 'Planning', color: 'bg-blue-500' },
  { name: 'Brainstorm', color: 'bg-yellow-500' },
  { name: 'Meeting', color: 'bg-green-500' },
  { name: 'Draft', color: 'bg-gray-500' },
  { name: 'Review', color: 'bg-orange-500' },
  { name: 'Approved', color: 'bg-green-500' },
  { name: 'Urgent', color: 'bg-red-500' },
];

interface TagsManagerProps {
  selectedTags: WhiteboardTag[];
  availableTags: WhiteboardTag[];
  onAddTag: (tag: WhiteboardTag) => void;
  onRemoveTag: (tagId: string) => void;
  onCreateTag: (name: string, color: string) => void;
}

export function TagsManager({
  selectedTags,
  availableTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
}: TagsManagerProps) {
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const newTag: WhiteboardTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
    };

    onCreateTag(newTag.name, newTag.color);
    onAddTag(newTag);
    setNewTagName('');
    setNewTagColor(TAG_COLORS[0].value);
    setShowCreateForm(false);
    toast.success(`Tag "${newTag.name}" created`);
  };

  const handleSelectTag = (tag: WhiteboardTag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onRemoveTag(tag.id);
    } else {
      onAddTag(tag);
    }
  };

  const isTagSelected = (tagId: string) => {
    return selectedTags.some((t) => t.id === tagId);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Selected Tags */}
      {selectedTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="gap-1 pr-1"
        >
          <span className={`h-2 w-2 rounded-full ${tag.color}`} />
          {tag.name}
          <button
            onClick={() => onRemoveTag(tag.id)}
            className="ml-1 rounded-sm hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Add Tag Popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1">
            <Tag className="h-3 w-3" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="text-muted-foreground">No tags found</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Create new tag
                  </Button>
                </div>
              </CommandEmpty>

              {/* Available Tags */}
              {availableTags.length > 0 && (
                <CommandGroup heading="Your Tags">
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleSelectTag(tag)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${tag.color}`} />
                        <span>{tag.name}</span>
                      </div>
                      {isTagSelected(tag.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />

              {/* Suggested Tags */}
              <CommandGroup heading="Suggested">
                {SUGGESTED_TAGS.map((tag, index) => {
                  const existingTag = availableTags.find((t) => t.name === tag.name);
                  const tagToUse = existingTag || {
                    id: `suggested-${index}`,
                    ...tag,
                  };

                  return (
                    <CommandItem
                      key={tagToUse.id}
                      onSelect={() => {
                        if (!existingTag) {
                          onCreateTag(tag.name, tag.color);
                        }
                        handleSelectTag(tagToUse);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${tag.color}`} />
                        <span>{tag.name}</span>
                      </div>
                      {isTagSelected(tagToUse.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandSeparator />

              {/* Create New Tag */}
              {showCreateForm ? (
                <div className="p-3 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Tag Name</label>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateTag();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Color</label>
                    <div className="flex gap-2">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewTagColor(color.value)}
                          className={`h-6 w-6 rounded-full ${color.value} ${
                            newTagColor === color.value
                              ? 'ring-2 ring-primary ring-offset-2'
                              : ''
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewTagName('');
                        setNewTagColor(TAG_COLORS[0].value);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new tag
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
