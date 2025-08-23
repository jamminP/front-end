import { Variants } from 'framer-motion';

export const overlayVar: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const dialogVar: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 360, damping: 28, mass: 0.6 },
  },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.15 } },
};
