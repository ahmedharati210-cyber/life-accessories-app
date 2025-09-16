import { getProducts, getCategories } from '@/lib/data';
import { ProductsPageClient } from './ProductsPageClient';

// Enable static generation with revalidation
export const revalidate = 300; // 5 minutes

export default async function ProductsPage() {
  // Fetch data server-side
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <ProductsPageClient 
      products={products}
      categories={categories}
    />
  );
}