# tldraw Background Options

> Three beautiful background styles for your whiteboards

---

## 🎨 Available Backgrounds

### 1. **Default Grid** (tldraw standard)
**Value**: `default`

**Description**: 
- tldraw's native grid pattern
- Subtle dots at intersections
- Professional and clean
- Default option

**Best For**:
- General purpose drawing
- Technical diagrams
- Architecture sketches
- Default choice for most users

---

### 2. **Horizontal Lines** (Notebook Style)
**Value**: `horizontal-lines`

**Description**:
- Evenly spaced horizontal lines
- 40px spacing between lines
- Notebook/ruled paper aesthetic
- Clean and organized feel

**Best For**:
- Writing and note-taking
- Lists and bullet points
- Meeting notes
- Brainstorming sessions
- Text-heavy content

**Visual**:
```
─────────────────────────────
─────────────────────────────
─────────────────────────────
─────────────────────────────
```

---

### 3. **Square Grid** (Graph Paper Style)
**Value**: `square-grid`

**Description**:
- Uniform square grid pattern
- 20px × 20px squares
- Graph paper aesthetic
- Perfect for precise alignment

**Best For**:
- Technical drawings
- Floor plans
- UI mockups
- Precise measurements
- Pixel-perfect designs
- Mathematical diagrams

**Visual**:
```
┌───┬───┬───┬───┬───┐
├───┼───┼───┼───┼───┤
├───┼───┼───┼───┼───┤
├───┼───┼───┼───┼───┤
└───┴───┴───┴───┴───┘
```

---

## 🎯 How to Use

### In Component
```tsx
import { TldrawBoard } from '@/app/components/whiteboards/tldraw-board';

// Default grid
<TldrawBoard 
  persistenceKey="my-board"
  backgroundType="default"
/>

// Horizontal lines
<TldrawBoard 
  persistenceKey="my-board"
  backgroundType="horizontal-lines"
/>

// Square grid
<TldrawBoard 
  persistenceKey="my-board"
  backgroundType="square-grid"
/>
```

### In UI
1. Open any whiteboard
2. Click "Background" button in toolbar
3. Select your preferred background:
   - **Default Grid** (dots)
   - **Horizontal Lines** (notebook)
   - **Square Grid** (graph paper)
4. Background changes instantly

---

## 🎨 Design Details

### Colors
All backgrounds use CSS variables for theme consistency:

- **Light Mode**: `hsl(var(--border) / 0.15)` to `hsl(var(--border) / 0.3)`
- **Dark Mode**: Slightly higher opacity for visibility

### Spacing
- **Horizontal Lines**: 40px between lines (comfortable for writing)
- **Square Grid**: 20px × 20px squares (good for precision)

### Performance
- Pure CSS gradients (no images)
- GPU-accelerated
- Zero performance impact
- Scales infinitely

---

## 🌓 Dark Mode Support

All backgrounds automatically adapt to dark mode:

### Light Mode
- Subtle, low-contrast lines
- Clean and professional
- Easy on the eyes

### Dark Mode
- Slightly higher contrast
- Visible but not distracting
- Comfortable for extended use

---

## 💡 Use Cases

### Default Grid
- ✅ General drawing
- ✅ Freeform sketching
- ✅ Brainstorming
- ✅ Collaboration sessions
- ✅ Default choice

### Horizontal Lines
- ✅ Meeting notes
- ✅ Action items
- ✅ Text documents
- ✅ Lists and outlines
- ✅ Writing-focused work

### Square Grid
- ✅ UI/UX design
- ✅ Floor plans
- ✅ Technical drawings
- ✅ Pixel art
- ✅ Precise alignment
- ✅ Mathematical graphs

---

## 🔧 Technical Implementation

### CSS Gradients
```css
/* Horizontal Lines */
background-image: 
  repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 39px,
    hsl(var(--border) / 0.2) 39px,
    hsl(var(--border) / 0.2) 40px
  );

/* Square Grid */
background-image: 
  linear-gradient(to right, hsl(var(--border) / 0.15) 1px, transparent 1px),
  linear-gradient(to bottom, hsl(var(--border) / 0.15) 1px, transparent 1px);
background-size: 20px 20px;
```

### Dynamic Application
```tsx
useEffect(() => {
  if (!editor) return;
  const canvas = editor.getContainer().querySelector('.tl-background');
  
  // Remove existing classes
  canvas.classList.remove('bg-horizontal-lines', 'bg-square-grid');
  
  // Apply selected background
  if (backgroundType === 'horizontal-lines') {
    canvas.classList.add('bg-horizontal-lines');
  } else if (backgroundType === 'square-grid') {
    canvas.classList.add('bg-square-grid');
  }
}, [editor, backgroundType]);
```

---

## 📊 Comparison

| Feature         | Default Grid | Horizontal Lines | Square Grid |
| --------------- | ------------ | ---------------- | ----------- |
| **Style**       | Dots         | Lines            | Grid        |
| **Spacing**     | Variable     | 40px             | 20px × 20px |
| **Best For**    | General      | Writing          | Precision   |
| **Formality**   | Professional | Casual           | Technical   |
| **Alignment**   | Loose        | Horizontal       | Both axes   |
| **Performance** | Excellent    | Excellent        | Excellent   |

---

## 🎯 Recommendations

### For Teams
- **Product Teams**: Default Grid or Horizontal Lines
- **Design Teams**: Square Grid
- **Engineering Teams**: Square Grid
- **Marketing Teams**: Horizontal Lines
- **Executive Teams**: Default Grid

### For Tasks
- **Brainstorming**: Default Grid or Horizontal Lines
- **Planning**: Horizontal Lines
- **Design**: Square Grid
- **Architecture**: Square Grid
- **Notes**: Horizontal Lines

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Isometric grid (for 3D-style drawings)
- [ ] Hexagonal grid (for game design)
- [ ] Custom grid spacing
- [ ] Custom grid colors
- [ ] Dotted lines option
- [ ] Vertical lines option
- [ ] Combined grids (major/minor)

---

## 📝 Examples

### Meeting Notes (Horizontal Lines)
```
Meeting Notes - Q1 Planning
─────────────────────────────
• Discuss product roadmap
• Review budget allocation
─────────────────────────────
• Assign action items
• Set next meeting date
─────────────────────────────
```

### UI Mockup (Square Grid)
```
┌───────────────────────────┐
│  Header                   │
├───────────────────────────┤
│  ┌─────┐  ┌─────┐        │
│  │ Box │  │ Box │        │
│  └─────┘  └─────┘        │
└───────────────────────────┘
```

### Freeform Sketch (Default Grid)
```
· · · · · · · · · · · · · ·
  ╭─────╮
· │     │ · · · · · · · · ·
  │  ?  │
· │     │ · · · · · · · · ·
  ╰─────╯
· · · · · · · · · · · · · ·
```

---

## ✅ Summary

**Three backgrounds, infinite possibilities:**

1. **Default Grid** - Professional and versatile
2. **Horizontal Lines** - Perfect for writing and notes
3. **Square Grid** - Ideal for precision and technical work

All backgrounds:
- ✅ Theme-aware (light/dark mode)
- ✅ Performance-optimized
- ✅ Instantly switchable
- ✅ Zero configuration
- ✅ Beautiful and functional

**Choose the background that fits your workflow!**

---

*Last updated: 2026-01-28*
*Feature: Complete*
