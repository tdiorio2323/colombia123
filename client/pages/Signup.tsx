import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuxuryButton, LuxuryInput, GlassCard } from "@/components/ui/luxury";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/api";
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Camera,
  Heart,
  CheckCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !selectedRole
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        selectedRole,
        formData.displayName || formData.username,
      );

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

  const renderRoleSelection = () => (
    <div className="space-y-6 animate-luxury-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extralight text-white mb-2">
          Choose Your Path
        </h2>
        <p className="text-white/50 text-sm font-light">
          Select how you want to join Havana
        </p>
      </div>

      <div className="space-y-4">
        {/* Creator Role */}
        <button
          onClick={() => handleRoleSelect(UserRole.CREATOR)}
          className={cn(
            "w-full p-6 rounded-3xl transition-all duration-300 group text-left",
            "bg-gradient-to-br from-luxury-gold/15 via-luxury-gold/5 to-transparent",
            "border border-luxury-gold/30 hover:border-luxury-gold/60",
            "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.2)]"
          )}
        >
          <div className="flex items-start">
            <div className="w-14 h-14 bg-luxury-gold/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform flex-shrink-0">
              <Camera className="w-7 h-7 text-luxury-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-light text-xl text-luxury-gold mb-2">
                Creator Account
              </h3>
              <p className="text-white/70 text-sm mb-3 font-light leading-relaxed">
                Share content, build your fanbase, and monetize your creativity
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold font-medium">
                  Monetize Content
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold font-medium">
                  Build Fanbase
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Fan Role */}
        <button
          onClick={() => handleRoleSelect(UserRole.FAN)}
          className={cn(
            "w-full p-6 rounded-3xl transition-all duration-300 group text-left",
            "bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent",
            "border border-white/20 hover:border-white/40",
            "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)]"
          )}
        >
          <div className="flex items-start">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform flex-shrink-0">
              <Heart className="w-7 h-7 text-white/80" />
            </div>
            <div className="flex-1">
              <h3 className="font-light text-xl text-white mb-2">
                Fan Account
              </h3>
              <p className="text-white/70 text-sm mb-3 font-light leading-relaxed">
                Support creators, access exclusive content, and connect
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/30 text-white/80 font-medium">
                  Exclusive Access
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/30 text-white/80 font-medium">
                  Support Creators
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center pt-6 border-t border-white/10">
        <p className="text-white/50 text-sm font-light">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-luxury-gold hover:text-luxury-gold-light font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-5 animate-luxury-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setStep("role")}
          className="flex items-center gap-2 text-white/60 hover:text-luxury-gold transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Role
        </button>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-2",
          selectedRole === UserRole.CREATOR
            ? "bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold"
            : "bg-white/10 border border-white/30 text-white/80"
        )}>
          {selectedRole === UserRole.CREATOR ? (
            <><Camera className="w-3 h-3" /> Creator</>
          ) : (
            <><Heart className="w-3 h-3" /> Fan</>
          )}
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
            Email Address *
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
            <User className="w-3.5 h-3.5" />
            Username *
          </label>
          <LuxuryInput
            type="text"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Display Name
          </label>
          <LuxuryInput
            type="text"
            placeholder="Your public display name"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Password *
          </label>
          <div className="relative">
            <LuxuryInput
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password (6+ chars)"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              className="pr-12"
              required
              minLength={6}
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
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create Account
              <CheckCircle className="w-4 h-4" />
            </span>
          )}
        </LuxuryButton>

        <div className="text-center pt-6 border-t border-white/10">
          <p className="text-white/50 text-sm font-light">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-luxury-gold hover:text-luxury-gold-light font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );

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
            Join Havana
          </h1>
          <p className="text-white/60 text-sm font-light mb-4">
            Create your account and start your journey
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-semibold tracking-wider uppercase">
              Premium Platform
            </span>
          </div>
        </div>

        {step === "role" ? renderRoleSelection() : renderDetailsForm()}
      </GlassCard>
    </div>
  );
}
