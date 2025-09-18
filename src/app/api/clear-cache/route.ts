import { NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/cache';

// POST /api/clear-cache - Clear all caches
export async function POST() {
  try {
    // Clear all caches
    cacheHelpers.invalidateAll();
    
    return NextResponse.json({
      success: true,
      message: 'All caches cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

// GET /api/clear-cache - Get cache status
export async function GET() {
  try {
    const stats = cacheHelpers.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}
