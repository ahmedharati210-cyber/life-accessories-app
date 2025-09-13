'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-elegant-medium text-purple-700">
              المنتجات المميزة
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-luxury-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-elegant">
              {description}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Products Container */}
          <div 
            ref={containerRef}
            className="overflow-hidden rounded-3xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getVisibleProducts().map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showArrows && maxSlides > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
                onClick={goToPrevious}
              >
                <ChevronRight className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
                onClick={goToNext}
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          {showDots && maxSlides > 1 && (
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: maxSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <a href="/products" className="flex items-center gap-3">
              <span className="font-elegant-medium text-lg">عرض جميع المنتجات</span>
              <ChevronLeft className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
