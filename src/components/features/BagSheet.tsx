'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuantityInput } from './QuantityInput';
import { useBag } from '@/contexts/BagContext';
import { formatPrice } from '@/lib/price';

interface BagSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BagSheet({ isOpen, onClose }: BagSheetProps) {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearBag } = useBag();

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearBag = () => {
    clearBag();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-semibold">الحقيبة</h2>
                {totalItems > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {totalItems}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">الحقيبة فارغة</h3>
                  <p className="text-muted-foreground mb-6">
                    أضف بعض المنتجات الرائعة إلى حقيبتك
                  </p>
                  <Button asChild onClick={onClose}>
                    <Link href="/">
                      تسوق الآن
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-xs text-blue-600 mb-1">
                            {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatPrice(item.unitPrice, item.product.currency)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <QuantityInput
                            value={item.quantity}
                            onChange={(qty) => handleQuantityChange(item.id, qty)}
                            min={1}
                            max={99}
                            size="sm"
                            className="w-fit"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatPrice(item.unitPrice * item.quantity, item.product.currency)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">المجموع الفرعي:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClearBag}
                    className="flex-1"
                  >
                    مسح الكل
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/bag">
                      عرض الحقيبة
                    </Link>
                  </Button>
                </div>
                
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    إتمام الطلب
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
