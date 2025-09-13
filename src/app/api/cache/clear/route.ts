import { NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/cache';

// POST /api/cache/clear - Clear all cache
export async function POST() {
  try {
    cacheHelpers.invalidateAll();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
