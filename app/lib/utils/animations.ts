/**
 * Animation utility functions and variants for Framer Motion
 */

/**
 * Fade in animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

/**
 * Slide up animation
 */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

/**
 * Slide down animation
 */
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

/**
 * Scale animation (pop)
 */
export const scale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 },
};

/**
 * Stagger children animation
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

/**
 * Check if animations should be reduced
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get transition duration based on user preferences
 */
export function getTransitionDuration(defaultDuration = 0.3): number {
  return shouldReduceMotion() ? 0 : defaultDuration;
}

/**
 * Spring animation config
 */
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Bounce animation config
 */
export const bounceConfig = {
  type: 'spring',
  stiffness: 500,
  damping: 15,
};
