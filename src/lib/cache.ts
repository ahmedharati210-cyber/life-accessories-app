/**
 * Simple in-memory cache system for products and categories
 * Perfect for small to medium e-commerce sites
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<unknown>>();
  
  // Default TTL values (in milliseconds)
  private readonly DEFAULT_TTL = {
    products: 5 * 60 * 1000, // 5 minutes
    categories: 30 * 60 * 1000, // 30 minutes
    product: 5 * 60 * 1000, // 5 minutes for single product
  };

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL.products,
    };
    this.cache.set(key, item);
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear cache by pattern (useful for invalidation)
   */
  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const [, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance
export const cache = new SimpleCache();

// Cache key generators
export const cacheKeys = {
  products: () => 'products:all',
  categories: () => 'categories:all',
  product: (slug: string) => `product:${slug}`,
  category: (slug: string) => `category:${slug}`,
  productsByCategory: (categorySlug: string) => `products:category:${categorySlug}`,
};

// Cache TTL constants
export const CACHE_TTL = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  PRODUCT: 5 * 60 * 1000, // 5 minutes
  CATEGORY: 30 * 60 * 1000, // 30 minutes
};

// Helper functions for common cache operations
export const cacheHelpers = {
  /**
   * Get products with cache
   */
  async getProducts<T>(): Promise<T | null> {
    return cache.get<T>(cacheKeys.products());
  },

  /**
   * Set products in cache
   */
  setProducts<T>(data: T): void {
    cache.set(cacheKeys.products(), data, CACHE_TTL.PRODUCTS);
  },

  /**
   * Get categories with cache
   */
  async getCategories<T>(): Promise<T | null> {
    return cache.get<T>(cacheKeys.categories());
  },

  /**
   * Set categories in cache
   */
  setCategories<T>(data: T): void {
    cache.set(cacheKeys.categories(), data, CACHE_TTL.CATEGORIES);
  },

  /**
   * Get single product with cache
   */
  async getProduct<T>(slug: string): Promise<T | null> {
    return cache.get<T>(cacheKeys.product(slug));
  },

  /**
   * Set single product in cache
   */
  setProduct<T>(slug: string, data: T): void {
    cache.set(cacheKeys.product(slug), data, CACHE_TTL.PRODUCT);
  },

  /**
   * Invalidate all product-related cache
   */
  invalidateProducts(): void {
    cache.clearPattern('^products?:');
    cache.clearPattern('^product:');
  },

  /**
   * Invalidate all category-related cache
   */
  invalidateCategories(): void {
    cache.clearPattern('^categories?:');
    cache.clearPattern('^category:');
  },

  /**
   * Invalidate all cache
   */
  invalidateAll(): void {
    cache.clear();
  },
};

// Auto cleanup every 10 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}
