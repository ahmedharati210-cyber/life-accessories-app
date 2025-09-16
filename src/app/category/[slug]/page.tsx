'use client';

import { useState, useEffect } from 'react';
// import { notFound } from 'next/navigation'; // Reserved for future use
import { ProductCard } from '@/components/features/ProductCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Product, Category } from '@/types';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/website/products', { cache: 'no-store' }),
          fetch('/api/website/categories', { cache: 'no-store' })
        ]);
        
        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json()
        ]);
        
        setProducts(productsData.success ? productsData.data : []);
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
    if (slug && categories.length > 0) {
      const foundCategory = categories.find(cat => cat.slug === slug);
      setCategory(foundCategory || null);
    }
  }, [slug, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفئة...</p>
        </div>
      </div>
    );
  }

  // Show loading if still loading or no data yet
  if (loading || !slug || categories.length === 0 || !category) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفئة...</p>
        </div>
      </div>
    );
  }

  const categoryProducts = products.filter(product => 
    product.category === category.id || product.category === category._id
  );
  const inStockProducts = categoryProducts.filter(product => product.inStock);
  const newProducts = categoryProducts.filter(product => product.isNew);
  const onSaleProducts = categoryProducts.filter(product => product.isOnSale);

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary">
              {categoryProducts.length} منتج
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
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">المنتجات</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-2" />
              فلترة
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground mb-6">
              لا توجد منتجات متاحة في هذه الفئة حالياً
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
