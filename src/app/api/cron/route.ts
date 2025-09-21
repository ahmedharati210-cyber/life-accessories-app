import { NextRequest, NextResponse } from 'next/server';
import { StockService } from '@/lib/services/stockService';

// Daily cron job for stock alerts
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you can add authentication here)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check for low stock alerts and send notifications
    const alerts = await StockService.checkLowStockAlerts(true); // Send notifications
    
    return NextResponse.json({ 
      success: true, 
      message: `Checked ${alerts.length} stock alerts`,
      alertsCount: alerts.length
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
