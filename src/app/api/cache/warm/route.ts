import { NextRequest, NextResponse } from 'next/server';
import { CacheWarmer } from '@/lib/cacheWarming';

// POST /api/cache/warm - Warm cache with critical data
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'all', 'products', 'categories', 'product', 'category'
    const identifier = searchParams.get('identifier'); // For specific product/category warming

    switch (type) {
      case 'products':
        await CacheWarmer.warmProducts();
        break;
      case 'categories':
        await CacheWarmer.warmCategories();
        break;
      case 'product':
        if (!identifier) {
          return NextResponse.json(
            { success: false, error: 'Product slug required for product warming' },
            { status: 400 }
          );
        }
        await CacheWarmer.warmProduct(identifier);
        break;
      case 'category':
        if (!identifier) {
          return NextResponse.json(
            { success: false, error: 'Category slug required for category warming' },
            { status: 400 }
          );
        }
        await CacheWarmer.warmCategory(identifier);
        break;
      case 'all':
      default:
        await CacheWarmer.warmAll();
        break;
    }

    const stats = CacheWarmer.getStats();
    
    return NextResponse.json({
      success: true,
      message: `Cache warmed for ${type || 'all'}`,
      stats
    });
  } catch (error) {
    console.error('Error warming cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to warm cache' },
      { status: 500 }
    );
  }
}

// GET /api/cache/warm - Get cache statistics
export async function GET() {
  try {
    const stats = CacheWarmer.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cache statistics' },
      { status: 500 }
    );
  }
}
