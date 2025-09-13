'use client';

import { useState } from 'react';
import { Select, SelectOption } from '@/components/ui/Select';
import { Area } from '@/types';
import { formatPrice } from '@/lib/price';

interface AddressDropdownProps {
  areas: Area[];
  value: string;
  onChange: (areaId: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function AddressDropdown({
  areas,
  value,
  onChange,
  error,
  label = 'المنطقة',
  placeholder = 'اختر منطقتك',
  className
}: AddressDropdownProps) {
  const [selectedArea, setSelectedArea] = useState<Area | null>(
    areas.find(area => area.id === value) || null
  );

  const handleAreaChange = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    setSelectedArea(area || null);
    onChange(areaId);
  };

  const options: SelectOption[] = areas
    .filter(area => area.isAvailable)
    .map(area => ({
      value: area.id,
      label: `${area.name} - ${formatPrice(area.deliveryFee)} (${area.deliveryTime})`,
      disabled: !area.isAvailable
    }));

  return (
    <div className={className}>
      <Select
        options={options}
        value={value}
        onChange={(e) => handleAreaChange(e.target.value)}
        error={error}
        label={label}
        placeholder={placeholder}
      />
      
      {selectedArea && (
        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">رسوم التوصيل:</span>
            <span className="font-medium text-primary">
              {formatPrice(selectedArea.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-muted-foreground">وقت التوصيل:</span>
            <span className="font-medium">{selectedArea.deliveryTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
