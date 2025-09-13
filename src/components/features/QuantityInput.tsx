'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
  size = 'md'
}: QuantityInputProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  const inputSizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg'
  };

  return (
    <div className={cn('flex items-center border rounded-lg overflow-hidden', className)}>
      {/* Decrement Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn(
          'rounded-none border-0 hover:bg-muted',
          sizeClasses[size]
        )}
      >
        <Minus className="w-4 h-4" />
      </Button>
      
      {/* Quantity Display */}
      <div
        className={cn(
          'flex items-center justify-center bg-background border-x min-w-[3rem] font-medium',
          inputSizeClasses[size],
          isAnimating && 'scale-110 transition-transform duration-150'
        )}
      >
        {value}
      </div>
      
      {/* Increment Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn(
          'rounded-none border-0 hover:bg-muted',
          sizeClasses[size]
        )}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
