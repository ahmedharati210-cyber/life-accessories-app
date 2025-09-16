import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { cacheHelpers } from '@/lib/cache';

// GET /api/website/categories - Get all categories for website
export async function GET() {
  try {
    // Check cache first
    const cachedCategories = await cacheHelpers.getCategories();
    if (cachedCategories) {
      const response = NextResponse.json({
        success: true,
        data: cachedCategories,
        cached: true
      });
      
      // Add cache headers for browser caching - much longer cache
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'); // 1 hour cache, 2 hours stale
      response.headers.set('X-Cache-Status', 'HIT');
      response.headers.set('X-Cache-TTL', '3600');
      
      return response;
    }

    // Fetch from database
    const { categories, products } = await getCollections();
    const allCategories = await categories.find({}).toArray();
    
    // Get product counts for each category
    const categoryProductCounts = await Promise.all(
      allCategories.map(async (category) => {
        // Try both ObjectId and string versions
        const count = await products.countDocuments({ 
          $or: [
            { category: category._id },
            { category: category._id.toString() }
          ]
        });
        return { categoryId: category._id, count };
      })
    );
    
    // Create a map for quick lookup
    const productCountMap = categoryProductCounts.reduce((acc, { categoryId, count }) => {
      acc[categoryId.toString()] = count;
      return acc;
    }, {} as Record<string, number>);
    
    // Transform database categories to website format
    const websiteCategories = allCategories.map(category => ({
      id: category._id?.toString() || category.id,
      name: category.name,
      nameEn: category.nameEn || category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon || 'sparkles',
      color: category.color || 'blue',
      productCount: productCountMap[category._id.toString()] || 0
    }));
    
    // Cache the result
    cacheHelpers.setCategories(websiteCategories);
    
    const response = NextResponse.json({
      success: true,
      data: websiteCategories,
      cached: false
    });
    
    // Add cache headers for browser caching - much longer cache
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'); // 1 hour cache, 2 hours stale
    response.headers.set('X-Cache-Status', 'MISS');
    response.headers.set('X-Cache-TTL', '3600');
    
    return response;
  } catch (error) {
    console.error('Error fetching categories for website:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
