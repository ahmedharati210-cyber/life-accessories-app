'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuantityInput } from '@/components/features/QuantityInput';
import { useBag } from '@/contexts/BagContext';
import { formatPrice } from '@/lib/price';
import { ShoppingBag, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function BagPage() {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearBag } = useBag();
  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearBag = async () => {
    setIsClearing(true);
    // Reduced delay for snappier experience
    await new Promise(resolve => setTimeout(resolve, 200));
    clearBag();
    setIsClearing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-2">الحقيبة فارغة</h1>
                <p className="text-muted-foreground">
                  لم تقم بإضافة أي منتجات إلى حقيبتك بعد
                </p>
              </div>
              
              <Button asChild size="lg">
                <Link href="/">
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  تسوق الآن
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">حقيبة التسوق</h1>
                <p className="text-muted-foreground">
                  {totalItems} منتج في حقيبتك
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleClearBag}
              disabled={isClearing}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              {isClearing ? 'جاري المسح...' : 'مسح الكل'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                          {item.selectedVariant && (
                            <p className="text-sm text-blue-600 font-medium mb-1">
                              {item.selectedVariant.name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.product.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(item.unitPrice, item.product.currency)}
                            </span>
                            {item.product.isOnSale && item.product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(item.product.originalPrice, item.product.currency)}
                              </span>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">الكمية:</span>
                              <QuantityInput
                                value={item.quantity}
                                onChange={(qty) => handleQuantityChange(item.id, qty)}
                                min={1}
                                max={99}
                                size="sm"
                              />
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 ml-1" />
                              حذف
                            </Button>
                          </div>
                        </div>
                        
                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {formatPrice(item.unitPrice * item.quantity, item.product.currency)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>عدد المنتجات:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>المجموع الفرعي:</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>رسوم التوصيل:</span>
                      <span>سيتم حسابها عند الطلب</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>المجموع الكلي:</span>
                      <span className="text-primary">{formatPrice(subtotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      + رسوم التوصيل
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">
                        إتمام الطلب
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/">
                        متابعة التسوق
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
