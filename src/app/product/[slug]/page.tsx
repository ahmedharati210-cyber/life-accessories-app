import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}