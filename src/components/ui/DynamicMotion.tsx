'use client';

import { lazy, Suspense, ComponentType } from 'react';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
  </div>
);

// Error boundary component (unused but kept for future use)
// const ErrorFallback = ({ error }: { error: Error }) => (
//   <div className="flex items-center justify-center p-8 text-red-500">
//     <div className="text-center">
//       <h3 className="text-lg font-semibold mb-2">خطأ في تحميل المحتوى</h3>
//       <p className="text-sm">{error.message}</p>
//     </div>
//   </div>
// );

interface DynamicMotionProps {
  component: ComponentType<Record<string, unknown>>;
  fallback?: ComponentType;
  errorFallback?: ComponentType<{ error: Error }>;
  [key: string]: unknown;
}

export function DynamicMotion({
  component: Component,
  fallback: Fallback = LoadingSkeleton,
  ...props
}: DynamicMotionProps) {
  return (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
}

// Pre-configured lazy components for common use cases
export const LazyProductCarousel = lazy(() => 
  import('@/components/features/ProductCarousel').then(module => ({
    default: module.ProductCarousel
  }))
);

export const LazyProductCard = lazy(() => 
  import('@/components/features/ProductCard').then(module => ({
    default: module.ProductCard
  }))
);

export const LazyHero = lazy(() => 
  import('@/components/features/Hero').then(module => ({
    default: module.Hero
  }))
);

export const LazyBagSheet = lazy(() => 
  import('@/components/features/BagSheet').then(module => ({
    default: module.BagSheet
  }))
);
