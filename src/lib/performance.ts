// Performance optimization utilities

/**
 * Preload critical images for better LCP (Largest Contentful Paint)
 */
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    '/images/hero-jewelry.jpeg', // Hero image
    '/images/logo.png', // Logo
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Preload Cloudinary images with optimization
 */
export function preloadCloudinaryImage(
  publicId: string,
  width: number,
  height: number,
  quality: string = 'auto'
) {
  if (typeof window === 'undefined') return;

  // Generate optimized URL (you'll need to import getOptimizedImageUrl)
  const optimizedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},q_${quality},f_auto,c_fill/${publicId}`;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Optimize images for different viewport sizes
 */
export function getResponsiveImageSrc(
  baseSrc: string,
  width: number,
  height: number,
  quality: string = 'auto'
): string {
  // If it's a Cloudinary URL, optimize it
  if (baseSrc.includes('cloudinary.com')) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const publicId = baseSrc.split('/').slice(-2).join('/').split('.')[0];
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},q_${quality},f_auto,c_fill/${publicId}`;
  }
  
  return baseSrc;
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Optimize bundle loading
 */
export function optimizeBundleLoading() {
  if (typeof window === 'undefined') return;

  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.href = '/styles/critical.css';
  criticalCSS.as = 'style';
  document.head.appendChild(criticalCSS);

  // Defer non-critical JavaScript
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    script.setAttribute('defer', '');
  });
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  preloadCriticalImages();
  setupLazyLoading();
  optimizeBundleLoading();
}
