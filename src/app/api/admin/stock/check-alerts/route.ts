import { NextResponse } from 'next/server';
import { StockService } from '@/lib/services/stockService';

export async function POST() {
  try {
    // Check for low stock alerts
    const alerts = await StockService.checkLowStockAlerts();
    
    return NextResponse.json({
      success: true,
      alertsFound: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    console.error('Error checking stock alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
