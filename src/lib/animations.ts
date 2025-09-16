import { Variants } from 'framer-motion';

// Luxury animation presets for consistent, high-end feel
export const luxuryTransitions = {
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8
  },
  elegant: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.6
  },
  swift: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.4
  },
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
    mass: 1
  },
  snappy: {
    type: "spring" as const,
    stiffness: 600,
    damping: 40,
    mass: 0.3
  }
} as const;

// Common animation variants for reusability
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxuryTransitions.elegant
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxuryTransitions.elegant
  }
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: luxuryTransitions.elegant
  }
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: luxuryTransitions.elegant
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: luxuryTransitions.smooth
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxuryTransitions.elegant
  }
};

// Hover animations for luxury feel
export const hoverLift = {
  whileHover: { 
    y: -8,
    scale: 1.02,
    transition: luxuryTransitions.swift
  },
  whileTap: { 
    scale: 0.98,
    transition: luxuryTransitions.snappy
  }
};

export const hoverGlow = {
  whileHover: { 
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: luxuryTransitions.smooth
  }
};

export const hoverRotate = {
  whileHover: { 
    rotate: 2,
    scale: 1.05,
    transition: luxuryTransitions.smooth
  }
};

// Page transition variants
export const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 8,
    scale: 0.98
  },
  in: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxuryTransitions.smooth
  },
  out: { 
    opacity: 0, 
    y: -8,
    scale: 0.98,
    transition: luxuryTransitions.smooth
  }
};

// Modal animations
export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: luxuryTransitions.elegant
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 20,
    transition: luxuryTransitions.smooth
  }
};

// Backdrop animations
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: luxuryTransitions.smooth
  },
  exit: { 
    opacity: 0,
    transition: luxuryTransitions.smooth
  }
};

// Loading animations
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Slide animations for carousels
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Utility function to check if user prefers reduced motion
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Performance-optimized animation props
export const performanceProps = {
  style: { 
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force hardware acceleration
    backfaceVisibility: 'hidden' as const
  }
};

// Optimized animation variants for better performance
export const optimizedVariants = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    }
  }
};
