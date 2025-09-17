import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    if (!cloudinary) {
      throw new Error('Cloudinary not initialized');
    }
    
    // Test Cloudinary connection by getting account info
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      result
    });
  } catch (error) {
    console.error('Cloudinary test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Cloudinary connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
