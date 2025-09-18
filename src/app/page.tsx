import { getProducts, getCategories } from '@/lib/data';
import { HomePageClient } from './HomePageClient';

// Enable static generation with revalidation
export const revalidate = 60; // 1 minute revalidation

export default async function HomePage() {
  // Fetch data server-side
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // Get featured products
  const featuredProducts = products
    .filter(product => product.isFeatured)
    .slice(0, 8);

  return (
    <HomePageClient 
      products={products}
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
