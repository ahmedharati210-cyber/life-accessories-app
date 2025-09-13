import { NextRequest, NextResponse } from 'next/server';
import { cache, cacheHelpers } from '@/lib/cache';

// GET /api/admin/cache - Get cache statistics
export async function GET() {
  try {
    const stats = cache.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
      }
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cache statistics' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/cache - Clear cache
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'products', 'categories', or 'all'
    
    switch (type) {
      case 'products':
        cacheHelpers.invalidateProducts();
        break;
      case 'categories':
        cacheHelpers.invalidateCategories();
        break;
      case 'all':
      default:
        cacheHelpers.invalidateAll();
        break;
    }
    
    return NextResponse.json({
      success: true,
      message: `Cache cleared for ${type || 'all'}`
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
