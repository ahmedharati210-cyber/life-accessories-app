'use client';

import { motion, MotionProps } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useReducedMotion } from 'framer-motion';
import { ReactNode, forwardRef, useState, useEffect } from 'react';

interface LazyMotionProps extends MotionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export const LazyMotion = forwardRef<HTMLDivElement, LazyMotionProps>(function LazyMotion({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  className,
  ...motionProps
}, ref) {
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce
  });
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial render, don't apply animations
  if (!isMounted || shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  // If not intersecting and triggerOnce is true, show fallback
  if (!isIntersecting && triggerOnce) {
    return (
      <div ref={ref} className={className}>
        {fallback || children}
      </div>
    );
  }

  return (
    <motion.div
      ref={(node) => {
        // Set the intersection observer ref
        if (intersectionRef && 'current' in intersectionRef) {
          (intersectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        // Set the forwarded ref
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
});
