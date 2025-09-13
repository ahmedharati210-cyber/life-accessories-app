'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBag } from '@/contexts/BagContext';
import { formatPrice } from '@/lib/price';
import Link from 'next/link';

export function MobileBagIndicator() {
  const { totalItems, subtotal, isLoaded } = useBag();
  const [isVisible, setIsVisible] = useState(true);

  if (!isLoaded || totalItems === 0 || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl md:hidden"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">
                {totalItems} عنصر في الحقيبة
              </p>
              <p className="text-xs text-muted-foreground">
                المجموع: {formatPrice(subtotal)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button asChild size="sm">
              <Link href="/bag">
                عرض الحقيبة
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
