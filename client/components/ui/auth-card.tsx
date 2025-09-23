import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Crown,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Diamond,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  className?: string;
  onAuthenticate?: (credentials: {
    username: string;
    password: string;
    code: string;
  }) => void;
}

export function AuthCard({ className, onAuthenticate }: AuthCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<"credentials" | "code" | "success">(
    "credentials"
  );
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    code?: string;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCredentials = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = () => {
    const newErrors: typeof errors = {};
    
    if (formData.code !== "444") {
      newErrors.code = "Invalid access code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsSubmit = async () => {
    if (!validateCredentials()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setAuthStep("code");
  };

  const handleCodeSubmit = async () => {
    if (!validateCode()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setAuthStep("success");
    
    // Call the authentication callback
    onAuthenticate?.(formData);
    
    // Auto close after success
    setTimeout(() => {
      setIsOpen(false);
      setAuthStep("credentials");
      setFormData({ username: "", password: "", code: "" });
      setErrors({});
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ username: "", password: "", code: "" });
    setErrors({});
    setAuthStep("credentials");
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "btn-luxury group relative overflow-hidden",
            "hover:shadow-luxury transition-all duration-500",
            "animate-luxury-glow hover:animate-luxury-shimmer",
            className
          )}
          onClick={() => {
            setIsOpen(true);
            resetForm();
          }}
        >
          <Shield className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-luxury-display tracking-wide">VIP Access</span>
          <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 border-0 bg-transparent max-w-md w-full auth-card-overlay">
        <Card className="auth-card-luxury border-0 overflow-hidden animate-auth-float">
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
              
              <h2 className="text-2xl font-luxury-display font-bold mb-2">
                <span className="text-gradient-luxury">Elite Access</span>
              </h2>
              
              <p className="text-white/80 text-sm font-luxury-script">
                Enter the world of Colombian luxury
              </p>

              <Badge className="glass-card bg-gold/20 text-gold border-gold/30 mt-3 px-3 py-1 text-xs">
                <Diamond className="w-3 h-3 mr-1" />
                Exclusive Members Only
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2 space-y-6 auth-card-content">
            {authStep === "credentials" && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={cn(
                        "auth-input-luxury text-white placeholder:text-white/50 font-luxury-body",
                        "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
                        errors.username && "border-destructive/50 focus:border-destructive/50"
                      )}
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <p className="text-destructive text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.username}
                      </p>
                    )}
                  </div>
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
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={cn(
                        "auth-input-luxury text-white placeholder:text-white/50 pr-10 font-luxury-body",
                        "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
                        errors.password && "border-destructive/50 focus:border-destructive/50"
                      )}
                      disabled={isLoading}
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
                    {errors.password && (
                      <p className="text-destructive text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCredentialsSubmit}
                  disabled={isLoading}
                  className="w-full btn-luxury py-3 text-base relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Continue
                      <Crown className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {authStep === "code" && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-gold animate-pulse" />
                  </div>
                  <h3 className="font-luxury-display font-bold text-lg text-gold mb-1">
                    Elite Access Code
                  </h3>
                  <p className="text-white/70 text-sm">
                    Enter your exclusive access code
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold flex items-center justify-center">
                    <Diamond className="w-4 h-4 mr-2" />
                    Special Code
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter code (444)"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      className={cn(
                        "auth-input-luxury text-white placeholder:text-white/50 text-center text-lg tracking-widest font-luxury-display",
                        "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
                        errors.code && "border-destructive/50 focus:border-destructive/50"
                      )}
                      maxLength={3}
                      disabled={isLoading}
                    />
                    {errors.code && (
                      <p className="text-destructive text-xs mt-1 flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setAuthStep("credentials")}
                    disabled={isLoading}
                    className="flex-1 glass-card border-gold/20 text-gold hover:bg-gold/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCodeSubmit}
                    disabled={isLoading}
                    className="flex-1 btn-luxury"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Access
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {authStep === "success" && (
              <div className="text-center py-6 space-y-4 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-gold/20 rounded-2xl flex items-center justify-center mx-auto animate-luxury-pulse success-glow">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                
                <div>
                  <h3 className="font-luxury-display font-bold text-xl text-gold mb-2">
                    Welcome to Elite
                  </h3>
                  <p className="text-white/80 font-luxury-script">
                    Access granted to Colombian luxury
                  </p>
                </div>

                <Badge className="glass-card bg-green-400/20 text-green-400 border-green-400/30 px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Elite Member Activated
                </Badge>
              </div>
            )}

            {/* Security notice */}
            {authStep === "credentials" && (
              <div className="text-center pt-4 border-t border-gold/10">
                <p className="text-white/60 text-xs flex items-center justify-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Secured with luxury-grade encryption
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}