import { NextResponse } from 'next/server';
import { shippingService } from '@/lib/services/shippingService';

export async function GET() {
  try {
    const areas = shippingService.getAreas();
    
    return NextResponse.json({
      success: true,
      data: areas
    });
  } catch (error) {
    console.error('Error fetching shipping areas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch shipping areas' 
      },
      { status: 500 }
    );
  }
}
