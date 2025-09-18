import ProductPageClient from './ProductPageClient';
import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found - لايف أكسسوارز',
      description: 'The requested product could not be found.',
    };
  }

  const productImage = product.images?.[0] || '/images/placeholder.svg';
  const productUrl = `https://life-accessories.vercel.app/product/${slug}`;

  return {
    title: `${product.name} - لايف أكسسوارز`,
    description: product.description || `اكتشف ${product.name} من لايف أكسسوارز`,
    openGraph: {
      title: `${product.name} - لايف أكسسوارز`,
      description: product.description || `اكتشف ${product.name} من لايف أكسسوارز`,
      url: productUrl,
      siteName: 'لايف أكسسوارز',
      locale: 'ar_LY',
      type: 'website',
      images: [
        {
          url: productImage.startsWith('http') ? productImage : `https://life-accessories.vercel.app${productImage}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - لايف أكسسوارز`,
      description: product.description || `اكتشف ${product.name} من لايف أكسسوارز`,
      images: [productImage.startsWith('http') ? productImage : `https://life-accessories.vercel.app${productImage}`],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}