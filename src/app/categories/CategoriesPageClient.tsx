'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CategoryCard } from '@/components/features/CategoryCard';
import { Category, Product } from '@/types';

interface CategoriesPageClientProps {
  categories: Category[];
  products: Product[];
}

export function CategoriesPageClient({ categories, products }: CategoriesPageClientProps) {
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            تصفح الفئات
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            استكشف مجموعاتنا المتنوعة من الإكسسوارات الأنيقة
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
            const productCount = products.filter(p => p.categorySlug === category.slug).length;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <CategoryCard
                  category={category}
                  productCount={productCount}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد فئات</h3>
            <p className="text-gray-600">
              لم نجد أي فئات متاحة حالياً
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
