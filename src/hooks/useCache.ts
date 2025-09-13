/**
 * Simple frontend cache hook for API data
 * Provides basic caching with stale-while-revalidate pattern
 */

import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
}

class FrontendCache {
  private cache = new Map<string, CacheItem<unknown>>();
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

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

  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    
    // Consider stale after half the TTL
    return Date.now() - item.timestamp > item.ttl / 2;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
const frontendCache = new FrontendCache();

/**
 * Hook for caching API data with automatic revalidation
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    staleWhileRevalidate = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = frontendCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        
        // If data is stale and we have stale-while-revalidate, fetch in background
        if (staleWhileRevalidate && frontendCache.isStale(key)) {
          // Don't set loading to true, just fetch in background
          fetcher()
            .then((freshData) => {
              frontendCache.set(key, freshData, ttl);
              setData(freshData);
            })
            .catch((err) => {
              console.warn('Background fetch failed:', err);
              // Keep using stale data
            });
        }
        return;
      }
    }

    // Fetch fresh data
    setLoading(true);
    setError(null);

    try {
      const freshData = await fetcher();
      frontendCache.set(key, freshData, ttl);
      setData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, staleWhileRevalidate]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh function
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    frontendCache.delete(key);
    setData(null);
  }, [key]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
  };
}

/**
 * Hook for simple API calls with basic caching
 */
export function useApiCache<T>(
  url: string,
  options: UseCacheOptions = {}
) {
  const fetcher = useCallback(async (): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  }, [url]);

  return useCache(`api:${url}`, fetcher, options);
}

/**
 * Cache utilities for manual cache management
 */
export const cacheUtils = {
  /**
   * Set data in cache manually
   */
  set<T>(key: string, data: T, ttl?: number): void {
    frontendCache.set(key, data, ttl);
  },

  /**
   * Get data from cache manually
   */
  get<T>(key: string): T | null {
    return frontendCache.get<T>(key);
  },

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    frontendCache.delete(key);
  },

  /**
   * Clear all cache
   */
  clear(): void {
    frontendCache.clear();
  },

  /**
   * Clear cache by pattern
   */
  clearPattern(pattern: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const regex = new RegExp(pattern);
    // Note: This is a simplified implementation
    // In a real app, you'd want to track keys separately
    frontendCache.clear();
  },
};
