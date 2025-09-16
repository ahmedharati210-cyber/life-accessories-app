'use client';

import { Hero } from '@/components/features/Hero';
import { ProductCarousel } from '@/components/features/ProductCarousel';
import { CategoryCard } from '@/components/features/CategoryCard';
import { Product, Category } from '@/types';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [headerHeight, setHeaderHeight] = useState('h-20');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHeaderHeight(window.scrollY > 50 ? 'h-16' : 'h-20');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get hot products (new or on sale)
  const hotProducts = products
    .filter(product => product.isNew || product.isOnSale)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      {/* Hero Section */}
      <Hero />
      
      {/* Hot Products Carousel */}
      <ProductCarousel
        products={hotProducts}
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
              const productCount = products.filter(p => p.category === category.id).length;
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
