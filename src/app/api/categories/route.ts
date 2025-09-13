import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/database';
import { cacheHelpers } from '@/lib/cache';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const { categories, products } = await getCollections();
    const allCategories = await categories.find({}).toArray();
    
    // Get product counts for each category
    const categoryProductCounts = await Promise.all(
      allCategories.map(async (category) => {
        const count = await products.countDocuments({ category: category._id });
        return { categoryId: category._id, count };
      })
    );
    
    // Create a map for quick lookup
    const productCountMap = categoryProductCounts.reduce((acc, { categoryId, count }) => {
      acc[categoryId.toString()] = count;
      return acc;
    }, {} as Record<string, number>);
    
    // Add product counts to categories and ensure proper ID mapping
    const categoriesWithCounts = allCategories.map(category => ({
      ...category,
      id: category._id.toString(), // Ensure id field is always a string
      productCount: productCountMap[category._id.toString()] || 0
    }));
    
    return NextResponse.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories } = await getCollections();
    
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
    
    const categoryData = {
      ...body,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await categories.insertOne(categoryData);
    
    // Invalidate all cache after creating category (affects both categories and products)
    cacheHelpers.invalidateAll();
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertedId.toString(), ...categoryData }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
