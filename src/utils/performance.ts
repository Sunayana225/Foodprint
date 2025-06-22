// Performance optimization utilities for FoodPrint application
import React from 'react';

// Debounce function for search inputs and API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll events and frequent updates
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return result;
  }) as T;
};

// Lazy loading for images
export const createLazyImageLoader = () => {
  const imageCache = new Set<string>();
  
  const loadImage = (src: string): Promise<void> => {
    if (imageCache.has(src)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };
  
  const preloadImages = (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(loadImage));
  };
  
  return { loadImage, preloadImages };
};

// Virtual scrolling for large lists
export const calculateVisibleItems = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};

// Batch DOM updates to prevent layout thrashing
export const batchDOMUpdates = (updates: (() => void)[]): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTiming(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      const times = this.metrics.get(label)!;
      times.push(duration);
      
      // Keep only last 100 measurements
      if (times.length > 100) {
        times.shift();
      }
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  getMetrics(): Record<string, { average: number; count: number; max: number }> {
    const result: Record<string, { average: number; count: number; max: number }> = {};
    
    this.metrics.forEach((times, label) => {
      result[label] = {
        average: this.getAverageTime(label),
        count: times.length,
        max: Math.max(...times)
      };
    });
    
    return result;
  }
  
  reset(): void {
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Local storage optimization
export class OptimizedStorage {
  private cache: Map<string, any> = new Map();
  private compressionThreshold = 1000; // bytes
  
  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      
      // Cache in memory for faster access
      this.cache.set(key, value);
      
      // Compress large items
      if (serialized.length > this.compressionThreshold) {
        // Simple compression by removing whitespace
        const compressed = JSON.stringify(value, null, 0);
        localStorage.setItem(key, compressed);
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Fallback: try to clear some space
      this.clearOldItems();
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
      }
    }
  }
  
  getItem<T>(key: string): T | null {
    // Check memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      
      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  removeItem(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(key);
  }
  
  clear(): void {
    this.cache.clear();
    localStorage.clear();
  }
  
  private clearOldItems(): void {
    // Remove items that haven't been accessed recently
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('_timestamp')) {
        const timestamp = parseInt(localStorage.getItem(key) || '0');
        if (now - timestamp > maxAge) {
          const dataKey = key.replace('_timestamp', '');
          localStorage.removeItem(key);
          localStorage.removeItem(dataKey);
          this.cache.delete(dataKey);
        }
      }
    }
  }
  
  // Get storage usage information
  getStorageInfo(): { used: number; available: number; percentage: number } {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        used += (localStorage.getItem(key) || '').length;
      }
    }
    
    // Estimate available space (most browsers limit to ~5-10MB)
    const estimated = 5 * 1024 * 1024; // 5MB estimate
    const available = estimated - used;
    const percentage = (used / estimated) * 100;
    
    return { used, available, percentage };
  }
}

// Global optimized storage instance
export const optimizedStorage = new OptimizedStorage();

// Component performance wrapper
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const endTiming = performanceMonitor.startTiming(`render_${componentName}`);
    
    React.useEffect(() => {
      endTiming();
    });
    
    return React.createElement(Component, props);
  });
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Bundle size optimization helpers
export const loadComponentAsync = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(async () => {
    const endTiming = performanceMonitor.startTiming('component_load');
    try {
      const module = await importFunc();
      endTiming();
      return module;
    } catch (error) {
      endTiming();
      console.error('Error loading component:', error);
      throw error;
    }
  });
};

// Memory usage monitoring
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} | null => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  }
  return null;
};
