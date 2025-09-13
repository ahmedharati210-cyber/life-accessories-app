export interface ProductVariant {
  id: string;
  name: string;
  nameEn: string;
  price?: number;
  inStock: boolean;
  stock: number;
  image?: string;
  options: Record<string, string>;
}

export interface ProductOption {
  id: string;
  name: string;
  nameEn: string;
  values: Array<{
    id: string;
    name: string;
    nameEn: string;
  }>;
}

export interface CustomerReview {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  isVerified: boolean; // Admin verified review
  isApproved: boolean; // Admin approved for display
  createdAt: string;
  updatedAt: string;
  helpful: number; // Number of helpful votes
  images?: string[]; // Optional review images
}

export interface Product {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  categorySlug: string;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  tags: string[];
  specifications: Record<string, string | undefined>;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
  customerReviews?: CustomerReview[];
  hasVariants?: boolean; // Flag to indicate if product has variants
}

// Simplified Product interface for admin panel
export interface AdminProduct {
  id?: string;
  _id?: string; // MongoDB ObjectId as string
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
  createdAt?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  options?: ProductOption[];
  customerReviews?: CustomerReview[];
}

export interface Category {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  productCount?: number;
}

// Simplified Category interface for admin panel
export interface AdminCategory {
  id?: string;
  _id?: string; // MongoDB ObjectId as string
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  productCount?: number;
}

export interface Area {
  id: string;
  name: string;
  nameEn: string;
  deliveryFee: number;
  deliveryTime: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  selectedVariant?: ProductVariant;
  selectedOptions?: Record<string, string>; // optionId -> valueId mapping
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  area: string;
  addressNote?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderRequest {
  items: Array<{
    id: string;
    qty: number;
    unitPrice: number;
  }>;
  customer: Customer;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

export interface OrderResponse {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface BagState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface BagActions {
  addItem: (product: Product, quantity?: number, selectedVariant?: ProductVariant, selectedOptions?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBag: () => void;
  getItemQuantity: (productId: string) => number;
  isLoaded: boolean;
}

export type UseBagReturn = BagState & BagActions;

export interface FormErrors {
  name?: string;
  phone?: string;
  area?: string;
  general?: string;
}

export interface ApiError {
  message: string;
  field?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  search?: string;
}

export interface SortOption {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
  label: string;
}

export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface SeoData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}
