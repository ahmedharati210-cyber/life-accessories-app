import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { notificationService } from '@/lib/services/notificationService';
import { ObjectId } from 'mongodb';

interface SendNotificationRequest {
  orderId: string;
  type: 'confirmation' | 'status_update' | 'admin_alert';
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingInfo?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();
    const { orderId, type, status, trackingInfo, estimatedDelivery, notes } = body;

    // Validate order ID
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
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

    let result;

    switch (type) {
      case 'confirmation':
        const confirmationData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: order.items.map((item: { name: string; quantity: number; unitPrice: number; total: number }) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
          })),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          area: order.shippingAddress?.area || order.customer?.area || 'Unknown',
          addressNote: order.customer?.addressNote,
          orderDate: order.createdAt,
          ipAddress: order.ipAddress,
          riskScore: order.riskScore
        };

        result = await notificationService.sendOrderConfirmation(confirmationData);
        break;

      case 'status_update':
        if (!status) {
          return NextResponse.json(
            { success: false, error: 'Status is required for status update notifications' },
            { status: 400 }
          );
        }

        const statusTexts = {
          'pending': 'قيد المراجعة',
          'confirmed': 'تم التأكيد',
          'shipped': 'تم الشحن',
          'delivered': 'تم التسليم',
          'cancelled': 'تم الإلغاء'
        };

        const statusUpdateData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          status: status,
          statusText: statusTexts[status],
          trackingInfo: trackingInfo,
          estimatedDelivery: estimatedDelivery,
          notes: notes
        };

        result = await notificationService.sendOrderStatusUpdate(statusUpdateData);
        break;

      case 'admin_alert':
        const adminData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: order.items.map((item: { name: string; quantity: number; unitPrice: number; total: number }) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
          })),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          area: order.shippingAddress?.area || order.customer?.area || 'Unknown',
          addressNote: order.customer?.addressNote,
          orderDate: order.createdAt,
          ipAddress: order.ipAddress,
          riskScore: order.riskScore
        };

        result = await notificationService.sendAdminNotification(adminData);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        orderId,
        orderNumber: order.orderNumber,
        notificationResult: result
      }
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
