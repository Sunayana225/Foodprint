// Comprehensive validation utilities for FoodPrint application

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationRule {
  field: string;
  value: any;
  rules: string[];
  customMessage?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length < 8) {
      warnings.push('Consider using a password with 8+ characters for better security');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      warnings.push('Consider including lowercase letters');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      warnings.push('Consider including uppercase letters');
    }
    if (!/(?=.*\d)/.test(password)) {
      warnings.push('Consider including numbers');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      warnings.push('Consider including special characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Display name validation
export const validateDisplayName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Display name is required');
  } else if (name.length < 2) {
    errors.push('Display name must be at least 2 characters long');
  } else if (name.length > 50) {
    errors.push('Display name must be less than 50 characters');
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Display name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Meal validation
export const validateMeal = (mealData: {
  name?: string;
  ingredients?: string[];
  category?: string;
  calories?: number;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!mealData.name || mealData.name.trim().length === 0) {
    errors.push('Meal name is required');
  } else if (mealData.name.length > 100) {
    errors.push('Meal name must be less than 100 characters');
  }
  
  if (!mealData.ingredients || mealData.ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  } else if (mealData.ingredients.length > 20) {
    errors.push('Maximum 20 ingredients allowed per meal');
  }
  
  if (!mealData.category) {
    errors.push('Meal category is required');
  } else if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealData.category)) {
    errors.push('Invalid meal category');
  }
  
  if (mealData.calories !== undefined) {
    if (mealData.calories < 0) {
      errors.push('Calories cannot be negative');
    } else if (mealData.calories > 5000) {
      errors.push('Calories seem unusually high (max 5000)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Challenge validation
export const validateChallenge = (challengeData: {
  title?: string;
  description?: string;
  duration?: number;
  target?: number;
  points?: number;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!challengeData.title || challengeData.title.trim().length === 0) {
    errors.push('Challenge title is required');
  } else if (challengeData.title.length < 5) {
    errors.push('Challenge title must be at least 5 characters long');
  } else if (challengeData.title.length > 100) {
    errors.push('Challenge title must be less than 100 characters');
  }
  
  if (!challengeData.description || challengeData.description.trim().length === 0) {
    errors.push('Challenge description is required');
  } else if (challengeData.description.length < 10) {
    errors.push('Challenge description must be at least 10 characters long');
  } else if (challengeData.description.length > 500) {
    errors.push('Challenge description must be less than 500 characters');
  }
  
  if (challengeData.duration !== undefined) {
    if (challengeData.duration < 1) {
      errors.push('Challenge duration must be at least 1 day');
    } else if (challengeData.duration > 365) {
      errors.push('Challenge duration cannot exceed 365 days');
    }
  }
  
  if (challengeData.target !== undefined) {
    if (challengeData.target < 1) {
      errors.push('Challenge target must be at least 1');
    } else if (challengeData.target > 1000) {
      errors.push('Challenge target seems unusually high (max 1000)');
    }
  }
  
  if (challengeData.points !== undefined) {
    if (challengeData.points < 1) {
      errors.push('Challenge points must be at least 1');
    } else if (challengeData.points > 1000) {
      errors.push('Challenge points cannot exceed 1000');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generic field validation
export const validateField = (value: any, rules: string[]): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of rules) {
    switch (rule) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          errors.push('This field is required');
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push('Please enter a valid email address');
        }
        break;
      case 'numeric':
        if (value && isNaN(Number(value))) {
          errors.push('This field must be a number');
        }
        break;
      case 'positive':
        if (value && Number(value) <= 0) {
          errors.push('This field must be a positive number');
        }
        break;
      case 'min-length-2':
        if (value && value.length < 2) {
          errors.push('This field must be at least 2 characters long');
        }
        break;
      case 'max-length-100':
        if (value && value.length > 100) {
          errors.push('This field must be less than 100 characters');
        }
        break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Batch validation for multiple fields
export const validateFields = (validationRules: ValidationRule[]): ValidationResult => {
  const allErrors: string[] = [];
  
  for (const rule of validationRules) {
    const result = validateField(rule.value, rule.rules);
    if (!result.isValid) {
      const fieldErrors = result.errors.map(error => 
        rule.customMessage || `${rule.field}: ${error}`
      );
      allErrors.push(...fieldErrors);
    }
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Validate file upload
export const validateFile = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}): ValidationResult => {
  const errors: string[] = [];
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
  
  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
