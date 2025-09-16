'use client';

import { useState, useEffect, useRef } from 'react';
import { Area } from '@/types';
import { shippingService } from '@/lib/services/shippingService';
import { ChevronDown, MapPin } from 'lucide-react';

interface CityAreaDropdownProps {
  value: string;
  onChange: (areaId: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

interface City {
  code: string;
  name: string;
  nameEn: string;
  areas: Area[];
}

export function CityAreaDropdown({ 
  value, 
  onChange, 
  error, 
  label = "المنطقة", 
  placeholder = "اختر المدينة والمنطقة" 
}: CityAreaDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load cities and areas on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const areas = shippingService.getAreas();
        // const citiesByRegion = shippingService.getCitiesByRegion();
        
        // Convert to city structure
        const citiesList: City[] = [];
        
        // Group areas by city code
        const areasByCity: Record<string, Area[]> = {};
        areas.forEach(area => {
          if (!areasByCity[area.cityCode]) {
            areasByCity[area.cityCode] = [];
          }
          areasByCity[area.cityCode].push(area);
        });

        // Create city objects
        Object.entries(areasByCity).forEach(([cityCode, cityAreas]) => {
          // Find the main city area (no areaCode) or use the first one
          const mainArea = cityAreas.find(area => !area.areaCode) || cityAreas[0];
          
          // Get city name from the main area
          const cityName = mainArea.name.includes(' - ') 
            ? mainArea.name.split(' - ')[0] 
            : mainArea.name;
          const cityNameEn = mainArea.nameEn.includes(' - ') 
            ? mainArea.nameEn.split(' - ')[0] 
            : mainArea.nameEn;
          
          citiesList.push({
            code: cityCode,
            name: cityName,
            nameEn: cityNameEn,
            areas: cityAreas.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
          });
        });

        // Sort cities by priority: TIP first, then MSR, ZWY, BEN, then others alphabetically
        citiesList.sort((a, b) => {
          const priorityOrder = ['TIP', 'MSR', 'ZWY', 'BEN'];
          const aIndex = priorityOrder.indexOf(a.code);
          const bIndex = priorityOrder.indexOf(b.code);
          
          // If both are in priority list, sort by priority order
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one is in priority list, prioritize it
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither is in priority list, sort alphabetically
          return a.name.localeCompare(b.name, 'ar');
        });
        
        setCities(citiesList);
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Find selected area and city when value changes
  useEffect(() => {
    if (value && cities.length > 0) {
      const area = shippingService.getAreaById(value);
      if (area) {
        setSelectedArea(area);
        const city = cities.find(c => c.code === area.cityCode);
        if (city) {
          setSelectedCity(city);
        }
      }
    }
  }, [value, cities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSelectedArea(null);
    // Don't close dropdown, let user select area
  };

  const handleAreaSelect = (area: Area) => {
    setSelectedArea(area);
    onChange(area.id);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayText = () => {
    if (selectedArea && selectedCity) {
      return `${selectedCity.name} - ${selectedArea.name}`;
    }
    return placeholder;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="p-3 border rounded-lg bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full p-3 text-right border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className={selectedArea ? 'text-gray-900' : 'text-gray-500'}>
                {getDisplayText()}
              </span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {!selectedCity ? (
              // Show cities
              <div className="py-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 bg-gray-50">
                  اختر المدينة
                </div>
                {cities.map((city, index) => (
                  <button
                    key={city.code || `city-${index}`}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{city.nameEn}</span>
                    <span className="font-medium">{city.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Show areas for selected city
              <div className="py-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="text-primary hover:text-primary-dark"
                  >
                    ← العودة للمدن
                  </button>
                  <span>{selectedCity.name}</span>
                </div>
                {selectedCity.areas.map((area, index) => (
                  <button
                    key={area.id || `area-${index}`}
                    onClick={() => handleAreaSelect(area)}
                    className="w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="text-sm text-gray-600">{area.nameEn}</div>
                      <div className="text-xs text-gray-500">
                        {area.deliveryTime} - {area.deliveryFee} د.ل
                      </div>
                    </div>
                    <span className="font-medium">{area.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
