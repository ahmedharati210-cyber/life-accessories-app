import { getProducts, getCategories } from '@/lib/data';
import { HomePageClient } from './HomePageClient';

// Enable static generation with revalidation
export const revalidate = 300; // 5 minutes

export default async function HomePage() {
  // Fetch data server-side
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // Get hot products (new or on sale)
  const hotProducts = products
    .filter(product => product.isNew || product.isOnSale)
    .slice(0, 8);

  return (
    <HomePageClient 
      products={products}
      categories={categories}
      hotProducts={hotProducts}
    />
  );
}
