'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuantityInput } from '@/components/features/QuantityInput';
import { ProductCard } from '@/components/features/ProductCard';
import { useBag } from '@/contexts/BagContext';
import { Product, ProductVariant } from '@/types';
import { formatPrice, calcDiscountPercentage } from '@/lib/price';
import { useProduct, useData } from '@/contexts/DataContext';
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, Award } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const [headerHeight, setHeaderHeight] = useState('h-20');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem, getItemQuantity } = useBag();

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  // Use shared data context to get product and products
  const { product, loading } = useProduct(slug);
  const { products } = useData();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHeaderHeight(window.scrollY > 50 ? 'h-16' : 'h-20');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug || loading) return;
    
    if (!product) {
      console.warn('⚠ Product not found for slug:', slug);
      notFound();
      return;
    }
  }, [slug, product, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const quantityInBag = getItemQuantity(product.id);
  const relatedProducts = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Calculate current price based on selected variant
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const currentInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  
  // Check if we need a variant selection for products with variants
  const needsVariantSelection = product.hasVariants && product.variants && product.variants.length > 0;
  const hasValidVariantSelection = !needsVariantSelection || (selectedVariant && selectedVariant.stock > 0 && selectedVariant.inStock);

  // Handle option selection
  const handleOptionChange = (optionId: string, valueId: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionId]: valueId
    };
    setSelectedOptions(newSelectedOptions);

    // Find matching variant
    if (product.variants) {
      const matchingVariant = product.variants.find(variant => 
        Object.entries(newSelectedOptions).every(([key, value]) => 
          variant.options[key] === value
        )
      );
      setSelectedVariant(matchingVariant || null);
    }
  };

  const handleAddToBag = async () => {
    setIsAddingToBag(true);
    addItem(product, quantity, selectedVariant || undefined, selectedOptions);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAddingToBag(false);
  };

  return (
    <div className={`min-h-screen bg-muted/30 transition-all duration-300 ${
      headerHeight === 'h-16' ? 'pt-16' : 'pt-20'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 ml-1" />
                الرئيسية
              </Link>
            </Button>
            <span>/</span>
            <Link href={`/category/${product.categorySlug}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge variant="success">جديد</Badge>
                  )}
                  {product.isOnSale && product.salePercentage && (
                    <Badge variant="destructive">-{product.salePercentage}%</Badge>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} تقييم)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(currentPrice, product.currency)}
                  </span>
                  {product.isOnSale && product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        وفر {formatPrice(product.originalPrice - currentPrice, product.currency)}
                      </Badge>
                    </>
                  )}
                </div>
                
                {product.isOnSale && product.salePercentage && product.salePercentage > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    خصم {product.salePercentage}% - وفر {formatPrice(calcDiscountPercentage(product.originalPrice || 0, currentPrice), product.currency)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                {currentInStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-sm font-medium">
                      متوفر
                      {currentStock < 10 && (
                        <span className="text-orange-600 font-bold"> - فقط {currentStock} قطعة متبقية!</span>
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <div className="w-2 h-2 bg-destructive rounded-full" />
                    <span className="text-sm font-medium">غير متوفر</span>
                  </div>
                )}
                
                {/* Low Stock Warning */}
                {currentInStock && currentStock <= 3 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-orange-800">
                        ⚠️ مخزون محدود جداً! أسرع قبل نفاد الكمية
                      </span>
                    </div>
                  </div>
                )}
              </div>


              {/* Product Options */}
              {product.options && product.options.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">اختر الخيارات:</h4>
                  {needsVariantSelection && !hasValidVariantSelection && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        ⚠️ يرجى اختيار خيارات متاحة لإضافة المنتج للحقيبة
                      </p>
                    </div>
                  )}
                  {product.options.map((option) => (
                    <div key={option.id}>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">{option.name}</h5>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const isSelected = selectedOptions[option.id] === value.id;
                          
                          // Check if this value combination would result in an available variant
                          const testOptions = {
                            ...selectedOptions,
                            [option.id]: value.id
                          };
                          
                          const hasAvailableVariant = product.variants?.some(variant => 
                            Object.entries(testOptions).every(([key, val]) => 
                              variant.options[key] === val
                            ) && variant.stock > 0 && variant.inStock
                          ) || false;
                          
                          const isDisabled = !hasAvailableVariant && !isSelected;
                          
                          return (
                            <button
                              key={value.id}
                              onClick={() => !isDisabled && handleOptionChange(option.id, value.id)}
                              disabled={isDisabled}
                              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-md transform scale-105'
                                  : isDisabled
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                              }`}
                            >
                              {value.name}
                              {isDisabled && (
                                <span className="ml-1 text-xs">(غير متوفر)</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity and Add to Bag */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">الكمية:</span>
                  <QuantityInput
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={currentStock}
                    disabled={!currentInStock || !hasValidVariantSelection}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToBag}
                    disabled={!currentInStock || !hasValidVariantSelection || isAddingToBag}
                    className="flex-1"
                    size="lg"
                    loading={isAddingToBag}
                  >
                    {isAddingToBag 
                      ? 'جاري الإضافة...' 
                      : !hasValidVariantSelection 
                        ? 'يرجى اختيار خيارات متاحة'
                        : quantityInBag > 0 ? `أضف ${quantity} للحقيبة` : 'أضف للحقيبة'
                    }
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>توصيل سريع</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>دفع آمن</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span>منتج عالي الجودة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications - with null check */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-16">
              <Card>
                <CardHeader>
                  <CardTitle>مواصفات المنتج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer Reviews */}
          {product.customerReviews && product.customerReviews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">تقييمات العملاء</h2>
              <div className="space-y-6">
                {product.customerReviews
                  .filter(review => review.isApproved)
                  .map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating ? 'fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            {review.isVerified && (
                              <Badge variant="success" className="text-xs">
                                موثق
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        
                        {review.helpful > 0 && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <span>مفيد ({review.helpful})</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">منتجات مشابهة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct: Product) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
