'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Product, ProductVariant, CartItem, UseBagReturn } from '@/types';
import { calcSubtotal } from '@/lib/price';

const BAG_STORAGE_KEY = 'lifeaccessories_bag_v1';

type BagContextType = UseBagReturn;

const BagContext = createContext<BagContextType | undefined>(undefined);

interface BagProviderProps {
  children: ReactNode;
}

export function BagProvider({ children }: BagProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const addingProductsRef = useRef<Set<string>>(new Set());
  const lastCallRef = useRef<{ productId: string; timestamp: number } | null>(null);

  // Load bag from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(BAG_STORAGE_KEY);
        if (stored) {
          const parsedItems = JSON.parse(stored);
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Error loading bag from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem(BAG_STORAGE_KEY);
      } finally {
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Save bag to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving bag to localStorage:', error);
      }
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1, selectedVariant?: ProductVariant, selectedOptions?: Record<string, string>) => {
    const now = Date.now();
    
    // Check if this is a duplicate call within 100ms
    if (lastCallRef.current && 
        lastCallRef.current.productId === product.id && 
        now - lastCallRef.current.timestamp < 100) {
      return;
    }
    
    // Update the last call reference
    lastCallRef.current = { productId: product.id, timestamp: now };
    
    // Prevent duplicate calls for the same product
    if (addingProductsRef.current.has(product.id)) {
      return;
    }
    
    // Add to the set immediately
    addingProductsRef.current.add(product.id);
    
    setItems(prevItems => {
      // Create unique ID for variant combinations
      const itemId = selectedVariant 
        ? `${product.id}-${selectedVariant.id}` 
        : product.id;
      
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        // Show success toast after state update
        setTimeout(() => {
          const variantName = selectedVariant ? ` (${selectedVariant.name})` : '';
          toast.success(
            `تم تحديث الكمية إلى ${existingItem.quantity + quantity} قطعة${variantName}`,
            {
              id: `update-${itemId}`,
              icon: '🛍️',
              duration: 1500,
            }
          );
        }, 0);
        
        return updatedItems;
      } else {
        // Add new item
        const unitPrice = selectedVariant?.price || product.price;
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          unitPrice,
          selectedVariant,
          selectedOptions,
        };
        
        const updatedItems = [...prevItems, newItem];
        
        // Show success toast after state update
        setTimeout(() => {
          const variantName = selectedVariant ? ` (${selectedVariant.name})` : '';
          toast.success(
            `تم إضافة ${product.name}${variantName} إلى الحقيبة`,
            {
              id: `add-${itemId}`,
              icon: '✅',
              duration: 1500,
            }
          );
        }, 0);
        
        return updatedItems;
      }
    });
    
    // Clear the adding state after a short delay
    setTimeout(() => {
      addingProductsRef.current.delete(product.id);
    }, 1000);
  }, []);

  const removeItem = useCallback((productId: string) => {
    // Clear the adding state for this product
    addingProductsRef.current.delete(productId);
    
    // Clear the last call reference if it's for this product
    if (lastCallRef.current?.productId === productId) {
      lastCallRef.current = null;
    }
    
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      const filteredItems = prevItems.filter(item => item.id !== productId);
      
      if (itemToRemove) {
        // Show success toast after state update
        setTimeout(() => {
          toast.success(
            `تم حذف ${itemToRemove.product.name} من الحقيبة`,
            {
              id: `remove-${productId}`,
              icon: '🗑️',
              duration: 1500,
            }
          );
        }, 0);
      }
      
      return filteredItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearBag = useCallback((showToast: boolean = true) => {
    setItems([]);
    if (showToast) {
      setTimeout(() => {
        toast.success('تم مسح الحقيبة بالكامل', {
          icon: '🧹',
          duration: 1500,
        });
      }, 0);
    }
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [items]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calcSubtotal(items);

  const value: UseBagReturn = {
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearBag,
    getItemQuantity,
    isLoaded,
  };

  return (
    <BagContext.Provider value={value}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag(): UseBagReturn {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
}
