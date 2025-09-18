'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Package,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductModal } from '@/components/admin/ProductModal';
import { AdminProduct, ProductVariant, ProductOption, CustomerReview } from '@/types';
import toast from 'react-hot-toast';


// Category interface
interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

// Raw database product interface (what /api/products returns)
interface DatabaseProduct {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  featured: boolean;
  inStock: boolean;
  stock: number;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  options?: ProductOption[];
  customerReviews?: CustomerReview[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [clearingCache, setClearingCache] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => (cat._id || cat.id) === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleEditProduct = (product: DatabaseProduct) => {
    // Convert Product to AdminProduct
    const adminProduct: AdminProduct = {
      id: product.id,
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      featured: product.featured,
      inStock: product.inStock,
      stock: product.stock,
      images: product.images,
      tags: product.tags,
      createdAt: product.createdAt,
      hasVariants: product.hasVariants || false,
      variants: product.variants || [],
      options: product.options || [],
      customerReviews: product.customerReviews || []
    };
    setEditingProduct(adminProduct);
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.success) {
          toast.success('Product deleted successfully');
          fetchProducts(); // Refresh the list
        } else {
          toast.error(data.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (productData: AdminProduct) => {
    try {

      const productId = editingProduct ? (editingProduct.id || editingProduct._id) : null;
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowProductModal(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const clearCache = async () => {
    setClearingCache(true);
    try {
      const response = await fetch('/api/clear-cache', {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Cache cleared! Website changes should now be visible.');
      } else {
        toast.error('Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
    } finally {
      setClearingCache(false);
    }
  };

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={clearCache} 
            disabled={clearingCache}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${clearingCache ? 'animate-spin' : ''}`} />
            {clearingCache ? 'Clearing...' : 'Clear Cache'}
          </Button>
          <Button onClick={handleAddProduct} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id || category.id || `category-${category.name}`} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
          <Card key={product.id || product._id || `product-${product.name}`} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  Out of Stock
                </Badge>
              )}
              {product.hasVariants && (
                <Badge className="absolute bottom-2 left-2 bg-blue-500 text-xs">
                  Variants
                </Badge>
              )}
              {product.customerReviews && product.customerReviews.length > 0 && (
                <Badge className="absolute bottom-2 right-2 bg-green-500 text-xs">
                  {product.customerReviews.length} Reviews
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500">{getCategoryName(product.category)}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id || product._id || '')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </>
  );
}
