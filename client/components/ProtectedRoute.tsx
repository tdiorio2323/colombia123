import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/api";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-white/70">Loading...</p>
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
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If we require auth but don't have a profile yet, show loading
  if (requireAuth && user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-white/70">Setting up your profile...</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
