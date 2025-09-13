'use client';

import { CheckoutForm } from '@/components/features/CheckoutForm';
import { Area } from '@/types';
import areasData from '@/data/areas.json';

const areas: Area[] = areasData as Area[];

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
            <p className="text-muted-foreground">
              أكمل طلبك بسهولة وأمان
            </p>
          </div>
          
          <CheckoutForm areas={areas} />
        </div>
      </div>
    </div>
  );
}
