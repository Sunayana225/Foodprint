import React, { useState, useRef, useCallback } from 'react';
import { throttle, calculateVisibleItems } from '../utils/performance';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  loadingComponent,
  emptyComponent
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = items.length * itemHeight;

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(
    throttle((event: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = event.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    }, 16), // ~60fps
    [onScroll]
  );

  // Calculate visible items
  const { startIndex, endIndex } = calculateVisibleItems(
    scrollTop,
    containerHeight,
    itemHeight,
    items.length,
    overscan
  );

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Calculate offset for positioning
  const offsetY = startIndex * itemHeight;

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!containerRef.current) return;

    const currentIndex = Math.floor(scrollTop / itemHeight);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'PageDown':
        event.preventDefault();
        const itemsPerPage = Math.floor(containerHeight / itemHeight);
        newIndex = Math.min(currentIndex + itemsPerPage, items.length - 1);
        break;
      case 'PageUp':
        event.preventDefault();
        const itemsPerPageUp = Math.floor(containerHeight / itemHeight);
        newIndex = Math.max(currentIndex - itemsPerPageUp, 0);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    const newScrollTop = newIndex * itemHeight;
    containerRef.current.scrollTop = newScrollTop;
    setScrollTop(newScrollTop);
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef.current) return;

    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    let newScrollTop: number;

    switch (align) {
      case 'center':
        newScrollTop = clampedIndex * itemHeight - containerHeight / 2 + itemHeight / 2;
        break;
      case 'end':
        newScrollTop = clampedIndex * itemHeight - containerHeight + itemHeight;
        break;
      case 'start':
      default:
        newScrollTop = clampedIndex * itemHeight;
        break;
    }

    newScrollTop = Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight));
    containerRef.current.scrollTop = newScrollTop;
    setScrollTop(newScrollTop);
  }, [itemHeight, containerHeight, items.length, totalHeight]);

  // Note: Scroll methods are available via the scrollToIndex function parameter

  // Handle empty state
  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight }}
      >
        {emptyComponent || (
          <div className="text-gray-500 text-center">
            <p>No items to display</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="Virtual list"
    >
      {/* Total height container */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = startIndex + index;
            return (
              <div
                key={actualIndex}
                style={{ height: itemHeight }}
                className="virtual-list-item"
                role="option"
                aria-selected={false}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading indicator */}
      {loadingComponent && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

// Memoized version for better performance
export default React.memo(VirtualList) as typeof VirtualList;

// Hook for managing virtual list state
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<any>(null);

  const scrollToIndex = useCallback((index: number, align?: 'start' | 'center' | 'end') => {
    listRef.current?.scrollToIndex(index, align);
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToTop();
  }, []);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToBottom();
  }, []);

  const getCurrentIndex = useCallback(() => {
    return listRef.current?.getCurrentIndex() || 0;
  }, []);

  const { startIndex, endIndex } = calculateVisibleItems(
    scrollTop,
    containerHeight,
    itemHeight,
    items.length
  );

  return {
    listRef,
    scrollTop,
    setScrollTop,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    getCurrentIndex,
    visibleRange: { startIndex, endIndex }
  };
}
