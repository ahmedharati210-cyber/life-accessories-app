/**
 * Cache warming utilities for pre-populating critical data
 */

import { cacheHelpers } from './cache';
import { getCollections } from './database';

export class CacheWarmer {
  /**
   * Warm all critical cache data
   */
  static async warmAll(): Promise<void> {
    console.log('🔥 Starting cache warming...');
    
    try {
      await Promise.all([
        this.warmProducts(),
        this.warmCategories(),
      ]);
      
      console.log('✅ Cache warming completed successfully');
    } catch (error) {
      console.error('❌ Cache warming failed:', error);
      throw error;
    }
  }

  /**
   * Warm products cache
   */
  static async warmProducts(): Promise<void> {
    try {
      console.log('🔥 Warming products cache...');
      
      const { products } = await getCollections();
      const allProducts = await products.find({}).toArray();
      
      // Transform products for website display
      const websiteProducts = allProducts.map(product => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images || [],
        category: product.category,
        inStock: product.stock > 0,
        stock: product.stock,
        isNew: product.isNew || false,
        isOnSale: product.isOnSale || false,
        isFeatured: product.isFeatured || false,
        tags: product.tags || [],
        variants: product.variants || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      cacheHelpers.setProducts(websiteProducts);
      console.log(`✅ Products cache warmed with ${websiteProducts.length} products`);
    } catch (error) {
      console.error('❌ Failed to warm products cache:', error);
      throw error;
    }
  }

  /**
   * Warm categories cache
   */
  static async warmCategories(): Promise<void> {
    try {
      console.log('🔥 Warming categories cache...');
      
      const { categories, products } = await getCollections();
      const allCategories = await categories.find({}).toArray();
      const allProducts = await products.find({}).toArray();
      
      // Count products per category
      const productCountMap: Record<string, number> = {};
      allProducts.forEach(product => {
        const categoryId = product.category;
        productCountMap[categoryId] = (productCountMap[categoryId] || 0) + 1;
      });
      
      // Transform categories for website display
      const websiteCategories = allCategories.map(category => ({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: productCountMap[category._id.toString()] || 0
      }));

      cacheHelpers.setCategories(websiteCategories);
      console.log(`✅ Categories cache warmed with ${websiteCategories.length} categories`);
    } catch (error) {
      console.error('❌ Failed to warm categories cache:', error);
      throw error;
    }
  }

  /**
   * Warm cache for a specific product
   */
  static async warmProduct(slug: string): Promise<void> {
    try {
      console.log(`🔥 Warming product cache for: ${slug}`);
      
      const { products } = await getCollections();
      const product = await products.findOne({ slug });
      
      if (product) {
        const websiteProduct = {
          id: product._id.toString(),
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images || [],
          category: product.category,
          inStock: product.stock > 0,
          stock: product.stock,
          isNew: product.isNew || false,
          isOnSale: product.isOnSale || false,
          isFeatured: product.isFeatured || false,
          tags: product.tags || [],
          variants: product.variants || [],
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };

        cacheHelpers.setProduct(slug, websiteProduct);
        console.log(`✅ Product cache warmed for: ${slug}`);
      } else {
        console.warn(`⚠️ Product not found for warming: ${slug}`);
      }
    } catch (error) {
      console.error(`❌ Failed to warm product cache for ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Warm cache for a specific category
   */
  static async warmCategory(slug: string): Promise<void> {
    try {
      console.log(`🔥 Warming category cache for: ${slug}`);
      
      const { categories, products } = await getCollections();
      const category = await categories.findOne({ slug });
      
      if (category) {
        // Count products in this category
        const productCount = await products.countDocuments({ category: category._id.toString() });
        
        const websiteCategory = {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          productCount
        };

        cacheHelpers.setCategory(slug, websiteCategory);
        console.log(`✅ Category cache warmed for: ${slug}`);
      } else {
        console.warn(`⚠️ Category not found for warming: ${slug}`);
      }
    } catch (error) {
      console.error(`❌ Failed to warm category cache for ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    return cacheHelpers.getStats();
  }

  /**
   * Clear all cache
   */
  static clearAll(): void {
    console.log('🗑️ Clearing all cache...');
    cacheHelpers.invalidateAll();
    console.log('✅ All cache cleared');
  }
}

// Auto-warm cache on server startup in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Warm cache after a short delay to ensure database is ready
  setTimeout(() => {
    CacheWarmer.warmAll().catch(error => {
      console.error('Failed to warm cache on startup:', error);
    });
  }, 5000); // 5 second delay
}
