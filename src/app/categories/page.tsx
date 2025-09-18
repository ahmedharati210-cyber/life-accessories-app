import { getCategories, getProducts } from '@/lib/data';
import { CategoriesPageClient } from './CategoriesPageClient';

// Enable static generation with revalidation
export const revalidate = 60; // 1 minute revalidation

export default async function CategoriesPage() {
  // Fetch data server-side
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <CategoriesPageClient 
      categories={categories}
      products={products}
    />
  );
}