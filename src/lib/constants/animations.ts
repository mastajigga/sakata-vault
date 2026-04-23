/**
 * Premium Animation Constants
 * Standardized easing and variants for a high-end feel.
 */

export const EASES = {
  // Ultra smooth, slightly decelerated at the end
  premium: [0.22, 1, 0.36, 1] as any,
  // Snappy enter
  out: [0.33, 1, 0.68, 1] as any,
  // Smooth out
  in: [0.32, 0, 0.67, 0] as any,
};

export const TRANSITIONS = {
  default: { duration: 0.4, ease: EASES.premium },
  fast: { duration: 0.2, ease: EASES.out },
  slow: { duration: 0.7, ease: EASES.premium },
};

export const VARIANTS: any = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: TRANSITIONS.default,
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: TRANSITIONS.default,
    exit: { opacity: 0, y: -10 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
};
