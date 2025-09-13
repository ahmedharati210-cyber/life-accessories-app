import { kv } from '@vercel/kv';
import { Order, OrderRequest, Product } from '@/types';

export async function saveOrder(orderData: OrderRequest): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    // Generate unique order ID
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order object
    const order: Order = {
      id: orderId,
      items: orderData.items.map(item => ({
        id: item.id,
        product: {} as Product, // We'll populate this from the products data
        quantity: item.qty,
        unitPrice: item.unitPrice,
      })),
      customer: orderData.customer,
      deliveryFee: orderData.deliveryFee,
      subtotal: orderData.subtotal,
      total: orderData.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Vercel KV
    await kv.set(`order:${orderId}`, order);
    
    // Add to orders list for easy retrieval
    await kv.lpush('orders:list', orderId);
    
    // Set expiration for 1 year (optional)
    await kv.expire(`order:${orderId}`, 31536000); // 1 year in seconds

    return { ok: true, id: orderId };
  } catch (error) {
    console.error('Error saving order to KV:', error);
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'فشل في حفظ الطلب' 
    };
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const order = await kv.get(`order:${orderId}`);
    return order as Order | null;
  } catch (error) {
    console.error('Error getting order from KV:', error);
    return null;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const orderIds = await kv.lrange('orders:list', 0, -1);
    const orders: Order[] = [];
    
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order as Order);
      }
    }
    
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting all orders from KV:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return false;
    }
    
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`order:${orderId}`, updatedOrder);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await kv.del(`order:${orderId}`);
    await kv.lrem('orders:list', 0, orderId);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}
