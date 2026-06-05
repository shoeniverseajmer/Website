import type { Variants, Transition } from 'framer-motion';

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  fast: { duration: 0.18, ease: premiumEase },
  base: { duration: 0.28, ease: premiumEase },
  slow: { duration: 0.45, ease: premiumEase },
  spring: { type: 'spring', stiffness: 320, damping: 34 }
} satisfies Record<string, Transition>;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: transitions.base }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: transitions.fast }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  }
};

export const drawerMotion = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' }
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' }
  }
};
