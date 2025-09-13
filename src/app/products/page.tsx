'use client';

import { ProductCard } from '@/components/features/ProductCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product, Category } from '@/types';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const inStockProducts = products.filter(product => product.inStock);
  const newProducts = products.filter(product => product.isNew);
  const onSaleProducts = products.filter(product => product.isOnSale);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">جميع المنتجات</h1>
          <p className="text-muted-foreground">
            اكتشف مجموعتنا الكاملة من الإكسسوارات والمنتجات
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="secondary">
            {products.length} منتج
          </Badge>
          <Badge variant="success">
            {inStockProducts.length} متوفر
          </Badge>
          {newProducts.length > 0 && (
            <Badge variant="info">
              {newProducts.length} جديد
            </Badge>
          )}
          {onSaleProducts.length > 0 && (
            <Badge variant="destructive">
              {onSaleProducts.length} في الخصم
            </Badge>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Categories Navigation */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">تصفح حسب الفئة</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </Button>
            </div>
          
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                الكل
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category.id} 
                  variant={selectedCategory === category.id ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
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
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground mb-6">
              لا توجد منتجات متاحة حالياً
            </p>
            <Button asChild>
              <Link href="/">
                العودة للرئيسية
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
