'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { LazyMotion } from '@/components/ui/LazyMotion';
import { getAnimationChunk, AnimationChunk } from '@/lib/animationLoader';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  description?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function ProductCarousel({
  products,
  title,
  description,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [animations, setAnimations] = useState<AnimationChunk | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Load animations lazily
  useEffect(() => {
    getAnimationChunk('carousel').then(setAnimations);
  }, []);

  const itemsPerView = 4;
  const maxSlides = Math.max(1, Math.ceil(products.length / itemsPerView));

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && products.length > itemsPerView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= maxSlides - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlay, autoPlayInterval, isHovered, products.length, itemsPerView, maxSlides]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < maxSlides) {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? maxSlides - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex >= maxSlides - 1 ? 0 : currentIndex + 1);
  };

  const getVisibleProducts = () => {
    const startIndex = currentIndex * itemsPerView;
    const endIndex = Math.min(startIndex + itemsPerView, products.length);
    return products.slice(startIndex, endIndex);
  };

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-elegant-medium text-gray-600 mb-2">
              لا توجد منتجات متاحة حالياً
            </h3>
            <p className="text-gray-500">
              سنضيف منتجات جديدة قريباً
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state while animations are loading
  if (!animations) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <LazyMotion 
          className="text-center mb-16"
          variants={animations.fadeInUp}
          initial={false}
          animate="visible"
          threshold={0.2}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-sm font-elegant-medium text-purple-700">
              المنتجات المميزة
            </span>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-luxury-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  ...(animations.luxuryTransitions?.elegant || {}),
                  delay: 0.2
                }
              }
            }}
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-elegant"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    ...(animations.luxuryTransitions?.smooth || {}),
                    delay: 0.4
                  }
                }
              }}
            >
              {description}
            </motion.p>
          )}
        </LazyMotion>

        {/* Carousel Container */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Products Container */}
          <LazyMotion 
            ref={containerRef}
            className="overflow-hidden rounded-3xl"
            variants={animations.staggerContainer}
            initial={false}
            animate="visible"
            threshold={0.1}
          >
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
              variants={animations.staggerContainer}
            >
              {getVisibleProducts().map((product) => (
                <motion.div 
                  key={product.id} 
                  className="w-full"
                  variants={animations.staggerItem}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </LazyMotion>

          {/* Navigation Arrows */}
          {showArrows && maxSlides > 1 && (
            <>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: 4 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  onClick={goToPrevious}
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { x: -2 }}
                    transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: -4 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                  onClick={goToNext}
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { x: 2 }}
                    transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
                  </motion.div>
                </Button>
              </motion.div>
            </>
          )}

          {/* Dots Indicator */}
          {showDots && maxSlides > 1 && (
            <motion.div 
              className="flex justify-center mt-12 space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
            >
              {Array.from({ length: maxSlides }).map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  onClick={() => goToSlide(index)}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.2, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  transition={animations.luxuryTransitions?.snappy || { duration: 0.2 }}
                  animate={index === currentIndex ? { 
                    scale: [1.25, 1.4, 1.25],
                    transition: { type: "tween", duration: 1, repeat: Infinity }
                  } : {}}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
          >
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              <a href="/products" className="flex items-center gap-3">
                <span className="font-elegant-medium text-lg">عرض جميع المنتجات</span>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { x: -4 }}
                  transition={animations.luxuryTransitions?.smooth || { duration: 0.3 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.div>
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
