import { NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/cache';

// POST /api/cache/categories - Clear categories cache
export async function POST() {
  try {
    cacheHelpers.invalidateCategories();
    
    return NextResponse.json({
      success: true,
      message: 'Categories cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing categories cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear categories cache' },
      { status: 500 }
    );
  }
}
