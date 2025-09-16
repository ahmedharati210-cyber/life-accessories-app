import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { ObjectId } from 'mongodb';
import { cacheHelpers } from '@/lib/cache';

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { products } = await getCollections();
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }
    
    // Remove _id from the update data as MongoDB doesn't allow updating _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...bodyWithoutId } = body;
    
    const productData = {
      ...bodyWithoutId,
      updatedAt: new Date().toISOString()
    };
    
    // Get product first to get the slug for cache invalidation
    const existingProduct = await products.findOne({ _id: new ObjectId(id) });
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    await products.updateOne(
      { _id: new ObjectId(id) },
      { $set: productData }
    );
    
    // Invalidate cache after updating product
    cacheHelpers.invalidateByType('product', existingProduct.slug);
    
    return NextResponse.json({
      success: true,
      data: { id, ...productData }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { products } = await getCollections();
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }
    
    // Get product first to get the slug for cache invalidation
    const existingProduct = await products.findOne({ _id: new ObjectId(id) });
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    await products.deleteOne({ _id: new ObjectId(id) });
    
    // Invalidate cache after deleting product
    cacheHelpers.invalidateByType('product', existingProduct.slug);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
