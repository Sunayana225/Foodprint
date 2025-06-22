// Comprehensive error handling utilities for FoodPrint application

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userFriendly: boolean;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorLog {
  error: AppError;
  severity: ErrorSeverity;
  context?: string;
  userId?: string;
}

// Error codes and their user-friendly messages
export const ERROR_MESSAGES = {
  // Authentication errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  
  // Data validation errors
  'validation/required-field': 'This field is required.',
  'validation/invalid-email': 'Please enter a valid email address.',
  'validation/invalid-format': 'Invalid format. Please check your input.',
  'validation/too-long': 'Input is too long.',
  'validation/too-short': 'Input is too short.',
  
  // Storage errors
  'storage/quota-exceeded': 'Storage limit exceeded. Please clear some data.',
  'storage/permission-denied': 'Permission denied. Please check your settings.',
  'storage/not-found': 'Data not found.',
  'storage/corrupted': 'Data appears to be corrupted. Please try refreshing.',
  
  // Network errors
  'network/offline': 'You appear to be offline. Please check your connection.',
  'network/timeout': 'Request timed out. Please try again.',
  'network/server-error': 'Server error. Please try again later.',
  
  // Application errors
  'app/feature-unavailable': 'This feature is currently unavailable.',
  'app/invalid-operation': 'Invalid operation. Please try again.',
  'app/data-sync-failed': 'Failed to sync data. Your changes may not be saved.',
  
  // Default fallback
  'unknown': 'An unexpected error occurred. Please try again.'
};

// Create a standardized error object
export const createError = (
  code: string, 
  originalError?: any, 
  context?: string
): AppError => {
  const message = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.unknown;
  
  return {
    code,
    message,
    details: originalError,
    timestamp: new Date(),
    userFriendly: true
  };
};

// Determine error severity
export const getErrorSeverity = (error: AppError): ErrorSeverity => {
  if (error.code.startsWith('auth/')) {
    return 'medium';
  }
  
  if (error.code.startsWith('storage/')) {
    return 'high';
  }
  
  if (error.code.startsWith('network/')) {
    return 'medium';
  }
  
  if (error.code.includes('critical') || error.code.includes('corrupted')) {
    return 'critical';
  }
  
  return 'low';
};

// Log error (in a real app, this would send to a logging service)
export const logError = (error: AppError, context?: string, userId?: string): void => {
  const errorLog: ErrorLog = {
    error,
    severity: getErrorSeverity(error),
    context,
    userId
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error [${errorLog.severity.toUpperCase()}]`);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Context:', context);
    console.error('Details:', error.details);
    console.error('Timestamp:', error.timestamp);
    console.groupEnd();
  }
  
  // In production, you would send this to your error tracking service
  // Example: Sentry, LogRocket, Bugsnag, etc.
  // errorTrackingService.captureError(errorLog);
};

// Handle Firebase Auth errors specifically
export const handleAuthError = (error: any): AppError => {
  const code = error?.code || 'unknown';
  const appError = createError(code, error, 'authentication');
  logError(appError, 'Firebase Authentication');
  return appError;
};

// Handle storage/localStorage errors
export const handleStorageError = (error: any, operation: string): AppError => {
  let code = 'storage/unknown';
  
  if (error?.name === 'QuotaExceededError') {
    code = 'storage/quota-exceeded';
  } else if (error?.message?.includes('permission')) {
    code = 'storage/permission-denied';
  } else if (error?.message?.includes('not found')) {
    code = 'storage/not-found';
  }
  
  const appError = createError(code, error, `storage-${operation}`);
  logError(appError, `Local Storage - ${operation}`);
  return appError;
};

// Handle network errors
export const handleNetworkError = (error: any): AppError => {
  let code = 'network/server-error';
  
  if (!navigator.onLine) {
    code = 'network/offline';
  } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
    code = 'network/timeout';
  }
  
  const appError = createError(code, error, 'network');
  logError(appError, 'Network Request');
  return appError;
};

// Generic error handler
export const handleError = (error: any, context?: string): AppError => {
  // If it's already an AppError, just log and return
  if (error.code && error.message && error.timestamp) {
    logError(error, context);
    return error;
  }
  
  // Handle specific error types
  if (error?.code?.startsWith('auth/')) {
    return handleAuthError(error);
  }
  
  if (error?.name === 'QuotaExceededError' || context?.includes('storage')) {
    return handleStorageError(error, context || 'unknown');
  }
  
  if (error?.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return handleNetworkError(error);
  }
  
  // Generic error
  const appError = createError('unknown', error, context);
  logError(appError, context);
  return appError;
};

// Retry mechanism for failed operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw handleError(error, `retry-failed-after-${maxRetries}-attempts`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw handleError(lastError, 'retry-exhausted');
};

// Safe async operation wrapper
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const appError = handleError(error, context);
    return { data: fallback || null, error: appError };
  }
};

// Validate and sanitize user input
export const validateAndSanitize = (
  input: any,
  validator: (input: any) => { isValid: boolean; errors: string[] },
  sanitizer?: (input: any) => any
): { isValid: boolean; data: any; errors: string[] } => {
  try {
    // Sanitize first if sanitizer provided
    const sanitizedInput = sanitizer ? sanitizer(input) : input;
    
    // Then validate
    const validation = validator(sanitizedInput);
    
    return {
      isValid: validation.isValid,
      data: validation.isValid ? sanitizedInput : null,
      errors: validation.errors
    };
  } catch (error) {
    const appError = handleError(error, 'validation');
    return {
      isValid: false,
      data: null,
      errors: [appError.message]
    };
  }
};
