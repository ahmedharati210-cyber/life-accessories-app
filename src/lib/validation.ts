export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateForm<T extends Record<string, unknown>>(data: T, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    if (!rule) continue;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = 'هذا الحقل مطلوب';
      continue;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') continue;

    const stringValue = value.toString().trim();

    // Min length validation
    if (rule.minLength && stringValue.length < rule.minLength) {
      errors[field] = `يجب أن يكون طول النص ${rule.minLength} أحرف على الأقل`;
      continue;
    }

    // Max length validation
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      errors[field] = `يجب أن يكون طول النص ${rule.maxLength} أحرف على الأكثر`;
      continue;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      errors[field] = 'تنسيق غير صحيح';
      continue;
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(stringValue);
      if (customError) {
        errors[field] = customError;
        continue;
      }
    }
  }

  return errors;
}

// Common validation rules
export const commonRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[\u0600-\u06FFa-zA-Z\s]+$/,
    custom: (value) => {
      if (!value || value.trim() === '') return 'يرجى إدخال اسمك الكامل';
      if (value.length < 2) return 'الاسم قصير جداً، يرجى إدخال اسمك الكامل';
      if (value.length > 50) return 'الاسم طويل جداً، يرجى إدخال اسم أقصر';
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(value)) return 'يرجى إدخال اسم صحيح (أحرف عربية أو إنجليزية فقط)';
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^09\d{8}$/,
    custom: (value) => {
      if (!value || value.trim() === '') return 'يرجى إدخال رقم هاتفك';
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 0) return 'يرجى إدخال رقم هاتف صحيح';
      if (cleaned.length < 10) return 'رقم الهاتف ناقص، يرجى إدخال 10 أرقام';
      if (cleaned.length > 10) return 'رقم الهاتف طويل، يرجى إدخال 10 أرقام فقط';
      if (!/^09\d{8}$/.test(cleaned)) {
        return 'رقم الهاتف غير صحيح، يجب أن يبدأ بـ 09 ويحتوي على 10 أرقام';
      }
      return null;
    }
  },
  email: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (value && value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'البريد الإلكتروني غير صحيح، يرجى إدخال بريد إلكتروني صالح';
        }
      }
      return null;
    }
  },
  area: {
    required: true,
    custom: (value) => {
      if (!value || value.trim() === '') {
        return 'يرجى اختيار المدينة والمنطقة للتوصيل';
      }
      return null;
    }
  },
  addressNote: {
    maxLength: 200,
    custom: (value) => {
      if (value && value.length > 200) {
        return 'ملاحظات العنوان طويلة جداً، يرجى تقصيرها إلى 200 حرف أو أقل';
      }
      return null;
    }
  }
};

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  // Keep as 09XXXXXXXX format
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    return cleaned;
  }
  
  return phone;
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Libyan phone number validation
export function validateLibyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^09\d{8}$/.test(cleaned);
}
