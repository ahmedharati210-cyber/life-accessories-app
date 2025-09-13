import { NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/cache';

// POST /api/cache/products - Clear products cache
export async function POST() {
  try {
    cacheHelpers.invalidateProducts();
    
    return NextResponse.json({
      success: true,
      message: 'Products cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing products cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear products cache' },
      { status: 500 }
    );
  }
}
