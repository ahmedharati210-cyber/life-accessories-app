'use client';

import { motion } from 'framer-motion';
import { CategoryCard } from '@/components/features/CategoryCard';
import { Product, Category } from '@/types';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState('h-20');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/website/products', { cache: 'no-store' });
        const productsData = await productsResponse.json();
        setProducts(productsData.success ? productsData.data : []);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/website/categories', { cache: 'no-store' });
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.success ? categoriesData.data : []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderHeight(window.scrollY > 50 ? 'h-16' : 'h-20');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">فئات المنتجات</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استكشف مجموعاتنا المتنوعة من الإكسسوارات والمنتجات
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  productCount={category.productCount || 0}
                />
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-center mb-8">إحصائيات المتجر</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {categories.length}
                </div>
                <div className="text-muted-foreground">فئة منتج</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {products.length}
                </div>
                <div className="text-muted-foreground">منتج متاح</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {products.filter(p => p.isFeatured).length}
                </div>
                <div className="text-muted-foreground">منتج مميز</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
