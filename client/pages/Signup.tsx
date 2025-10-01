import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/api";
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  User,
  Camera,
  Heart,
  CheckCircle,
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
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-xl font-luxury-display font-bold text-gold mb-2">
          Choose Your Path
        </h2>
        <p className="text-white/70 text-sm">
          Select how you want to join the platform
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleRoleSelect("CREATOR")}
          className="w-full p-6 rounded-xl bg-gradient-to-r from-gold/10 to-primary/10 border border-gold/20 hover:border-gold/40 transition-all duration-300 group text-left"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-primary/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-luxury-display font-bold text-gold mb-1">
                Creator
              </h3>
              <p className="text-white/80 text-sm">
                Share content, build your fanbase, and earn money
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="glass-card bg-gold/20 text-gold border-gold/30 text-xs">
                  Monetize Content
                </Badge>
                <Badge className="glass-card bg-primary/20 text-primary border-primary/30 text-xs">
                  Build Fanbase
                </Badge>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect("FAN")}
          className="w-full p-6 rounded-xl bg-gradient-to-r from-primary/10 to-blue/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 group text-left"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-luxury-display font-bold text-primary mb-1">
                Fan
              </h3>
              <p className="text-white/80 text-sm">
                Support creators, access exclusive content, and connect
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="glass-card bg-primary/20 text-primary border-primary/30 text-xs">
                  Exclusive Access
                </Badge>
                <Badge className="glass-card bg-blue/20 text-blue border-blue/30 text-xs">
                  Support Creators
                </Badge>
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-white/70 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gold hover:text-gold/80 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gold/20 to-primary/20 rounded-lg flex items-center justify-center mr-2">
            {selectedRole === "CREATOR" ? (
              <Camera className="w-4 h-4 text-gold" />
            ) : (
              <Heart className="w-4 h-4 text-primary" />
            )}
          </div>
          <Badge
            className={cn(
              "glass-card border text-xs",
              selectedRole === "CREATOR"
                ? "bg-gold/20 text-gold border-gold/30"
                : "bg-primary/20 text-primary border-primary/30",
            )}
          >
            {selectedRole === "CREATOR" ? "Creator Account" : "Fan Account"}
          </Badge>
        </div>
        <button
          onClick={() => setStep("role")}
          className="text-white/60 hover:text-white/80 text-sm transition-colors"
        >
          Change role
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email *
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="auth-input-luxury text-white placeholder:text-white/50 font-luxury-body focus:ring-2 focus:ring-gold/30 focus:ring-offset-0"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold flex items-center">
            <User className="w-4 h-4 mr-2" />
            Username *
          </label>
          <Input
            type="text"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="auth-input-luxury text-white placeholder:text-white/50 font-luxury-body focus:ring-2 focus:ring-gold/30 focus:ring-offset-0"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold flex items-center">
            <User className="w-4 h-4 mr-2" />
            Display Name
          </label>
          <Input
            type="text"
            placeholder="Your public display name"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className="auth-input-luxury text-white placeholder:text-white/50 font-luxury-body focus:ring-2 focus:ring-gold/30 focus:ring-offset-0"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="auth-input-luxury text-white placeholder:text-white/50 pr-10 font-luxury-body focus:ring-2 focus:ring-gold/30 focus:ring-offset-0"
              disabled={isLoading}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold/60 hover:text-gold transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-white/50 text-xs">Must be at least 6 characters</p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-luxury py-3 text-base relative overflow-hidden group"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <CheckCircle className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </Button>

        <div className="text-center pt-4">
          <p className="text-white/70 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gold hover:text-gold/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="w-full max-w-md auth-card-luxury border-0 overflow-hidden">
        <CardHeader className="text-center pb-4 relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-lg" />
          </div>

          {/* Header content */}
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-gold via-primary to-blue rounded-2xl flex items-center justify-center mx-auto mb-4 animate-luxury-pulse">
              <Crown className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-3xl font-luxury-display font-bold mb-2">
              <span className="text-gradient-luxury">Join Colombia</span>
            </h1>

            <p className="text-white/80 text-sm font-luxury-script">
              Create your account and start your journey
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2">
          {step === "role" ? renderRoleSelection() : renderDetailsForm()}
        </CardContent>
      </Card>
    </div>
  );
}
