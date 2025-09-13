import { NextRequest, NextResponse } from 'next/server';
import { getIPStats, getBlockedIPs, blockIP } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');
    const action = searchParams.get('action');

    if (action === 'stats' && ip) {
      // Get statistics for a specific IP
      const stats = await getIPStats(ip);
      return NextResponse.json({ success: true, data: stats });
    }

    if (action === 'blocked') {
      // Get all blocked IPs
      const blockedIPs = await getBlockedIPs();
      return NextResponse.json({ success: true, data: blockedIPs });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in security API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ip, reason } = body;

    if (action === 'block' && ip && reason) {
      const result = await blockIP(ip, reason);
      return NextResponse.json({ success: result });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in security API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
