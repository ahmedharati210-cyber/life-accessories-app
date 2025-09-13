import { NextRequest, NextResponse } from 'next/server';
import { StockService } from '@/lib/services/stockService';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (in production, add proper authentication)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for low stock alerts
    const alerts = await StockService.checkLowStockAlerts();
    
    console.log(`Stock alert check completed. Found ${alerts.length} alerts.`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      alertsFound: alerts.length,
      alerts: alerts.map(alert => ({
        productId: alert.productId,
        productName: alert.productName,
        currentStock: alert.currentStock,
        alertType: alert.alertType
      }))
    });
  } catch (error) {
    console.error('Error in stock alerts cron job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow POST for external cron services
export async function POST(request: NextRequest) {
  return GET(request);
}
