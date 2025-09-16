import { CartItem } from '@/types';

/**
 * Calculate subtotal for cart items
 */
export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);
}

/**
 * Calculate total including delivery fee
 */
export function calcTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'LYD'): string {
  return `${price.toFixed(2)} ${currency}`;
}

/**
 * Calculate discount percentage
 */
export function calcDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Calculate savings amount
 */
export function calcSavings(originalPrice: number, salePrice: number): number {
  return Math.max(0, originalPrice - salePrice);
}

/**
 * Validate price range
 */
export function isValidPriceRange(minPrice: number, maxPrice: number): boolean {
  return minPrice >= 0 && maxPrice >= minPrice;
}

/**
 * Get delivery fee for area
 */
export function getDeliveryFee(areaId: string, areas: Array<{ id: string; deliveryFee: number }>): number {
  const area = areas.find(a => a.id === areaId);
  return area?.deliveryFee || 0;
}


/**
 * Round to 2 decimal places
 */
export function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate tax (if applicable)
 */
export function calcTax(subtotal: number, taxRate: number = 0): number {
  return roundToTwoDecimals(subtotal * taxRate);
}

/**
 * Calculate total with tax
 */
export function calcTotalWithTax(subtotal: number, deliveryFee: number, taxRate: number = 0): number {
  const tax = calcTax(subtotal, taxRate);
  return roundToTwoDecimals(subtotal + deliveryFee + tax);
}
