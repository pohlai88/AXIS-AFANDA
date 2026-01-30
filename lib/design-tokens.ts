/**
 * Design Token System
 * 
 * Extracted from globals.css - use these tokens instead of hardcoded values.
 * Canonical source: app/globals.css
 */

export const designTokens = {
  // ===== COLORS =====
  colors: {
    // Core semantic colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    destructive: 'hsl(var(--destructive))',
    destructiveForeground: 'hsl(var(--destructive-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',

    // Sidebar
    sidebar: 'hsl(var(--sidebar))',
    sidebarForeground: 'hsl(var(--sidebar-foreground))',
    sidebarAccent: 'hsl(var(--sidebar-accent))',
    sidebarAccentForeground: 'hsl(var(--sidebar-accent-foreground))',

    // Semantic status
    info: 'hsl(var(--info))',
    success: 'hsl(var(--success))',
    warn: 'hsl(var(--warn))',
    danger: 'hsl(var(--danger))',

    // Dividers
    dividerSoft: 'hsl(var(--divider-soft))',
    dividerStrong: 'hsl(var(--divider-strong))',

    // Workflow states
    workflow: {
      approve: {
        bg: 'hsl(var(--approve-bg))',
        fg: 'hsl(var(--approve-fg))',
        border: 'hsl(var(--approve-bd))',
      },
      reject: {
        bg: 'hsl(var(--reject-bg))',
        fg: 'hsl(var(--reject-fg))',
        border: 'hsl(var(--reject-bd))',
      },
      changes: {
        bg: 'hsl(var(--changes-bg))',
        fg: 'hsl(var(--changes-fg))',
        border: 'hsl(var(--changes-bd))',
      },
      pending: {
        bg: 'hsl(var(--pending-bg))',
        fg: 'hsl(var(--pending-fg))',
        border: 'hsl(var(--pending-bd))',
      },
    },

    // KPIs
    kpi: {
      up: {
        bg: 'hsl(var(--kpi-up-bg))',
        fg: 'hsl(var(--kpi-up-fg))',
        border: 'hsl(var(--kpi-up-bd))',
      },
      down: {
        bg: 'hsl(var(--kpi-down-bg))',
        fg: 'hsl(var(--kpi-down-fg))',
        border: 'hsl(var(--kpi-down-bd))',
      },
      flat: {
        bg: 'hsl(var(--kpi-flat-bg))',
        fg: 'hsl(var(--kpi-flat-fg))',
        border: 'hsl(var(--kpi-flat-bd))',
      },
    },

    // Charts
    chart: {
      primary: 'hsl(var(--ch-primary))',
      secondary: 'hsl(var(--ch-secondary))',
      muted: 'hsl(var(--ch-muted))',
      success: 'hsl(var(--ch-success))',
      warn: 'hsl(var(--ch-warn))',
      danger: 'hsl(var(--ch-danger))',
      grid: 'hsl(var(--ch-grid))',
      baseline: 'hsl(var(--ch-baseline))',
      axis: 'hsl(var(--ch-axis))',
      tooltip: {
        bg: 'hsl(var(--ch-tooltip-bg))',
        fg: 'hsl(var(--ch-tooltip-fg))',
        border: 'hsl(var(--ch-tooltip-bd))',
      },
    },

    // Badges
    badge: {
      soft: 'hsl(var(--badge-soft))',
      softForeground: 'hsl(var(--badge-soft-foreground))',
      solid: 'hsl(var(--badge-solid))',
      solidForeground: 'hsl(var(--badge-solid-foreground))',
    },

    // Status tags
    status: {
      draft: {
        bg: 'hsl(var(--status-draft-bg))',
        fg: 'hsl(var(--status-draft-fg))',
        border: 'hsl(var(--status-draft-bd))',
      },
      posted: {
        bg: 'hsl(var(--status-posted-bg))',
        fg: 'hsl(var(--status-posted-fg))',
        border: 'hsl(var(--status-posted-bd))',
      },
      void: {
        bg: 'hsl(var(--status-void-bg))',
        fg: 'hsl(var(--status-void-fg))',
        border: 'hsl(var(--status-void-bd))',
      },
      warn: {
        bg: 'hsl(var(--status-warn-bg))',
        fg: 'hsl(var(--status-warn-fg))',
        border: 'hsl(var(--status-warn-bd))',
      },
    },

    // Interactions
    interaction: {
      select: 'hsl(var(--select-bg))',
      edit: 'hsl(var(--edit-bg))',
      danger: 'hsl(var(--danger-bg))',
    },

    // Legend
    legendDot: 'hsl(var(--legend-dot))',
  },

  // ===== SPACING & LAYOUT =====
  layout: {
    containerMax: 'var(--layout-container-max)', // 80rem
    containerNarrow: 'var(--layout-container-narrow)', // 48rem
    sectionPy: 'var(--layout-section-py)', // clamp(3rem, 6vw, 5rem)
    gap: 'var(--layout-gap)', // 1.5rem
  },

  // ===== RADIUS =====
  radius: {
    base: 'var(--radius)', // 0.5rem
    lg: 'var(--radius-lg)',
    md: 'var(--radius-md)',
    sm: 'var(--radius-sm)',
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontSans: 'var(--font-sans)',
    fontMono: 'var(--font-mono)',
  },

  // ===== MOTION =====
  motion: {
    fast: 'var(--ax-motion-fast)', // 150ms
    base: 'var(--ax-motion-base)', // 250ms
    slow: 'var(--ax-motion-slow)', // 350ms
  },

  // ===== OPACITY =====
  opacity: {
    disabled: 'var(--ax-disabled-opacity)', // 0.45
  },

  // ===== FOCUS =====
  focus: {
    ring: 'hsl(var(--ax-focus-ring))',
    offset: 'var(--ax-focus-offset)', // 2px
  },

  // ===== SHADOWS =====
  shadow: {
    hsl: 'var(--ax-shadow-hsl)',
    ringOffsetHsl: 'var(--ax-ring-offset-hsl)',
  },
} as const;

/**
 * Tailwind class mappings for common patterns
 */
export const tokenClasses = {
  // Backgrounds
  bg: {
    background: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    destructive: 'bg-destructive',
  },

  // Text colors
  text: {
    foreground: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    accent: 'text-accent-foreground',
    destructive: 'text-destructive-foreground',
  },

  // Borders
  border: {
    default: 'border-border',
    input: 'border-input',
  },

  // Luxury utilities (from globals.css)
  luxury: {
    surface: 'bg-lux-surface',
    paper: 'bg-lux-paper',
    border: 'border-lux',
    shadow: 'shadow-lux',
    shadowStrong: 'shadow-lux-strong',
    cardGlow: 'card-glow-lux',
    btnHover: 'btn-hover-lux',
    ring: 'ring-lux',
    ringStrong: 'ring-lux-strong',
    ringGlow: 'ring-lux-glow',
    textHero: 'text-hero-lux',
    textHeroSub: 'text-hero-sub-lux',
    textGold: 'text-lux-gold',
    bgGoldSoft: 'bg-lux-gold-soft',
    borderGold: 'border-lux-gold',
    rule: 'rule-lux',
    btnGold: 'btn-gold-lux',
    badge: 'badge-lux',
    badgeSolid: 'badge-lux-solid',
    table: 'table-lux',
    sheen: 'sheen-lux',
    skeleton: 'bg-lux-skeleton',
  },
} as const;

/**
 * Common hardcoded values to avoid
 */
export const antiPatterns = {
  // Colors that should use tokens
  colors: [
    // Grays
    /#[0-9a-fA-F]{3,8}/, // hex colors
    /rgb\([^)]+\)/, // rgb colors
    /rgba\([^)]+\)/, // rgba colors
    /hsl\(\d+,?\s*\d+%?,?\s*\d+%?\)/, // hsl without var()

    // Common hardcoded values
    'white',
    'black',
    'gray-50', 'gray-100', 'gray-200', 'gray-300', 'gray-400',
    'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900',
    'slate-', 'zinc-', 'neutral-', 'stone-',
  ],

  // Spacing that should use layout tokens
  spacing: [
    'max-w-7xl', // use var(--layout-container-max)
    'max-w-4xl', // use var(--layout-container-narrow)
    'py-12', 'py-16', 'py-20', // use var(--layout-section-py)
    'gap-6', // use var(--layout-gap)
  ],

  // Radius that should use tokens
  radius: [
    'rounded-lg', // use var(--radius-lg)
    'rounded-md', // use var(--radius-md)
    'rounded-sm', // use var(--radius-sm)
  ],

  // Transitions that should use motion tokens
  transitions: [
    'duration-150', // use var(--ax-motion-fast)
    'duration-200',
    'duration-250', // use var(--ax-motion-base)
    'duration-300',
    'duration-350', // use var(--ax-motion-slow)
  ],
} as const;

/**
 * Helper to get CSS variable value
 */
export function getCSSVar(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Helper to check if a value is using design tokens
 */
export function isUsingToken(value: string): boolean {
  return value.includes('var(--') || value.startsWith('hsl(var(--');
}

/**
 * Suggest token replacement for hardcoded values
 */
export function suggestTokenReplacement(value: string): string | null {
  // Check for common hardcoded patterns
  if (value === 'white' || value === '#fff' || value === '#ffffff') {
    return 'hsl(var(--background)) or hsl(var(--card))';
  }
  if (value === 'black' || value === '#000' || value === '#000000') {
    return 'hsl(var(--foreground))';
  }
  if (value.includes('gray') || value.includes('slate') || value.includes('zinc')) {
    return 'hsl(var(--muted)) or hsl(var(--muted-foreground))';
  }
  if (value === 'max-w-7xl') {
    return 'var(--layout-container-max)';
  }
  if (value === 'max-w-4xl') {
    return 'var(--layout-container-narrow)';
  }
  if (value === 'duration-150' || value === 'duration-200') {
    return 'var(--ax-motion-fast)';
  }
  if (value === 'duration-250' || value === 'duration-300') {
    return 'var(--ax-motion-base)';
  }
  if (value === 'duration-350') {
    return 'var(--ax-motion-slow)';
  }

  return null;
}
