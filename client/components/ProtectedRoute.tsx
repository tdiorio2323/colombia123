import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/api";
import { GlassCard } from "@/components/ui/luxury";
import { Loader2, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-luxury-black"></div>
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 bg-luxury-noise"></div>
        <div className="relative z-10 text-center animate-luxury-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mx-auto mb-4" />
          <p className="text-white/60 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect if specific role is required but user doesn't have it
  if (requireRole && profile) {
    const allowedRoles = Array.isArray(requireRole)
      ? requireRole
      : [requireRole];
    if (!allowedRoles.includes(profile.role)) {
      return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-luxury-black"></div>
          <div className="absolute inset-0 bg-luxury-gradient"></div>
          <div className="absolute inset-0 bg-luxury-noise"></div>

          <GlassCard className="relative z-10 max-w-md text-center animate-luxury-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-extralight text-white mb-3 tracking-tight">
              Access <span className="text-luxury-gold">Denied</span>
            </h2>
            <p className="text-white/60 font-light mb-6">
              You don't have permission to access this page.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
              <p className="text-white/50 text-sm mb-2">
                Required role:{" "}
                <span className="text-luxury-gold">
                  {allowedRoles.join(" or ")}
                </span>
              </p>
              <p className="text-white/50 text-sm">
                Your role: <span className="text-white">{profile.role}</span>
              </p>
            </div>
          </GlassCard>
        </div>
      );
    }
  }

  // If we require auth but don't have a profile yet, show loading
  if (requireAuth && user && !profile) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-luxury-black"></div>
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 bg-luxury-noise"></div>
        <div className="relative z-10 text-center animate-luxury-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mx-auto mb-4" />
          <p className="text-white/60 font-light">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components for specific role protection
export function CreatorOnlyRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute requireRole="CREATOR" redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

export function FanOnlyRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  return (
    <ProtectedRoute requireRole="FAN" redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
}

// Component for routes that should only be accessible when NOT logged in
export function GuestOnlyRoute({
  children,
  redirectTo = "/profile",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-luxury-black"></div>
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 bg-luxury-noise"></div>
        <div className="relative z-10 text-center animate-luxury-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-luxury-gold mx-auto mb-4" />
          <p className="text-white/60 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
