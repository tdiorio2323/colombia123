import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES, RouteManifest, type RouteDef } from "../routes.manifest";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import {
  Lock,
  Unlock,
  Crown,
  User,
  Globe,
  LogIn,
  Shield,
  AlertCircle,
} from "lucide-react";

/**
 * RouteGallery - Dev-only route visualization and guard testing
 *
 * Available at: /__routes (dev mode only)
 *
 * Features:
 * - Visual representation of all application routes
 * - Interactive auth/role simulation
 * - Guard behavior testing
 * - Access level organization
 */
export default function RouteGallery() {
  const [isAuthed, setAuthed] = useState(false);
  const [isCreator, setCreator] = useState(false);

  const buckets = [
    {
      label: "Public Routes",
      access: "public" as const,
      items: RouteManifest.public(),
      icon: Globe,
      color: "blue",
      description: "Accessible to everyone (authenticated or not)",
    },
    {
      label: "Guest-Only Routes",
      access: "guest" as const,
      items: RouteManifest.guest(),
      icon: LogIn,
      color: "purple",
      description: "Only accessible when NOT logged in (redirects to /profile if authenticated)",
    },
    {
      label: "Protected Routes",
      access: "protected" as const,
      items: RouteManifest.protected(),
      icon: Shield,
      color: "green",
      description: "Requires authentication (any role)",
    },
    {
      label: "Creator-Only Routes",
      access: "creator" as const,
      items: RouteManifest.creator(),
      icon: Crown,
      color: "gold",
      description: "Requires authentication AND creator role",
    },
  ];

  const getAccessIcon = (access: string) => {
    switch (access) {
      case "public":
        return <Globe className="w-4 h-4" />;
      case "guest":
        return <LogIn className="w-4 h-4" />;
      case "protected":
        return <Shield className="w-4 h-4" />;
      case "creator":
        return <Crown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isRouteAccessible = (access: RouteDef["access"]): boolean => {
    switch (access) {
      case "public":
        return true;
      case "guest":
        return !isAuthed;
      case "protected":
        return isAuthed;
      case "creator":
        return isAuthed && isCreator;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-extralight text-white tracking-tight">
            Route <span className="text-luxury-gold">Gallery</span>
          </h1>
          <p className="text-white/60 text-lg font-light">
            Visual route manifest and guard testing dashboard
          </p>
          <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-4 py-2">
            <AlertCircle className="w-4 h-4 text-luxury-gold" />
            <span className="text-luxury-gold text-sm font-semibold uppercase tracking-wider">
              Development Only
            </span>
          </div>
        </div>

        {/* Auth Simulation Controls */}
        <GlassCard premium className="animate-luxury-fade-in">
          <div className="space-y-4">
            <h2 className="text-2xl font-extralight text-white flex items-center gap-3">
              <User className="w-6 h-6 text-luxury-gold" />
              Authentication Simulator
            </h2>
            <p className="text-white/60 text-sm font-light mb-6">
              Toggle authentication state to test route guards and redirects
            </p>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isAuthed}
                  onChange={(e) => {
                    setAuthed(e.target.checked);
                    if (!e.target.checked) setCreator(false);
                  }}
                  className="w-5 h-5 rounded border-2 border-luxury-gold/50 bg-luxury-black/50 checked:bg-luxury-gold cursor-pointer"
                />
                <span className="text-white/80 font-light flex items-center gap-2">
                  {isAuthed ? (
                    <Unlock className="w-4 h-4 text-green-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-white/40" />
                  )}
                  Authenticated
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isCreator}
                  onChange={(e) => setCreator(e.target.checked)}
                  disabled={!isAuthed}
                  className="w-5 h-5 rounded border-2 border-luxury-gold/50 bg-luxury-black/50 checked:bg-luxury-gold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                />
                <span className="text-white/80 font-light flex items-center gap-2">
                  <Crown className={`w-4 h-4 ${isCreator ? "text-luxury-gold" : "text-white/40"}`} />
                  Creator Role
                </span>
              </label>
            </div>

            {/* Current State Display */}
            <div className="mt-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
              <p className="text-sm text-white/60 font-light">
                <strong className="text-luxury-gold">Current State:</strong>{" "}
                {!isAuthed && "Anonymous User"}
                {isAuthed && !isCreator && "Authenticated Fan"}
                {isAuthed && isCreator && "Authenticated Creator"}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Route Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="text-center animate-slide-up stagger-1">
            <div className="text-3xl font-extralight text-luxury-gold mb-2">
              {RouteManifest.count()}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">Total Routes</div>
          </GlassCard>
          <GlassCard className="text-center animate-slide-up stagger-2">
            <div className="text-3xl font-extralight text-blue-400 mb-2">
              {RouteManifest.public().length}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">Public</div>
          </GlassCard>
          <GlassCard className="text-center animate-slide-up stagger-3">
            <div className="text-3xl font-extralight text-green-400 mb-2">
              {RouteManifest.protected().length + RouteManifest.creator().length}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">Protected</div>
          </GlassCard>
          <GlassCard className="text-center animate-slide-up stagger-4">
            <div className="text-3xl font-extralight text-purple-400 mb-2">
              {RouteManifest.dynamic().length}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">Dynamic</div>
          </GlassCard>
        </div>

        {/* Route Buckets */}
        {buckets.map((bucket, idx) => {
          const Icon = bucket.icon;
          const accessible = isRouteAccessible(bucket.access);

          return (
            <GlassCard
              key={bucket.label}
              premium={bucket.access === "creator"}
              className={`animate-slide-up stagger-${idx + 1}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-extralight text-white flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 text-${bucket.color === "gold" ? "luxury-gold" : bucket.color + "-400"}`} />
                      {bucket.label}
                      <span className="text-sm text-white/40 font-normal">
                        ({bucket.items.length})
                      </span>
                    </h2>
                    <p className="text-white/50 text-sm font-light">{bucket.description}</p>
                  </div>
                  {!accessible && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
                      <Lock className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                        Blocked
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                  {bucket.items.map((route) => {
                    const href = route.dynamic
                      ? route.path.replace(":username", "demo-creator")
                      : route.path;
                    const disabled = !accessible;

                    return (
                      <Link
                        key={route.path}
                        to={disabled ? "#" : href}
                        onClick={(e) => disabled && e.preventDefault()}
                        className={`
                          block p-4 rounded-2xl border transition-all duration-300
                          ${
                            disabled
                              ? "bg-white/[0.02] border-white/10 opacity-50 cursor-not-allowed"
                              : "bg-white/[0.05] border-white/20 hover:bg-white/[0.08] hover:border-luxury-gold/50 hover:-translate-y-0.5"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-white">{route.name}</div>
                          {route.dynamic && (
                            <span className="px-2 py-0.5 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold">
                              Dynamic
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/60 font-mono mb-2">{href}</div>
                        {route.description && (
                          <div className="text-xs text-white/40 font-light mt-2">
                            {route.description}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          );
        })}

        {/* Back to Home */}
        <div className="text-center py-8">
          <Link to="/">
            <LuxuryButton variant="gold">
              Back to Home
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
