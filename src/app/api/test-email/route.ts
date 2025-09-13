import { NextResponse } from 'next/server';
import { emailService } from '@/lib/services/emailService';

export async function GET() {
  try {
    // Test email data
    const testData = {
      orderNumber: 'TEST-123456',
      customerName: 'Test Customer',
      customerEmail: 'lifeaccessoriesly@gmail.com', // Send to your email for testing
      customerPhone: '+218912345678',
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          unitPrice: 100,
          total: 100
        }
      ],
      subtotal: 100,
      deliveryFee: 10,
      total: 110,
      area: 'طرابلس - سوق الجمعة',
      addressNote: 'Test address note',
      orderDate: new Date().toISOString()
    };

    // Send test order confirmation email
    const result = await emailService.sendOrderConfirmation(testData);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: result
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
