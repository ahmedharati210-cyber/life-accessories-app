import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { cacheHelpers } from '@/lib/cache';

// GET /api/website/products - Get all products for website
export async function GET() {
  try {
    // Check cache first
    const cachedProducts = await cacheHelpers.getProducts();
    if (cachedProducts) {
      const response = NextResponse.json({
        success: true,
        data: cachedProducts,
        cached: true
      });
      
      // Add cache headers for browser caching
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'); // 5 minutes cache, 10 minutes stale
      response.headers.set('X-Cache-Status', 'HIT');
      response.headers.set('X-Cache-TTL', '300');
      
      return response;
    }

    // Fetch from database
    const { products, categories } = await getCollections();
    const allProducts = await products.find({}).toArray();
    
    // Fetch categories to resolve category names
    const allCategories = await categories.find({}).toArray();
    const categoryMap = new Map();
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), {
        name: cat.name,
        slug: cat.slug
      });
    });
    
    // Transform database products to website format
    const websiteProducts = allProducts.map(product => {
      // Resolve category name and slug from ObjectId
      const categoryId = product.category;
      const categoryInfo = categoryMap.get(categoryId) || { name: categoryId, slug: categoryId };
      
      // Only consider it on sale if originalPrice exists, is greater than 0, and is greater than current price
      const isOnSale = product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price;
      const salePercentage = isOnSale && product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
      
      return {
        id: product._id?.toString() || product.id,
        _id: product._id?.toString(),
        name: product.name,
        nameEn: product.nameEn || product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalPrice: (product.originalPrice && product.originalPrice > 0) ? product.originalPrice : null,
        category: categoryInfo.name,
        categorySlug: categoryInfo.slug,
        featured: product.featured,
        inStock: product.inStock,
        stock: product.stock || 0,
        images: product.images,
        thumbnail: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.svg',
        tags: product.tags,
        currency: product.currency || 'LYD',
        rating: product.rating || 4.5,
        reviews: product.reviews || Math.floor(Math.random() * 50) + 10,
        isNew: product.createdAt ? new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
        isFeatured: product.featured || false,
        isOnSale,
        salePercentage,
        specifications: product.specifications || {},
        hasVariants: product.hasVariants || false,
        variants: product.variants || [],
        options: product.options || [],
        customerReviews: product.customerReviews || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });
    

    // Cache the result
    cacheHelpers.setProducts(websiteProducts);
    
    const response = NextResponse.json({
      success: true,
      data: websiteProducts,
      cached: false
    });
    
    // Add cache headers for browser caching
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'); // 5 minutes cache, 10 minutes stale
    response.headers.set('X-Cache-Status', 'MISS');
    response.headers.set('X-Cache-TTL', '300');
    
    return response;
  } catch (error) {
    console.error('Error fetching products for website:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
