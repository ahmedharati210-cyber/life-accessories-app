import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const { orders } = await getCollections();
    const allOrders = await orders.find({}).toArray();
    
    // Ensure proper ID mapping
    const ordersWithIds = allOrders.map(order => ({
      ...order,
      id: order._id.toString()
    }));
    
    return NextResponse.json({ success: true, data: ordersWithIds });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orders } = await getCollections();
    
    const newOrder = {
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    const result = await orders.insertOne(newOrder);
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertedId.toString(), ...newOrder },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
