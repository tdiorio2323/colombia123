import { Component, ReactNode } from "react";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-luxury-black"></div>
          <div className="absolute inset-0 bg-luxury-gradient"></div>
          <div className="absolute inset-0 bg-luxury-noise"></div>

          <GlassCard
            premium
            className="relative z-10 max-w-2xl animate-luxury-fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-4xl font-extralight text-white mb-4 tracking-tight text-center">
              Something Went <span className="text-luxury-gold">Wrong</span>
            </h1>

            <p className="text-white/60 font-light text-center mb-8">
              We encountered an unexpected error. Don't worry, your data is
              safe.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                <p className="text-red-400 font-mono text-sm mb-3 font-semibold">
                  {this.state.error.name}
                </p>
                <p className="text-red-300/80 font-mono text-xs leading-relaxed">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-4">
                    <summary className="text-red-300/60 text-xs cursor-pointer hover:text-red-300/80 transition-colors">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-red-300/60 font-mono text-[10px] leading-relaxed overflow-x-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton
                variant="gold"
                size="lg"
                onClick={this.handleReload}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reload Page
              </LuxuryButton>
              <LuxuryButton
                variant="ghost"
                size="lg"
                onClick={this.handleGoHome}
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </LuxuryButton>
            </div>

            <p className="text-white/40 text-sm text-center mt-8">
              If this problem persists, please contact support.
            </p>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
