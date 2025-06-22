import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (!import.meta.env.DEV) return;

    const startTime = performance.now();

    // Measure initial load time
    const loadTime = performance.timing 
      ? performance.timing.loadEventEnd - performance.timing.navigationStart
      : 0;

    // Measure render time
    const renderTime = performance.now() - startTime;

    // Get memory usage if available
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;

    setMetrics({
      loadTime,
      renderTime,
      memoryUsage
    });

    // Show metrics after a delay
    const timer = setTimeout(() => setShowMetrics(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Only render in development mode
  if (!import.meta.env.DEV || !showMetrics || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50">
      <div className="space-y-1">
        <div>Load: {metrics.loadTime}ms</div>
        <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
        {metrics.memoryUsage && (
          <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
