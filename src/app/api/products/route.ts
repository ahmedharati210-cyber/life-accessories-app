import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { cacheHelpers } from '@/lib/cache';

// GET /api/products - Get all products
export async function GET() {
  try {
    const { products } = await getCollections();
    const allProducts = await products.find({}).toArray();
    
    // Ensure proper ID mapping
    const productsWithIds = allProducts.map(product => ({
      ...product,
      id: product._id.toString()
    }));
    
    return NextResponse.json({
      success: true,
      data: productsWithIds
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = await getCollections();
    
    const productData = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await products.insertOne(productData);
    
    // Invalidate products cache after creating new product
    cacheHelpers.invalidateByType('products');
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertedId.toString(), ...productData }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
