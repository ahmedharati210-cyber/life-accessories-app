import { getCollections } from '@/lib/database';
import { AdminProduct, AdminCategory } from '@/types';

export class ProductService {
  // Get all products with optional filtering
  static async getProducts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<AdminProduct[]> {
    const { products } = await getCollections();
    
    let query = {};
    
    if (filters?.category) {
      query = { ...query, category: filters.category };
    }
    
    if (filters?.featured !== undefined) {
      query = { ...query, featured: filters.featured };
    }

    const cursor = products.find(query);
    
    if (filters?.limit) {
      cursor.limit(filters.limit);
    }

    return await cursor.toArray() as unknown as AdminProduct[];
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<AdminProduct | null> {
    const { products } = await getCollections();
    return await products.findOne({ slug }) as AdminProduct | null;
  }

  // Get products by category
  static async getProductsByCategory(categorySlug: string): Promise<AdminProduct[]> {
    const { products } = await getCollections();
    return await products.find({ category: categorySlug }).toArray() as unknown as AdminProduct[];
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<AdminProduct[]> {
    return await this.getProducts({ featured: true, limit });
  }

  // Search products
  static async searchProducts(query: string): Promise<AdminProduct[]> {
    const { products } = await getCollections();
    return await products.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).toArray() as unknown as AdminProduct[];
  }

  // Create new product
  static async createProduct(product: Omit<AdminProduct, 'id'>): Promise<AdminProduct> {
    const { products } = await getCollections();
    // Remove _id if it exists to avoid MongoDB conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...productData } = product as Record<string, unknown>;
    const result = await products.insertOne(productData);
    return { ...product, id: result.insertedId.toString() };
  }

  // Update product
  static async updateProduct(slug: string, updates: Partial<AdminProduct>): Promise<AdminProduct | null> {
    const { products } = await getCollections();
    const result = await products.findOneAndUpdate(
      { slug },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result as AdminProduct | null;
  }

  // Delete product
  static async deleteProduct(slug: string): Promise<boolean> {
    const { products } = await getCollections();
    const result = await products.deleteOne({ slug });
    return result.deletedCount > 0;
  }
}

export class CategoryService {
  // Get all categories
  static async getCategories(): Promise<AdminCategory[]> {
    const { categories } = await getCollections();
    return await categories.find({}).toArray() as unknown as AdminCategory[];
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<AdminCategory | null> {
    const { categories } = await getCollections();
    return await categories.findOne({ slug }) as AdminCategory | null;
  }

  // Create new category
  static async createCategory(category: Omit<AdminCategory, 'id'>): Promise<AdminCategory> {
    const { categories } = await getCollections();
    // Remove _id if it exists to avoid MongoDB conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...categoryData } = category as Record<string, unknown>;
    const result = await categories.insertOne(categoryData);
    return { ...category, id: result.insertedId.toString() };
  }
}
