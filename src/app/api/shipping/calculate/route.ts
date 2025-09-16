import { NextRequest, NextResponse } from 'next/server';
import { shippingService } from '@/lib/services/shippingService';

export async function POST(request: NextRequest) {
  try {
    const { areaId } = await request.json();

    if (!areaId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Area ID is required' 
        },
        { status: 400 }
      );
    }

    const shippingInfo = shippingService.getShippingInfo(areaId);

    if (!shippingInfo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Shipping not available for this area' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...shippingInfo,
        deliveryTimeEstimate: shippingService.getDeliveryTimeEstimate(areaId)
      }
    });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate shipping' 
      },
      { status: 500 }
    );
  }
}
