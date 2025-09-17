'use client';

import { useEffect } from 'react';
import { initializePerformanceOptimizations } from '@/lib/performance';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Initialize performance optimizations on client side
    initializePerformanceOptimizations();
  }, []);

  return null; // This component doesn't render anything
}