import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { ObjectId } from 'mongodb';
import { cacheHelpers } from '@/lib/cache';

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { categories } = await getCollections();
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      );
    }
    
    // Generate slug from name - handle Arabic text
    let slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
    
    // If slug is empty (e.g., Arabic text), use a fallback
    if (!slug) {
      slug = `category-${Date.now()}`;
    }
    
    // Remove _id from the update data as MongoDB doesn't allow updating _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...bodyWithoutId } = body;
    
    const categoryData = {
      ...bodyWithoutId,
      slug,
      updatedAt: new Date().toISOString()
    };
    
    // Get category first to get the slug for cache invalidation
    const existingCategory = await categories.findOne({ _id: new ObjectId(id) });
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    await categories.updateOne(
      { _id: new ObjectId(id) },
      { $set: categoryData }
    );
    
    // Invalidate cache after updating category
    cacheHelpers.invalidateByType('category', existingCategory.slug);
    
    return NextResponse.json({
      success: true,
      data: { id, ...categoryData }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { categories } = await getCollections();
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      );
    }
    
    // Get category first to get the slug for cache invalidation
    const category = await categories.findOne({ _id: new ObjectId(id) });
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    await categories.deleteOne({ _id: new ObjectId(id) });
    
    // Invalidate cache after deleting category
    cacheHelpers.invalidateByType('category', category.slug);
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
