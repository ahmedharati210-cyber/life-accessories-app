'use client';

import { Variants, Transition } from 'framer-motion';

// Lazy load animation variants to reduce initial bundle size
interface AnimationVariants {
  fadeInUp: Variants;
  fadeInDown: Variants;
  fadeInLeft: Variants;
  fadeInRight: Variants;
  scaleIn: Variants;
  staggerContainer: Variants;
  staggerItem: Variants;
  hoverLift: Record<string, unknown>;
  hoverGlow: Record<string, unknown>;
  hoverRotate: Record<string, unknown>;
  pageVariants: Variants;
  modalVariants: Variants;
  backdropVariants: Variants;
  pulseVariants: Variants;
  slideVariants: Variants;
  luxuryTransitions: Record<string, unknown>;
  performanceProps: Record<string, unknown>;
}

export const loadAnimationVariants = async (): Promise<AnimationVariants> => {
  // Only load when needed
  const { 
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerContainer,
    staggerItem,
    hoverLift,
    hoverGlow,
    hoverRotate,
    pageVariants,
    modalVariants,
    backdropVariants,
    pulseVariants,
    slideVariants,
    luxuryTransitions,
    performanceProps
  } = await import('./animations');
  
  return {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerContainer,
    staggerItem,
    hoverLift,
    hoverGlow,
    hoverRotate,
    pageVariants,
    modalVariants,
    backdropVariants,
    pulseVariants,
    slideVariants,
    luxuryTransitions,
    performanceProps
  };
};

// Preload critical animations
export const preloadCriticalAnimations = () => {
  if (typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadAnimationVariants();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadAnimationVariants();
      }, 100);
    }
  }
};

// Type definitions for luxury transitions
export interface LuxuryTransitions {
  smooth?: Transition;
  elegant?: Transition;
  swift?: Transition;
  snappy?: Transition;
}

// Type definitions for performance props
export interface PerformanceProps {
  style?: {
    willChange?: string;
    transform?: string;
    backfaceVisibility?: string;
  };
}

// Type-safe animation chunk interface
export interface AnimationChunk {
  fadeInUp?: Variants;
  fadeInDown?: Variants;
  fadeInLeft?: Variants;
  fadeInRight?: Variants;
  scaleIn?: Variants;
  staggerContainer?: Variants;
  staggerItem?: Variants;
  hoverLift?: Record<string, unknown>;
  hoverGlow?: Record<string, unknown>;
  hoverRotate?: Record<string, unknown>;
  pageVariants?: Variants;
  modalVariants?: Variants;
  backdropVariants?: Variants;
  pulseVariants?: Variants;
  slideVariants?: Variants;
  luxuryTransitions?: LuxuryTransitions;
  performanceProps?: PerformanceProps;
}

// Animation chunk splitting strategy
export const getAnimationChunk = (chunkName: string): Promise<AnimationChunk> => {
  switch (chunkName) {
    case 'hero':
      return import('./animations').then(module => ({
        fadeInUp: module.fadeInUp,
        scaleIn: module.scaleIn,
        staggerContainer: module.staggerContainer,
        staggerItem: module.staggerItem,
        luxuryTransitions: module.luxuryTransitions,
        performanceProps: module.performanceProps
      }));
    
    case 'product':
      return import('./animations').then(module => ({
        fadeInUp: module.fadeInUp,
        hoverLift: module.hoverLift,
        luxuryTransitions: module.luxuryTransitions,
        performanceProps: module.performanceProps
      }));
    
    case 'carousel':
      return import('./animations').then(module => ({
        fadeInUp: module.fadeInUp,
        staggerContainer: module.staggerContainer,
        staggerItem: module.staggerItem,
        luxuryTransitions: module.luxuryTransitions,
        performanceProps: module.performanceProps
      }));
    
    case 'modal':
      return import('./animations').then(module => ({
        modalVariants: module.modalVariants,
        backdropVariants: module.backdropVariants,
        luxuryTransitions: module.luxuryTransitions
      }));
    
    default:
      return loadAnimationVariants();
  }
};
