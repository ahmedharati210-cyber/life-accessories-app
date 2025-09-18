'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/features/ProductCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Category, Product } from '@/types';

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [headerHeight, setHeaderHeight] = useState('h-20');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'onSale' | 'new'>('all');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHeaderHeight(window.scrollY > 50 ? 'h-16' : 'h-20');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products by category
  const categoryProducts = products.filter(product => 
    product.categorySlug === category.slug
  );

  // Apply filters
  let filteredProducts = categoryProducts;

  if (filterBy === 'inStock') {
    filteredProducts = filteredProducts.filter(product => product.inStock);
  } else if (filterBy === 'onSale') {
    filteredProducts = filteredProducts.filter(product => product.isOnSale);
  } else if (filterBy === 'new') {
    filteredProducts = filteredProducts.filter(product => product.isNew);
  }

  // Apply sorting
  if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'price') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  const inStockProducts = categoryProducts.filter(product => product.inStock);
  const newProducts = categoryProducts.filter(product => product.isNew);
  const onSaleProducts = categoryProducts.filter(product => product.isOnSale);

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/categories" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة إلى الفئات
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{categoryProducts.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">إجمالي المنتجات</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{inStockProducts.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">متوفر</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{newProducts.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">جديد</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{onSaleProducts.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">خصم</div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterBy === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('all')}
              >
                الكل
              </Button>
              <Button
                variant={filterBy === 'inStock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('inStock')}
              >
                متوفر
              </Button>
              <Button
                variant={filterBy === 'onSale' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('onSale')}
              >
                خصم
              </Button>
              <Button
                variant={filterBy === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('new')}
              >
                جديد
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'newest')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="name">الاسم</option>
                <option value="price">السعر</option>
                <option value="newest">الأحدث</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-4">
              لم نجد أي منتجات تطابق الفلاتر المحددة
            </p>
            <Button onClick={() => setFilterBy('all')}>
              إزالة الفلاتر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
