'use client';

import { Product } from '@/types';
import { Button } from '@/components/ui/Button';

interface ProductOptionsProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionId: string, valueId: string) => void;
}

export function ProductOptions({ product, selectedOptions, onOptionChange }: ProductOptionsProps) {
  if (!product.options || product.options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {product.options.map((option) => (
        <div key={option.id}>
          <h4 className="text-lg font-semibold mb-3">{option.name}</h4>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.id] === value.id;
              return (
                <Button
                  key={value.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onOptionChange(option.id, value.id)}
                  className="min-w-[80px]"
                >
                  {value.name}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
