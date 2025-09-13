'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { formatPrice } from '@/lib/price';
import { useBag } from '@/contexts/BagContext';

interface ProductCardProps {
  product: Product;
  onAddToBag?: (product: Product) => void;
}

export function ProductCard({ product, onAddToBag }: ProductCardProps) {
  const { addItem, getItemQuantity, isLoaded } = useBag();
  const quantityInBag = getItemQuantity(product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Handle success animation timing
  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  // Handle adding state reset
  useEffect(() => {
    if (isAdding) {
      const timer = setTimeout(() => setIsAdding(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAdding]);

  const handleAddToBag = () => {
    if (isAdding) return;
    
    setIsAdding(true);
    addItem(product, 1);
    onAddToBag?.(product);
    
    // Show success animation
    setJustAdded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link 
        href={`/product/${product.slug}`} 
        className="block"
        onClick={() => console.log('🔗 ProductCard: Navigating to product:', product.slug)}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge variant="success" className="text-xs">
                  جديد
                </Badge>
              )}
              {product.isOnSale && product.salePercentage && (
                <Badge variant="destructive" className="text-xs">
                  -{product.salePercentage}%
                </Badge>
              )}
            </div>
            
            {/* Variant and Review Indicators */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1">
              {product.hasVariants && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  متغيرات
                </Badge>
              )}
              {product.customerReviews && product.customerReviews.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {product.customerReviews.length} تقييم
                </Badge>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="w-8 h-8 rounded-full shadow-lg"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.isOnSale && product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              {!product.inStock ? (
                <Badge variant="destructive" className="text-xs">
                  غير متوفر
                </Badge>
              ) : product.stock < 10 ? (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  فقط {product.stock} متبقي!
                </Badge>
              ) : null}
            </div>
            
            {/* Add to Bag Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 relative"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToBag();
                }}
                disabled={!product.inStock || isAdding || !isLoaded}
                className="w-full relative overflow-hidden"
                variant={quantityInBag > 0 ? "secondary" : "default"}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>جاري الإضافة...</span>
                    </motion.div>
                  ) : justAdded ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>تمت الإضافة!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {quantityInBag > 0 ? `في الحقيبة (${quantityInBag})` : 'أضف للحقيبة'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
              
              {/* Success pulse effect */}
              <AnimatePresence>
                {justAdded && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-green-500/20 rounded-md pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </div>
        </Card>
      </Link>
    </motion.div>
  );
}
