# Database Setup Guide

This project uses **MongoDB Atlas** for data storage and **Cloudinary** for image management.

## 🚀 Quick Setup

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose the free M0 tier)
4. Create a database user with read/write permissions
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret from the dashboard

### 3. Environment Configuration

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-accessories?retryWrites=true&w=majority
   MONGODB_DATABASE=life-accessories
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Migrate Existing Data

```bash
node scripts/migrate-to-mongodb.js
```

## 📊 Database Schema

### Products Collection
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  price: number,
  originalPrice?: number,
  images: string[], // Cloudinary URLs
  category: string,
  featured: boolean,
  inStock: boolean,
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  image: string, // Cloudinary URL
  featured: boolean
}
```

### Orders Collection
```typescript
{
  _id: ObjectId,
  orderNumber: string,
  items: Array<{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    image: string
  }>,
  customer: {
    name: string,
    email: string,
    phone: string,
    address: {
      street: string,
      city: string,
      area: string,
      postalCode: string
    }
  },
  total: number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## 🖼️ Image Management

### Upload Images
```typescript
import { uploadImage } from '@/lib/cloudinary';

const imageUrl = await uploadImage(file, 'products');
```

### Get Optimized Images
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const optimizedUrl = getOptimizedImageUrl(publicId, 400, 300);
```

## 🔧 Usage Examples

### Get Products
```typescript
import { ProductService } from '@/lib/services/productService';

// Get all products
const products = await ProductService.getProducts();

// Get featured products
const featured = await ProductService.getFeaturedProducts(8);

// Search products
const results = await ProductService.searchProducts('watch');
```

### Upload Product Image
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('folder', 'products');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { imageUrl } = await response.json();
```

## 🆓 Free Tier Limits

### MongoDB Atlas
- 512MB storage
- Shared clusters
- No credit card required

### Cloudinary
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

## 🚨 Important Notes

1. **Never commit `.env.local`** - it contains sensitive credentials
2. **Use environment variables** for all configuration
3. **Optimize images** before upload to save bandwidth
4. **Monitor usage** to stay within free tier limits
5. **Backup data** regularly (MongoDB Atlas provides automated backups)

## 🔍 Troubleshooting

### Connection Issues
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits (10MB max for free tier)
- Ensure proper file format (jpg, png, gif, webp)

### Performance Issues
- Use Cloudinary's auto-optimization features
- Implement proper indexing in MongoDB
- Use pagination for large datasets
