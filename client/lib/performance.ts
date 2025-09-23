// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {
    this.setupWebVitals();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track custom metrics
  public trackMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Log significant metrics
    if (name.includes("payment") || value > 1000) {
      console.info(`📊 Performance: ${name} = ${value}ms`);
    }
  }

  // Track payment flow performance
  public trackPaymentFlow(step: string, startTime?: number): number {
    const now = performance.now();
    if (startTime) {
      const duration = now - startTime;
      this.trackMetric(`payment_${step}`, duration);
      return duration;
    }
    return now;
  }

  // Track route changes
  public trackRoute(route: string): void {
    const now = performance.now();
    this.trackMetric(`route_${route}`, now);

    // Track largest contentful paint for route
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.trackMetric(`lcp_${route}`, lastEntry.startTime);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  }

  // Get average for a metric
  public getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Setup Web Vitals tracking
  private setupWebVitals(): void {
    // Track Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsScore = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value;
        }
      }
      if (clsScore > 0) {
        this.trackMetric("cls", clsScore);
      }
    }).observe({ type: "layout-shift", buffered: true });

    // Track First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.trackMetric("fid", fid);
      }
    }).observe({ type: "first-input", buffered: true });

    // Track resource loading performance
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        if (
          resource.name.includes("stripe") ||
          resource.name.includes("supabase")
        ) {
          this.trackMetric(
            `load_${this.getResourceName(resource.name)}`,
            resource.duration,
          );
        }
      }
    }).observe({ type: "resource", buffered: true });
  }

  private getResourceName(url: string): string {
    if (url.includes("stripe")) return "stripe";
    if (url.includes("supabase")) return "supabase";
    return "unknown";
  }

  // Generate performance report
  public generateReport(): Record<string, any> {
    const report: Record<string, any> = {};

    for (const [key, values] of this.metrics.entries()) {
      report[key] = {
        count: values.length,
        average: this.getAverageMetric(key),
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }

    return report;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for React components
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePerformanceTracking = (componentName?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (componentName) {
      performanceMonitor.trackRoute(`${location.pathname}_${componentName}`);
    } else {
      performanceMonitor.trackRoute(location.pathname);
    }
  }, [location.pathname, componentName]);

  return {
    trackPayment: performanceMonitor.trackPaymentFlow.bind(performanceMonitor),
    trackMetric: performanceMonitor.trackMetric.bind(performanceMonitor),
  };
};
