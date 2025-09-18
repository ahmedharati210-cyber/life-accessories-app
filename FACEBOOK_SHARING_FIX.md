# Facebook Sharing Fix

## Problem
When sharing your website link on Facebook, it only shows a plain link without any image, title, or description.

## Solution
Added proper Open Graph meta tags to enable rich previews on Facebook and other social media platforms.

## Changes Made

### 1. Root Layout (`src/app/layout.tsx`)
- ✅ Added `og:image` with proper dimensions (1200x630px)
- ✅ Added `og:image:alt` for accessibility
- ✅ Added Twitter card image
- ✅ Used hero-jewelry.jpeg as the default sharing image

### 2. Product Pages (`src/app/product/[slug]/page.tsx`)
- ✅ Added dynamic metadata generation
- ✅ Each product gets its own Open Graph tags
- ✅ Uses product image for sharing preview
- ✅ Fallback to placeholder if no product image

### 3. Category Pages (`src/app/category/[slug]/page.tsx`)
- ✅ Added dynamic metadata generation
- ✅ Each category gets its own Open Graph tags
- ✅ Uses category image for sharing preview

## Testing

### 1. Run the Test Script
```bash
cd /Users/macbookpro/Life\ /life-accessories
node scripts/test-facebook-sharing.js
```

### 2. Use Facebook Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your website URL: `https://life-accessories.vercel.app`
3. Click "Debug" to see how Facebook sees your page
4. Click "Scrape Again" to refresh the cache

### 3. Test Different Pages
- Homepage: `https://life-accessories.vercel.app`
- Product page: `https://life-accessories.vercel.app/product/[product-slug]`
- Category pages:
  - Chains: `https://life-accessories.vercel.app/category/salasil`
  - Rings: `https://life-accessories.vercel.app/category/khawatim`
  - Accessories: `https://life-accessories.vercel.app/category/accessories`
  - Sets: `https://life-accessories.vercel.app/category/atqam`

### 4. Test Category Images
```bash
cd /Users/macbookpro/Life\ /life-accessories
node scripts/test-category-og-images.js
```

## What's Fixed

### Before
- ❌ No image preview
- ❌ No title or description
- ❌ Plain link only

### After
- ✅ Rich image preview (1200x630px)
- ✅ Custom title and description
- ✅ Proper Arabic locale support
- ✅ Dynamic content for products/categories
- ✅ Twitter card support

## Image Requirements

### Open Graph Images
- **Size**: 1200x630px (recommended)
- **Format**: JPG, PNG, or WebP
- **File size**: Under 8MB
- **Aspect ratio**: 1.91:1

### Current Images Used
- **Homepage**: `/images/hero-jewelry.jpeg`
- **Products**: First product image or placeholder
- **Categories**: Custom Open Graph images for each category:
  - **سلاسل (Chains)**: `/images/categories/salasil-og.jpg`
  - **خواتم (Rings)**: `/images/categories/khawatim-og.jpg`
  - **اكسسوارات (Accessories)**: `/images/categories/accessories-og.jpg`
  - **أطقم (Sets)**: `/images/categories/atqam-og.jpg`

## Additional Recommendations

1. **Create a dedicated Open Graph image** with your logo and branding
2. **Test on different social platforms** (Twitter, LinkedIn, WhatsApp)
3. **Monitor social media analytics** to see engagement improvements
4. **Consider adding structured data** for better SEO

## Files Modified
- `src/app/layout.tsx` - Root metadata
- `src/app/product/[slug]/page.tsx` - Product metadata
- `src/app/category/[slug]/page.tsx` - Category metadata
- `scripts/test-facebook-sharing.js` - Testing script (new)
- `scripts/test-category-og-images.js` - Category testing script (new)
- `public/images/categories/salasil-og.jpg` - Chains Open Graph image (new)
- `public/images/categories/khawatim-og.jpg` - Rings Open Graph image (new)
- `public/images/categories/accessories-og.jpg` - Accessories Open Graph image (new)
- `public/images/categories/atqam-og.jpg` - Sets Open Graph image (new)

## Next Steps
1. Deploy your changes to Vercel
2. Test with Facebook Debugger
3. Share a link on Facebook to verify the fix
4. Monitor social media engagement improvements
