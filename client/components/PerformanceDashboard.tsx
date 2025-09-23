import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { performanceMonitor } from "@/lib/performance";
import { BarChart3, Clock, Zap, AlertTriangle } from "lucide-react";

export function PerformanceDashboard() {
  const [report, setReport] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  const updateReport = () => {
    setReport(performanceMonitor.generateReport());
  };

  useEffect(() => {
    updateReport();
    const interval = setInterval(updateReport, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formatMetric = (value: number): string => {
    if (value < 1) return `${(value * 1000).toFixed(1)}μs`;
    if (value < 1000) return `${value.toFixed(1)}ms`;
    return `${(value / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (metric: string, value: number): string => {
    // Web Vitals thresholds
    if (metric === "cls") {
      if (value <= 0.1) return "text-green-400";
      if (value <= 0.25) return "text-yellow-400";
      return "text-red-400";
    }
    if (metric === "fid") {
      if (value <= 100) return "text-green-400";
      if (value <= 300) return "text-yellow-400";
      return "text-red-400";
    }
    if (metric.includes("payment")) {
      if (value <= 1000) return "text-green-400";
      if (value <= 3000) return "text-yellow-400";
      return "text-red-400";
    }
    return "text-blue-400";
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700"
        size="sm"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Perf
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-slate-900/95 border-purple-500/30 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Performance Monitor
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(report).length === 0 ? (
            <p className="text-gray-400 text-sm">No metrics collected yet...</p>
          ) : (
            <>
              {/* Web Vitals */}
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Web Vitals
                </h4>
                <div className="space-y-1 text-xs">
                  {["cls", "fid"].map((metric) => {
                    const data = report[metric];
                    if (!data) return null;
                    return (
                      <div key={metric} className="flex justify-between">
                        <span className="uppercase">{metric}:</span>
                        <span
                          className={getPerformanceColor(metric, data.average)}
                        >
                          {metric === "cls"
                            ? data.average.toFixed(3)
                            : formatMetric(data.average)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Metrics */}
              <div>
                <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center">
                  💳 Payment Performance
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(report)
                    .filter(([key]) => key.includes("payment"))
                    .map(([key, data]) => (
                      <div key={key} className="flex justify-between">
                        <span className="truncate">
                          {key.replace("payment_", "")}:
                        </span>
                        <span
                          className={getPerformanceColor(key, data.average)}
                        >
                          {formatMetric(data.average)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Route Performance */}
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-2">
                  📍 Routes
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(report)
                    .filter(([key]) => key.includes("route_"))
                    .slice(0, 3)
                    .map(([key, data]) => (
                      <div key={key} className="flex justify-between">
                        <span className="truncate">
                          {key.replace("route_", "")}
                        </span>
                        <span className="text-blue-400">
                          {data.count} visits
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Resource Loading */}
              <div>
                <h4 className="text-sm font-medium text-orange-300 mb-2">
                  📦 Resources
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(report)
                    .filter(([key]) => key.includes("load_"))
                    .map(([key, data]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key.replace("load_", "")}</span>
                        <span className="text-orange-400">
                          {formatMetric(data.average)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <Button
                  onClick={updateReport}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  Refresh Data
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
