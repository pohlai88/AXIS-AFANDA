/**
 * Luxury Theme Constants
 * Centralized design tokens for consistent luxury styling
 */

export const LUXURY_VARIANTS = {
  // Button variants
  button: {
    luxury: "btn-gold-lux shadow-md shadow-yellow-500/25 hover:shadow-lg hover:shadow-yellow-500/30 font-semibold",
    luxuryOutline: "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-950",
    luxuryGhost: "hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-950/20 dark:hover:text-yellow-300",
  },
  
  // Card variants
  card: {
    luxury: "border-yellow-200 dark:border-yellow-800 bg-linear-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 shadow-lg shadow-yellow-500/5 hover:shadow-xl hover:shadow-yellow-500/10",
    luxuryGlow: "card-glow-lux",
    elevated: "shadow-lg hover:shadow-xl",
  },
  
  // Input variants
  input: {
    luxury: "border-yellow-300 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500/20",
    luxuryFocus: "focus-visible:border-yellow-500 focus-visible:ring-yellow-500/20",
  },
  
  // Select variants
  select: {
    luxury: "border-yellow-300 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500/20",
  },
  
  // Table variants
  table: {
    luxury: "border-yellow-200 dark:border-yellow-800 [&_th]:bg-yellow-50/50 [&_th]:dark:bg-yellow-950/20",
    luxuryRow: "hover:bg-yellow-50/30 dark:hover:bg-yellow-950/10",
  },
} as const;

export const LUXURY_COLORS = {
  // Primary luxury colors
  gold: {
    50: "oklch(0.985 0.014 95)",
    100: "oklch(0.965 0.028 95)",
    200: "oklch(0.925 0.056 95)",
    300: "oklch(0.865 0.112 95)",
    400: "oklch(0.785 0.168 95)",
    500: "oklch(0.825 0.189 85)", // Primary gold
    600: "oklch(0.705 0.185 45)", // Orange accent
    700: "oklch(0.585 0.161 45)",
    800: "oklch(0.465 0.137 45)",
    900: "oklch(0.275 0.075 85)",
  },
  
  // Semantic business colors
  business: {
    approve: "oklch(0.945 0.085 145)",
    reject: "oklch(0.945 0.085 15)",
    changes: "oklch(0.945 0.085 245)",
    pending: "oklch(0.965 0.085 65)",
  },
} as const;

export const DATA_SLOTS = {
  // Standard data slots for consistency
  button: "button",
  card: "card",
  cardHeader: "card-header",
  cardContent: "card-content",
  cardFooter: "card-footer",
  input: "input",
  select: "select",
  table: "table",
  sidebar: "sidebar",
} as const;

export const FOCUS_RING_STYLES = {
  // Consistent focus ring styles
  default: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  destructive: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  luxury: "focus-visible:border-yellow-500 focus-visible:ring-yellow-500/20",
} as const;
