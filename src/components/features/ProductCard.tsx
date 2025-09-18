'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { ProductImage } from '@/components/ui/CloudinaryImage';
import { Eye } from 'lucide-react';
import { formatPrice } from '@/lib/price';
import { 
  fadeInUp, 
  hoverLift, 
  luxuryTransitions,
  performanceProps
} from '@/lib/animations';
import { encodeSlug } from '@/lib/slug';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeInUp}
      initial={false}
      animate="visible"
      whileHover={shouldReduceMotion ? {} : hoverLift.whileHover}
      whileTap={shouldReduceMotion ? {} : hoverLift.whileTap}
      className="group"
      {...performanceProps}
    >
      <Card 
        className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg cursor-pointer h-full group-hover:shadow-purple-500/10"
        onClick={() => {
          window.location.href = `/product/${encodeSlug(product.slug)}`;
        }}
      >
        <div className="relative h-full flex flex-col">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden" style={{ position: 'relative' }}>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={luxuryTransitions.smooth}
              className="w-full h-full"
            >
              <ProductImage
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-full"
                priority={false}
              />
            </motion.div>
            
            {/* Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20"
              initial={{ opacity: 0 }}
              whileHover={shouldReduceMotion ? {} : { opacity: 1 }}
              transition={luxuryTransitions.smooth}
            />
            
            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge variant="success" className="text-xs">
                  جديد
                </Badge>
              )}
              {product.isOnSale && product.salePercentage && product.salePercentage > 0 && (
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
            
          </div>
          
          <CardContent className="p-4 flex-1 flex flex-col">
            {/* Product Info */}
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors h-14 flex items-start">
                {product.name}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 h-10 flex items-start">
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
              
              {/* Stock Status - Always reserve space */}
              <div className="h-6 flex items-center">
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
            </div>
            
            {/* View Product Button */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="mt-auto pt-4"
              transition={luxuryTransitions.snappy}
            >
              <Button
                className="w-full group/btn"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/product/${encodeSlug(product.slug)}`;
                }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileHover={shouldReduceMotion ? {} : { x: -2 }}
                  transition={luxuryTransitions.smooth}
                >
                  <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span>عرض المنتج</span>
                </motion.div>
              </Button>
            </motion.div>
          </CardContent>
          </div>
        </Card>
    </motion.div>
  );
});