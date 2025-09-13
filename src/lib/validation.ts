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
    pattern: /^[\u0600-\u06FF\s]+$/,
    custom: (value) => {
      if (value.length < 2) return 'يجب أن يكون الاسم حرفين على الأقل';
      if (value.length > 50) return 'يجب أن يكون الاسم 50 حرف على الأكثر';
      if (!/^[\u0600-\u06FF\s]+$/.test(value)) return 'يجب أن يحتوي الاسم على أحرف عربية فقط';
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^09\d{8}$/,
    custom: (value) => {
      const cleaned = value.replace(/\D/g, '');
      if (!/^09\d{8}$/.test(cleaned)) {
        return 'يجب أن يكون رقم الهاتف بصيغة 09XXXXXXXX';
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
          return 'البريد الإلكتروني غير صحيح';
        }
      }
      return null;
    }
  },
  area: {
    required: true,
    custom: (value) => {
      if (!value || value.trim() === '') {
        return 'يجب اختيار المنطقة';
      }
      return null;
    }
  },
  addressNote: {
    maxLength: 200,
    custom: (value) => {
      if (value && value.length > 200) {
        return 'يجب أن تكون ملاحظات العنوان 200 حرف على الأكثر';
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
