'use client';

import { preloadCriticalAnimations } from './animationLoader';

// Preload critical animations on page load
if (typeof window !== 'undefined') {
  // Preload on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalAnimations);
  } else {
    preloadCriticalAnimations();
  }

  // Preload on user interaction (hover, click, etc.)
  const preloadOnInteraction = () => {
    preloadCriticalAnimations();
    // Remove listeners after first interaction
    document.removeEventListener('mouseover', preloadOnInteraction);
    document.removeEventListener('click', preloadOnInteraction);
    document.removeEventListener('touchstart', preloadOnInteraction);
  };

  document.addEventListener('mouseover', preloadOnInteraction, { once: true });
  document.addEventListener('click', preloadOnInteraction, { once: true });
  document.addEventListener('touchstart', preloadOnInteraction, { once: true });
}
