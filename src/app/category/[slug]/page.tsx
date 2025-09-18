import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProducts } from '@/lib/data';
import { decodeSlug } from '@/lib/slug';
import { CategoryPageClient } from './CategoryPageClient';
import { Metadata } from 'next';
import { Category } from '@/types';

// Enable static generation with revalidation
export const revalidate = 60; // 1 minute revalidation

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeSlug(slug);
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    return {
      title: 'Category Not Found - لايف أكسسوارز',
      description: 'The requested category could not be found.',
    };
  }

  // Use the actual category image for Open Graph
  const getCategoryOgImage = (category: Category) => {
    // Use the actual category image if it's a Cloudinary URL
    if (category.image?.startsWith('http')) {
      return category.image;
    }
    // Fallback to placeholder
    return `https://life-accessories.vercel.app${category.image || '/images/placeholder.svg'}`;
  };

  const categoryOgImage = getCategoryOgImage(category);
  const categoryUrl = `https://life-accessories.vercel.app/category/${slug}`;

  return {
    title: `${category.name} - لايف أكسسوارز`,
    description: category.description || `اكتشف مجموعة ${category.name} من لايف أكسسوارز`,
    openGraph: {
      title: `${category.name} - لايف أكسسوارز`,
      description: category.description || `اكتشف مجموعة ${category.name} من لايف أكسسوارز`,
      url: categoryUrl,
      siteName: 'لايف أكسسوارز',
      locale: 'ar_LY',
      type: 'website',
      images: [
        {
          url: categoryOgImage,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - لايف أكسسوارز`,
      description: category.description || `اكتشف مجموعة ${category.name} من لايف أكسسوارز`,
      images: [categoryOgImage],
    },
  };
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