'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/features/Hero';
import { ProductCarousel } from '@/components/features/ProductCarousel';
import { CategoryCard } from '@/components/features/CategoryCard';
import { Product, Category } from '@/types';

interface HomePageClientProps {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
}

export function HomePageClient({ products, categories, featuredProducts }: HomePageClientProps) {
  const [headerHeight, setHeaderHeight] = useState('h-20');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHeaderHeight(window.scrollY > 50 ? 'h-16' : 'h-20');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Carousel */}
      <ProductCarousel
        products={featuredProducts}
        title="المنتجات المميزة"
        description="اكتشف أحدث وأروع المنتجات في مجموعتنا المختارة بعناية"
        autoPlay={true}
        autoPlayInterval={3000}
        showDots={true}
        showArrows={true}
      />
      
      {/* Categories Section */}
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">تسوق حسب الفئة</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استكشف مجموعاتنا المتنوعة من الإكسسوارات الأنيقة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const productCount = products.filter(p => p.categorySlug === category.slug).length;
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={productCount}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
