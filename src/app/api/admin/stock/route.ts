import { NextRequest, NextResponse } from 'next/server';
import { StockService } from '@/lib/services/stockService';

// Get stock alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'alerts') {
      const alerts = await StockService.checkLowStockAlerts(false); // Don't send notifications
      return NextResponse.json({ success: true, alerts });
    }

    if (type === 'history') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const productId = searchParams.get('productId');

      if (productId) {
        const history = await StockService.getStockHistory(productId, limit);
        return NextResponse.json({ success: true, history });
      } else {
        const result = await StockService.getAllStockHistory(page, limit);
        return NextResponse.json({ success: true, ...result });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in stock API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Adjust stock manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, newStock, reason, adminId } = body;

    if (!productId || typeof newStock !== 'number' || !reason || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await StockService.adjustStock(productId, newStock, reason, adminId);

    if (result.success) {
      return NextResponse.json({ success: true, newStock: result.newStock || 0 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
