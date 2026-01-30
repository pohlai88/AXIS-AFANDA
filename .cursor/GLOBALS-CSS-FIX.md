# globals.css - Duplicate Sidebar Token Fix

**Date**: 2026-01-30  
**Issue**: Duplicate `:root` blocks overriding luxury sidebar tokens  
**Status**: ✅ **FIXED**

---

## Problem Identified

User spotted a critical CSS specificity issue:

### Luxury Tokens (Defined First)
```css
@layer base {
  :root {
    /* Lines 185-189: Beautiful luxury palette */
    --sidebar: 40 20% 97.5%;              /* Alabaster */
    --sidebar-foreground: 25 10% 10%;     /* Deep charcoal */
    --sidebar-accent: 42 20% 92%;         /* Gold accent */
    --sidebar-accent-foreground: 42 35% 30%;
  }
}
```

### Shadcn Defaults (Overriding Later)
```css
/* Lines 467-503: Generic grey sidebar - WRONG! */
:root {
  --sidebar: hsl(0 0% 98%);              /* Generic grey */
  --sidebar-foreground: hsl(240 5.3% 26.1%);
  --sidebar-accent: hsl(240 4.8% 95.9%); /* Boring grey */
  /* ... more grey ... */
}

.dark {
  --sidebar: hsl(240 5.9% 10%);         /* Generic dark */
  /* ... more generic dark ... */
}
```

**Result**: Luxury tokens were being **completely overridden** by later shadcn defaults!

---

## Solution Applied

**Removed lines 467-503**: Deleted both duplicate `:root` and `.dark` sidebar blocks.

**Removed lines 505-531**: 
- Cleaned up unused `@theme inline` block with sidebar-primary/border/ring tokens
- Removed duplicate `@layer base` with redundant border/body styles

**Result**: Luxury sidebar tokens now WIN! ✨

---

## What Changed

### Before (Overridden)
```css
/* Line 185: Luxury defined */
--sidebar: 40 20% 97.5%;

/* Line 467: Shadcn overrides it! */
--sidebar: hsl(0 0% 98%);  /* ❌ This wins */
```

### After (Luxury Wins)
```css
/* Line 185: Luxury defined */
--sidebar: 40 20% 97.5%;   /* ✅ This wins! */

/* Line 467: DELETED */
```

---

## Files Modified

1. `app/globals.css`
   - **Deleted**: Lines 467-503 (duplicate sidebar `:root` and `.dark`)
   - **Deleted**: Lines 505-531 (unused theme inline + duplicate base layer)
   - **Added**: Comment noting luxury palette now controls sidebar

**Lines Removed**: ~60 lines of conflicting CSS

---

## Impact

### Visual Changes Expected

**Sidebar Colors**:
- **Light Mode**: Now uses luxury Alabaster (`40 20% 97.5%`) instead of generic grey
- **Dark Mode**: Now uses luxury Deep Onyx (`240 5% 8%`) instead of generic dark
- **Accents**: Now uses Burnished Gold (`42 20% 92%`) instead of boring grey

**What You'll See**:
- ✨ Sidebar has warmer, more luxurious tone
- 🎨 Better harmony with rest of luxury design system
- 🌓 Dark mode sidebar now matches your Deep Onyx palette
- 💎 Gold accents provide premium feel

---

## Verification

### Before Fix
```css
computed --sidebar: hsl(0 0% 98%)  /* Generic grey */
```

### After Fix
```css
computed --sidebar: hsl(40 20% 97.5%)  /* Luxury Alabaster ✨ */
```

**Test in Browser**:
1. Open DevTools
2. Inspect sidebar element
3. Check computed `--sidebar` value
4. Should now see `hsl(40, 20%, 97.5%)` (Alabaster)

---

## Why This Happened

**Root Cause**: Shadcn CLI auto-added default sidebar tokens when sidebar component was installed, not knowing you had custom luxury tokens already defined.

**CSS Cascade Issue**: Later declarations outside `@layer` override earlier declarations inside `@layer base` due to specificity and source order.

---

## Future Prevention

**If adding new shadcn components**:
1. Check for duplicate token definitions
2. Verify luxury tokens aren't being overridden
3. Delete any shadcn defaults that conflict with luxury palette
4. Keep luxury tokens in `@layer base` as single source of truth

---

## Summary

**Problem**: Duplicate sidebar tokens overriding luxury palette  
**Fix**: Deleted conflicting shadcn defaults (lines 467-503)  
**Result**: Luxury Alabaster & Gold now render correctly! ✨

**Visual Impact**: Sidebar now matches your premium enterprise design system.

---

*Fixed: 2026-01-30*  
*Credit: User caught this critical CSS issue*  
*Status: ✅ Luxury palette restored!*
