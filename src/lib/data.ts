/**
 * Server-side data fetching utilities
 * This replaces client-side API calls for better performance
 */

import { getCollections } from '@/lib/database';
import { cacheHelpers } from '@/lib/cache';
import { Product, Category } from '@/types';

/**
 * Fetch products with server-side caching
 */
export async function getProducts(): Promise<Product[]> {
  try {
    // Check server-side cache first
    const cachedProducts = await cacheHelpers.getProducts<Product[]>();
    if (cachedProducts) {
      return cachedProducts;
    }

    // Fetch from database
    const { products } = await getCollections();
    
    // Use aggregation pipeline for better performance
    const allProducts = await products.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryStr: { $toString: '$category' } },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$categoryStr'] } } }
          ],
          as: 'categoryInfoByString'
        }
      },
      {
        $addFields: {
          categoryName: { 
            $ifNull: [
              { $arrayElemAt: ['$categoryInfo.name', 0] },
              { $arrayElemAt: ['$categoryInfoByString.name', 0] }
            ]
          },
          categorySlug: { 
            $ifNull: [
              { $arrayElemAt: ['$categoryInfo.slug', 0] },
              { $arrayElemAt: ['$categoryInfoByString.slug', 0] }
            ]
          }
        }
      },
      {
        $project: {
          categoryInfo: 0, // Remove the lookup array
          categoryInfoByString: 0 // Remove the second lookup array
        }
      }
    ]).toArray();


    // Transform to website format
    const websiteProducts: Product[] = allProducts.map(product => {
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
        category: product.categoryName || product.category,
        categorySlug: product.categorySlug || 'uncategorized',
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
        variants: (product.variants || []).map(variant => ({
          ...variant,
          inStock: (variant.stock || 0) > 0
        })),
        options: product.options || [],
        customerReviews: product.customerReviews || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    // Cache the result
    cacheHelpers.setProducts(websiteProducts);
    
    return websiteProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch categories with server-side caching
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // Check server-side cache first
    const cachedCategories = await cacheHelpers.getCategories<Category[]>();
    if (cachedCategories) {
      return cachedCategories;
    }

    // Fetch from database
    const { categories } = await getCollections();
    const allCategories = await categories.find({}).toArray();

    // Transform to website format
    const websiteCategories: Category[] = allCategories.map(category => ({
      id: category._id?.toString() || category.id,
      _id: category._id?.toString(),
      name: category.name,
      nameEn: category.nameEn || category.name,
      slug: category.slug,
      description: category.description,
      image: category.image || '/images/placeholder.svg',
      icon: category.icon || '📦',
      color: category.color || '#6366f1',
      productCount: 0, // Will be calculated separately if needed
    }));

    // Cache the result
    cacheHelpers.setCategories(websiteCategories);
    
    return websiteCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.categorySlug === categorySlug);
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}
