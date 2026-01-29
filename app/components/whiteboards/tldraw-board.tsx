'use client';

import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect, useState } from 'react';

export type BackgroundType = 'default' | 'horizontal-lines' | 'square-grid';

interface TldrawBoardProps {
  /**
   * Unique key for persisting the whiteboard state to browser storage.
   * This enables auto-save and cross-tab synchronization.
   */
  persistenceKey: string;

  /**
   * Optional callback when the editor is mounted and ready.
   */
  onMount?: (editor: Editor) => void;

  /**
   * Background style for the canvas
   * - 'default': tldraw's default grid
   * - 'horizontal-lines': Horizontal ruled lines (notebook style)
   * - 'square-grid': Square grid pattern
   */
  backgroundType?: BackgroundType;
}

/**
 * TldrawBoard Component
 * 
 * A collaborative whiteboard component powered by tldraw.
 * Features:
 * - Infinite canvas
 * - Drawing tools (pen, shapes, text, etc.)
 * - Auto-save to browser storage
 * - Cross-tab synchronization
 * - Undo/redo
 * - Export capabilities
 * - Multiple background styles
 * 
 * @see https://tldraw.dev/
 */
export function TldrawBoard({
  persistenceKey,
  onMount,
  backgroundType = 'default'
}: TldrawBoardProps) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleMount = (editorInstance: Editor) => {
    setEditor(editorInstance);
    if (onMount) {
      onMount(editorInstance);
    }
  };

  // Apply custom background styles
  useEffect(() => {
    if (!editor) return;

    const container = editor.getContainer();
    const canvas = container.querySelector('.tl-background') as HTMLElement;

    if (!canvas) return;

    // Remove any existing custom classes
    canvas.classList.remove('bg-horizontal-lines', 'bg-square-grid');

    // Apply the selected background
    if (backgroundType === 'horizontal-lines') {
      canvas.classList.add('bg-horizontal-lines');
    } else if (backgroundType === 'square-grid') {
      canvas.classList.add('bg-square-grid');
    }
  }, [editor, backgroundType]);

  return (
    <div className="h-full w-full tldraw-container">
      <Tldraw
        persistenceKey={persistenceKey}
        onMount={handleMount}
      />

      {/* Custom Background Styles */}
      <style jsx global>{`
        /* Horizontal Lines Background (Notebook Style) */
        .tldraw-container .tl-background.bg-horizontal-lines {
          background-image: 
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 39px,
              hsl(var(--border) / 0.2) 39px,
              hsl(var(--border) / 0.2) 40px
            );
          background-size: 100% 40px;
          background-position: 0 0;
        }

        /* Dark mode horizontal lines */
        .dark .tldraw-container .tl-background.bg-horizontal-lines {
          background-image: 
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 39px,
              hsl(var(--border) / 0.3) 39px,
              hsl(var(--border) / 0.3) 40px
            );
        }

        /* Square Grid Background */
        .tldraw-container .tl-background.bg-square-grid {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0;
        }

        /* Dark mode square grid */
        .dark .tldraw-container .tl-background.bg-square-grid {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.25) 1px, transparent 1px);
        }

        /* Add subtle shadow to grid for depth */
        .tldraw-container .tl-background.bg-square-grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            hsl(var(--background) / 0.02) 100%
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
