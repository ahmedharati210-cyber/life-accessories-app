import { Area } from '@/types';
import areasData from '@/data/areas.json';


export class ShippingService {
  private areas: Area[] = areasData as Area[];

  /**
   * Get all available shipping areas
   */
  getAreas(): Area[] {
    return this.areas.filter(area => area.isAvailable);
  }

  /**
   * Get areas by city code
   */
  getAreasByCity(cityCode: string): Area[] {
    return this.areas.filter(area => 
      area.isAvailable && area.cityCode === cityCode
    );
  }

  /**
   * Find area by ID
   */
  getAreaById(areaId: string): Area | undefined {
    return this.areas.find(area => area.id === areaId);
  }

  /**
   * Find area by city and area codes
   */
  getAreaByCodes(cityCode: string, areaCode?: number): Area | undefined {
    return this.areas.find(area => 
      area.cityCode === cityCode && 
      (areaCode ? area.areaCode === areaCode : !area.areaCode)
    );
  }

  /**
   * Get basic shipping information for a given area
   */
  getShippingInfo(areaId: string): { deliveryFee: number; deliveryTime: string; estimatedDeliveryDate: string } | null {
    const area = this.getAreaById(areaId);
    
    if (!area || !area.isAvailable) {
      return null;
    }

    return {
      deliveryFee: area.deliveryFee,
      deliveryTime: area.deliveryTime,
      estimatedDeliveryDate: this.calculateDeliveryDate(area.deliveryTime)
    };
  }


  /**
   * Get delivery time estimate based on area
   */
  getDeliveryTimeEstimate(areaId: string): string {
    const area = this.getAreaById(areaId);
    return area?.deliveryTime || "غير متوفر";
  }


  /**
   * Calculate estimated delivery date
   */
  private calculateDeliveryDate(deliveryTime: string): string {
    const now = new Date();
    let daysToAdd = 1; // Default next day

    if (deliveryTime.includes('نفس اليوم')) {
      daysToAdd = 0; // Same day
    } else if (deliveryTime.includes('اليوم التالي')) {
      daysToAdd = 1; // Next day
    } else if (deliveryTime.includes('يومين')) {
      daysToAdd = 2; // Two days
    } else if (deliveryTime.includes('3 أيام')) {
      daysToAdd = 3; // Three days
    } else if (deliveryTime.includes('دقيقة')) {
      daysToAdd = 0; // Same day for minute-based delivery
    } else if (deliveryTime.includes('ساعة')) {
      const hours = parseInt(deliveryTime.match(/\d+/)?.[0] || '2');
      if (hours <= 3) {
        daysToAdd = 0; // Same day for short hour delivery
      } else if (hours <= 6) {
        daysToAdd = 1; // Next day for medium hour delivery
      } else {
        daysToAdd = 2; // Day after tomorrow for long delivery
      }
    }

    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + daysToAdd);

    return deliveryDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  /**
   * Get cities grouped by region
   */
  getCitiesByRegion(): Record<string, Area[]> {
    const cities: Record<string, Area[]> = {};

    this.areas.forEach(area => {
      if (!area.isAvailable) return;

      const region = this.getRegionByCityCode(area.cityCode);
      if (!cities[region]) {
        cities[region] = [];
      }
      
      // Only add if it's a main city (no areaCode) or if it's the first area for this city
      if (!area.areaCode || !cities[region].some(a => a.cityCode === area.cityCode)) {
        cities[region].push(area);
      }
    });

    return cities;
  }

  /**
   * Get region name by city code
   */
  private getRegionByCityCode(cityCode: string): string {
    const regionMap: Record<string, string> = {
      'TIP': 'طرابلس الكبرى',
      'GTIP': 'طرابلس الكبرى',
      'WTIP': 'طرابلس الكبرى',
      'JUZ': 'طرابلس الكبرى',
      'BEN': 'برقة',
      'MSR': 'مصراتة',
      'ZWY': 'الزاوية',
      'SBH': 'فزان',
      'DRN': 'برقة',
      'SUR': 'طرابلس الكبرى',
      'SUB': 'طرابلس الكبرى',
      'EJT': 'برقة',
      'MTR': 'طرابلس الكبرى',
      'ALAQ': 'برقة',
      'GLA': 'فزان',
      'TYG': 'فزان',
      'AWB': 'فزان',
      'MRZ': 'فزان',
      'YFR': 'فزان',
      'GAT': 'فزان',
      'RGB': 'فزان',
      'SPI': 'طرابلس الكبرى',
      'JFR': 'فزان',
      'GOB': 'طرابلس الكبرى',
      'WZH': 'طرابلس الكبرى',
      'WSD': 'طرابلس الكبرى',
      'WAZ': 'طرابلس الكبرى',
      'OTHER': 'مناطق أخرى'
    };

    return regionMap[cityCode] || 'مناطق أخرى';
  }

  /**
   * Search areas by name (Arabic or English)
   */
  searchAreas(query: string): Area[] {
    const lowercaseQuery = query.toLowerCase();
    return this.areas.filter(area => 
      area.isAvailable && (
        area.name.toLowerCase().includes(lowercaseQuery) ||
        area.nameEn.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
}

// Export singleton instance
export const shippingService = new ShippingService();
