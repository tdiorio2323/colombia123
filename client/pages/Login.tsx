import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
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
              <span className="text-gradient-luxury">Welcome Back</span>
            </h1>

            <p className="text-white/80 text-sm font-luxury-script">
              Sign in to your Colombian creator account
            </p>

            <Badge className="glass-card bg-gold/20 text-gold border-gold/30 mt-3 px-3 py-1 text-xs">
              Creator Platform
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2">
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
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={cn(
                  "auth-input-luxury text-white placeholder:text-white/50 font-luxury-body",
                  "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
                )}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gold flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={cn(
                    "auth-input-luxury text-white placeholder:text-white/50 pr-10 font-luxury-body",
                    "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
                  )}
                  disabled={isLoading}
                  required
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-luxury py-3 text-base relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <Crown className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-white/70 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-gold hover:text-gold/80 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
