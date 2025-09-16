'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CityAreaDropdown } from './CityAreaDropdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBag } from '@/contexts/BagContext';
import { Area } from '@/types';
import { formatPrice, calcTotal, getDeliveryFee } from '@/lib/price';
import { validateForm, commonRules, formatPhoneNumber as formatPhone } from '@/lib/validation';
import { ShoppingBag, User, MapPin, FileText } from 'lucide-react';

interface CheckoutFormProps {
  areas: Area[];
}

interface FormData extends Record<string, unknown> {
  name: string;
  phone: string;
  email: string;
  area: string;
  addressNote: string;
}

interface FormErrors {
  [key: string]: string | undefined;
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  addressNote?: string;
  general?: string;
}

export function CheckoutForm({ areas }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearBag } = useBag();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    area: '',
    addressNote: ''
  });

  // Calculate delivery fee using real price from areas list
  const deliveryFee = getDeliveryFee(formData.area, areas);
  const total = calcTotal(subtotal, deliveryFee);

  // Calculate form completion progress
  const requiredFields = ['name', 'phone', 'area'];
  const completedFields = requiredFields.filter(field => {
    const value = formData[field as keyof FormData];
    return value && value.toString().trim() !== '';
  });
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);


  const validateFormData = (): boolean => {
    const validationErrors = validateForm(formData, commonRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Real-time validation for better UX
    if (value.trim() !== '') {
      const fieldRules = { [field]: commonRules[field] };
      const fieldData = { [field]: value };
      const fieldErrors = validateForm(fieldData, fieldRules);
      
      if (fieldErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
      } else {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateFormData()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    if (items.length === 0) {
      setErrors({ general: 'الحقيبة فارغة، يرجى إضافة منتجات قبل إتمام الطلب' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          qty: item.quantity,
          unitPrice: item.unitPrice
        })),
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          area: formData.area,
          addressNote: formData.addressNote.trim()
        },
        deliveryFee,
        subtotal,
        total
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.ok && result.id) {
        clearBag();
        router.push(`/success?id=${result.id}`);
      } else {
        console.error('Order submission failed:', result);
        setErrors({ general: result.error || 'حدث خطأ أثناء إرسال الطلب' });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ general: 'حدث خطأ أثناء إرسال الطلب' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-xs sm:text-sm">
                <div className="flex-1 pr-2">
                  <div className="font-medium leading-tight">{item.product.name}</div>
                  {item.selectedVariant && (
                    <div className="text-xs text-blue-600 mt-1">
                      {item.selectedVariant.name}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    × {item.quantity}
                  </div>
                </div>
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                  {formatPrice(item.unitPrice * item.quantity, item.product.currency)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>المجموع الفرعي:</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>رسوم التوصيل:</span>
              <span className="font-medium">
                {deliveryFee > 0 ? formatPrice(deliveryFee) : 'مجاني'}
              </span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t pt-2">
              <span>المجموع الكلي:</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">معلومات الطلب</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Form Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-blue-900">يرجى ملء جميع الحقول المطلوبة</h4>
                <span className="text-sm text-blue-700 font-medium">
                  {completionPercentage}% مكتمل
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• الاسم الكامل (مطلوب)</p>
                <p>• رقم الهاتف بصيغة 09XXXXXXXX (مطلوب)</p>
                <p>• اختيار المدينة والمنطقة (مطلوب)</p>
                <p>• البريد الإلكتروني (اختياري)</p>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Customer Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                معلومات العميل
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Input
                    label="الاسم الكامل *"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                  {!errors.name && formData.name && (
                    <p className="text-xs text-green-600">✓ الاسم صحيح</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Input
                    label="رقم الهاتف *"
                    placeholder="09XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    error={errors.phone}
                    required
                  />
                  {!errors.phone && formData.phone && formData.phone.length === 10 && (
                    <p className="text-xs text-green-600">✓ رقم الهاتف صحيح</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Input
                  label="البريد الإلكتروني (اختياري)"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  type="email"
                />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  سنرسل لك إشعارات حول حالة طلبك عبر البريد الإلكتروني
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                معلومات التوصيل
              </h3>
              
              <div className="space-y-1">
                <CityAreaDropdown
                  value={formData.area}
                  onChange={(areaId) => handleInputChange('area', areaId)}
                  error={errors.area}
                  label="المنطقة *"
                  placeholder="اختر المدينة والمنطقة"
                />
                {!errors.area && formData.area && (
                  <p className="text-xs text-green-600">✓ تم اختيار المنطقة</p>
                )}
              </div>

              {/* Delivery Information Display */}
              {formData.area && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">معلومات التوصيل</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {areas.find(area => area.id === formData.area)?.deliveryTime || 'غير محدد'}
                      </p>
                    </div>
                    <div className="text-right sm:text-right">
                      <div className="text-base sm:text-lg font-bold text-blue-600">
                        {deliveryFee > 0 ? formatPrice(deliveryFee) : 'مجاني'}
                      </div>
                      <div className="text-xs text-gray-500">رسوم التوصيل</div>
                    </div>
                  </div>
                </div>
              )}
              
              <Input
                label="ملاحظات العنوان (اختياري)"
                placeholder="مثال: خلف المستشفى، بجانب المدرسة..."
                value={formData.addressNote}
                onChange={(e) => handleInputChange('addressNote', e.target.value)}
                helperText="أضف أي تفاصيل إضافية لتسهيل الوصول إليك"
              />
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full text-sm sm:text-base"
                size="lg"
                loading={isSubmitting}
                disabled={items.length === 0}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
