import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuxuryButton, LuxuryInput, GlassCard } from "@/components/ui/luxury";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        navigate("/profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl"></div>

      <GlassCard className="w-full max-w-md relative z-10 animate-luxury-fade-in" premium>
        <div className="text-center pb-6">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
            <Crown className="h-10 w-10 text-luxury-black" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extralight text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-white/60 text-sm font-light mb-4">
            Sign in to your Havana creator account
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-semibold tracking-wider uppercase">
              Premium Platform
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <LuxuryInput
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <div className="relative">
              <LuxuryInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-luxury-gold transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <LuxuryButton
            type="submit"
            variant="gold"
            className="w-full py-6 text-base mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin"></div>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <Crown className="w-4 h-4" />
              </span>
            )}
          </LuxuryButton>

          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm font-light">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-luxury-gold hover:text-luxury-gold-light font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
