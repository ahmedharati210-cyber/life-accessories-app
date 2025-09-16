import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { checkOrderSecurity, OrderSecurityData } from '@/lib/security';
import { notificationService } from '@/lib/services/notificationService';
import { StockService } from '@/lib/services/stockService';
import { OrderRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'الحقيبة فارغة' },
        { status: 400 }
      );
    }
    
    if (!body.customer?.name || !body.customer?.phone || !body.customer?.area) {
      return NextResponse.json(
        { ok: false, error: 'معلومات العميل مطلوبة' },
        { status: 400 }
      );
    }
    
    // Validate phone number format (should start with 09)
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(body.customer.phone)) {
      return NextResponse.json(
        { ok: false, error: 'رقم الهاتف يجب أن يبدأ بـ 09 ويحتوي على 10 أرقام' },
        { status: 400 }
      );
    }
    
    // Validate numeric values
    if (typeof body.subtotal !== 'number' || body.subtotal <= 0) {
      return NextResponse.json(
        { ok: false, error: 'المجموع الفرعي غير صحيح' },
        { status: 400 }
      );
    }
    
    if (typeof body.deliveryFee !== 'number' || body.deliveryFee < 0) {
      return NextResponse.json(
        { ok: false, error: 'رسوم التوصيل غير صحيحة' },
        { status: 400 }
      );
    }
    
    if (typeof body.total !== 'number' || body.total <= 0) {
      return NextResponse.json(
        { ok: false, error: 'المجموع الكلي غير صحيح' },
        { status: 400 }
      );
    }
    
    // Validate total calculation
    const expectedTotal = body.subtotal + body.deliveryFee;
    if (Math.abs(body.total - expectedTotal) > 0.01) {
      return NextResponse.json(
        { ok: false, error: 'حساب المجموع الكلي غير صحيح' },
        { status: 400 }
      );
    }

    // Validate stock availability
    const stockValidation = await StockService.validateStockAvailability(
      body.items.map(item => ({ id: item.id, quantity: item.qty }))
    );

    if (!stockValidation.valid) {
      const unavailableItems = stockValidation.unavailableItems
        .map(item => `${item.name}: طلب ${item.requested} متوفر ${item.available}`)
        .join(', ');
      
      return NextResponse.json(
        { 
          ok: false, 
          error: `بعض المنتجات غير متوفرة بالكمية المطلوبة: ${unavailableItems}` 
        },
        { status: 400 }
      );
    }
    
    // Security check
    const securityData: OrderSecurityData = {
      ipAddress: clientIp,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
      customerName: body.customer.name,
      customerPhone: body.customer.phone,
      orderTotal: body.total,
      timestamp: new Date().toISOString()
    };

    const securityCheck = await checkOrderSecurity(securityData);
    
    if (securityCheck.isBlocked) {
      console.log(`Order blocked for IP ${clientIp}. Reason: ${securityCheck.reason}. Risk Score: ${securityCheck.riskScore}`);
      return NextResponse.json(
        { ok: false, error: 'تم رفض الطلب لأسباب أمنية' },
        { status: 403 }
      );
    }

    // Log high-risk orders for review
    if (securityCheck.riskScore >= 30) {
      console.log(`High-risk order detected for IP ${clientIp}. Risk Score: ${securityCheck.riskScore}. Reason: ${securityCheck.reason}`);
    }
    
    // Save order to MongoDB
    const { orders, products } = await getCollections();
    
    // Fetch actual product names from database
    const productIds = body.items.map(item => item.id);
    console.log('Fetching products for IDs:', productIds);
    
    // Convert string IDs to ObjectIds
    const { ObjectId } = await import('mongodb');
    const objectIds = productIds.map(id => {
      try {
        return new ObjectId(id);
      } catch (error) {
        console.error('Invalid ObjectId:', id, error);
        return null;
      }
    }).filter((id): id is InstanceType<typeof ObjectId> => id !== null);
    
    const productDocs = await products.find({ _id: { $in: objectIds } }).toArray();
    console.log('Found products:', productDocs.map(p => ({ id: p._id.toString(), name: p.name })));
    const productMap = new Map(productDocs.map(p => [p._id.toString(), p]));
    
    const orderData = {
      orderNumber: `#${Math.floor(Math.random() * 9000) + 1000}`,
      items: body.items.map(item => {
        const product = productMap.get(item.id);
        const itemData = {
          id: item.id,
          name: product?.name || `Product ${item.id}`,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          total: item.qty * item.unitPrice
        };
        console.log('Item data:', itemData);
        return itemData;
      }),
      customer: {
        name: body.customer.name,
        email: body.customer.email || `${body.customer.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: body.customer.phone,
        address: {
          area: body.customer.area,
          note: body.customer.addressNote || ''
        }
      },
      customerName: body.customer.name,
      customerEmail: body.customer.email || `${body.customer.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      customerPhone: body.customer.phone,
      shippingAddress: {
        street: 'Unknown Street',
        city: 'Unknown City',
        area: body.customer.area,
        postalCode: '00000'
      },
      deliveryFee: body.deliveryFee,
      subtotal: body.subtotal,
      total: body.total,
      amount: body.total,
      status: 'pending',
      // Security and tracking data
      ipAddress: clientIp,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
      riskScore: securityCheck.riskScore,
      securityReason: securityCheck.reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await orders.insertOne(orderData);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { ok: false, error: 'فشل في حفظ الطلب' },
        { status: 500 }
      );
    }
    
    // Send notifications
    try {
      const notificationData = {
        orderNumber: orderData.orderNumber,
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        area: orderData.customer.address.area,
        addressNote: orderData.customer.address.note,
        orderDate: orderData.createdAt,
        ipAddress: orderData.ipAddress,
        riskScore: orderData.riskScore
      };

      // Send notifications asynchronously (don't wait for them to complete)
      notificationService.sendOrderNotifications(notificationData)
        .then(({ customerNotification, adminNotification }) => {
          console.log('Customer notification result:', customerNotification);
          console.log('Admin notification result:', adminNotification);
        })
        .catch(error => {
          console.error('Error sending notifications:', error);
        });
    } catch (notificationError) {
      console.error('Error preparing notifications:', notificationError);
      // Don't fail the order if notifications fail
    }
    
    return NextResponse.json({
      ok: true,
      id: result.insertedId.toString()
    });
    
  } catch (error) {
    console.error('Error processing order:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { ok: false, error: 'حدث خطأ أثناء معالجة الطلب', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
