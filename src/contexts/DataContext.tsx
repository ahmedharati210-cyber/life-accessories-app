'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useApiCache } from '@/hooks/useCache';
import { Product, Category } from '@/types';

interface DataContextType {
  products: Product[];
  categories: Category[];
  productsLoading: boolean;
  categoriesLoading: boolean;
  productsError: Error | null;
  categoriesError: Error | null;
  refreshProducts: () => void;
  refreshCategories: () => void;
  invalidateProducts: () => void;
  invalidateCategories: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Use cached API calls with stale-while-revalidate
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError,
    refresh: refreshProducts,
    invalidate: invalidateProducts
  } = useApiCache<{ success: boolean; data: Product[] }>('/api/website/products', {
    ttl: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: true
  });
  
  const { 
    data: categoriesData, 
    loading: categoriesLoading, 
    error: categoriesError,
    refresh: refreshCategories,
    invalidate: invalidateCategories
  } = useApiCache<{ success: boolean; data: Category[] }>('/api/website/categories', {
    ttl: 30 * 60 * 1000, // 30 minutes
    staleWhileRevalidate: true
  });

  const products = productsData?.success ? productsData.data : [];
  const categories = categoriesData?.success ? categoriesData.data : [];

  const value: DataContextType = {
    products,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    categoriesError,
    refreshProducts,
    refreshCategories,
    invalidateProducts,
    invalidateCategories,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Hook for just products
export function useProducts() {
  const { products, productsLoading, productsError, refreshProducts, invalidateProducts } = useData();
  return { products, loading: productsLoading, error: productsError, refresh: refreshProducts, invalidate: invalidateProducts };
}

// Hook for just categories
export function useCategories() {
  const { categories, categoriesLoading, categoriesError, refreshCategories, invalidateCategories } = useData();
  return { categories, loading: categoriesLoading, error: categoriesError, refresh: refreshCategories, invalidate: invalidateCategories };
}

// Hook for finding a specific product by slug
export function useProduct(slug: string) {
  const { products, productsLoading } = useData();
  const product = products.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  return { product, loading: productsLoading };
}

// Hook for finding products by category
export function useProductsByCategory(categoryId: string) {
  const { products, productsLoading } = useData();
  const categoryProducts = products.filter(p => p.category === categoryId);
  return { products: categoryProducts, loading: productsLoading };
}
