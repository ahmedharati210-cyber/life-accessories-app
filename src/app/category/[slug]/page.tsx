import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProducts } from '@/lib/data';
import { decodeSlug } from '@/lib/slug';
import { CategoryPageClient } from './CategoryPageClient';

// Enable static generation with revalidation
export const revalidate = 300; // 5 minutes

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeSlug(slug);
  
  // Fetch data server-side
  const [category, products] = await Promise.all([
    getCategoryBySlug(decodedSlug),
    getProducts()
  ]);

  if (!category) {
    notFound();
  }

  return (
    <CategoryPageClient 
      category={category}
      products={products}
    />
  );
}