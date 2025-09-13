import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { notificationService } from '@/lib/services/notificationService';
import { StockService } from '@/lib/services/stockService';
import { ObjectId } from 'mongodb';

interface StatusUpdateRequest {
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingInfo?: string;
  estimatedDelivery?: string;
  notes?: string;
}

const statusTexts = {
  'pending': 'قيد المراجعة',
  'confirmed': 'تم التأكيد',
  'shipped': 'تم الشحن',
  'delivered': 'تم التسليم',
  'cancelled': 'تم الإلغاء'
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body: StatusUpdateRequest = await request.json();

    // Validate order ID
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const { orders } = await getCollections();
    const objectId = new ObjectId(orderId);

    // Find the order
    const order = await orders.findOne({ _id: objectId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Handle stock updates based on status change
    if (body.status === 'confirmed' && order.status !== 'confirmed') {
      // Decrease stock when order is confirmed
      try {
        await StockService.processOrderStockUpdate(
          orderId,
          order.items.map((item: { id: string; quantity: number }) => ({ id: item.id, quantity: item.quantity }))
        );
      } catch (stockError) {
        console.error('Error updating stock for confirmed order:', stockError);
        // Continue with order update even if stock update fails
      }
    } else if (body.status === 'cancelled' && order.status === 'confirmed') {
      // Restore stock when confirmed order is cancelled
      try {
        await StockService.processOrderStockUpdate(
          orderId,
          order.items.map((item: { id: string; quantity: number }) => ({ id: item.id, quantity: -item.quantity }))
        );
      } catch (stockError) {
        console.error('Error restoring stock for cancelled order:', stockError);
        // Continue with order update even if stock update fails
      }
    }

    // Update the order
    const updateData = {
      status: body.status,
      updatedAt: new Date().toISOString(),
      ...(body.trackingInfo && { trackingInfo: body.trackingInfo }),
      ...(body.estimatedDelivery && { estimatedDelivery: body.estimatedDelivery }),
      ...(body.notes && { notes: body.notes })
    };

    const result = await orders.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send status update notification
    try {
      const notificationData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        status: body.status,
        statusText: statusTexts[body.status],
        trackingInfo: body.trackingInfo,
        estimatedDelivery: body.estimatedDelivery,
        notes: body.notes
      };

      // Send notification asynchronously
      notificationService.sendOrderStatusUpdate(notificationData)
        .then(result => {
          console.log('Status update notification result:', result);
        })
        .catch(error => {
          console.error('Error sending status update notification:', error);
        });
    } catch (notificationError) {
      console.error('Error preparing status update notification:', notificationError);
      // Don't fail the update if notification fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        status: body.status,
        statusText: statusTexts[body.status],
        updatedAt: updateData.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Validate order ID
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const { orders } = await getCollections();
    const objectId = new ObjectId(orderId);

    const order = await orders.findOne(
      { _id: objectId },
      { 
        projection: { 
          _id: 1, 
          orderNumber: 1, 
          status: 1, 
          trackingInfo: 1, 
          estimatedDelivery: 1, 
          notes: 1, 
          updatedAt: 1 
        } 
      }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        statusText: statusTexts[order.status as keyof typeof statusTexts],
        trackingInfo: order.trackingInfo,
        estimatedDelivery: order.estimatedDelivery,
        notes: order.notes,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching order status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
