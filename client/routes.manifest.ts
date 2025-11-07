// Centralized route configuration for the Havana application
// This manifest defines all application routes with their access levels

export type Access = "public" | "guest" | "protected" | "creator";

export interface RouteDef {
  path: string;
  name: string;
  access: Access;
  dynamic?: boolean;
  description?: string;
}

/**
 * Complete route manifest for the application
 *
 * Access levels:
 * - public: Accessible to anyone (authenticated or not)
 * - guest: Only accessible when NOT authenticated (redirects to /profile if logged in)
 * - protected: Requires authentication (any role)
 * - creator: Requires authentication AND creator role
 */
export const ROUTES: RouteDef[] = [
  // Public routes (no authentication required)
  {
    path: "/",
    name: "Home",
    access: "public",
    description: "Landing page with platform overview"
  },
  {
    path: "/services",
    name: "Services",
    access: "public",
    description: "Platform services and features"
  },
  {
    path: "/shop",
    name: "Shop",
    access: "public",
    description: "Digital content marketplace"
  },
  {
    path: "/community",
    name: "Community",
    access: "public",
    description: "Community hub and discussions"
  },
  {
    path: "/calendar",
    name: "Calendar",
    access: "public",
    description: "Events and scheduled content"
  },
  {
    path: "/showcase",
    name: "Showcase",
    access: "public",
    description: "Featured creators and content"
  },
  {
    path: "/c/:username",
    name: "Creator Profile",
    access: "public",
    dynamic: true,
    description: "Individual creator public profile"
  },

  // Guest-only routes (redirect to /profile if authenticated)
  {
    path: "/login",
    name: "Login",
    access: "guest",
    description: "User authentication page"
  },
  {
    path: "/signup",
    name: "Signup",
    access: "guest",
    description: "New user registration"
  },

  // Protected routes (require authentication, any role)
  {
    path: "/messages",
    name: "Messages",
    access: "protected",
    description: "Direct messaging inbox"
  },
  {
    path: "/profile",
    name: "Profile",
    access: "protected",
    description: "User profile and settings"
  },
  {
    path: "/smart-reply",
    name: "Smart Reply",
    access: "protected",
    description: "AI-powered message responses"
  },

  // Creator-only routes (require CREATOR role)
  {
    path: "/upload",
    name: "Upload",
    access: "creator",
    description: "Content upload and management"
  },

  // Catch-all 404
  {
    path: "*",
    name: "Not Found",
    access: "public",
    description: "404 error page for undefined routes"
  },
];

/**
 * Helper functions for route manifest
 */
export const RouteManifest = {
  /**
   * Get all routes by access level
   */
  byAccess(access: Access): RouteDef[] {
    return ROUTES.filter(r => r.access === access);
  },

  /**
   * Get route definition by path
   */
  byPath(path: string): RouteDef | undefined {
    return ROUTES.find(r => r.path === path);
  },

  /**
   * Get all public routes (excluding catch-all)
   */
  public(): RouteDef[] {
    return ROUTES.filter(r => r.access === "public" && r.path !== "*");
  },

  /**
   * Get all guest-only routes
   */
  guest(): RouteDef[] {
    return ROUTES.filter(r => r.access === "guest");
  },

  /**
   * Get all protected routes
   */
  protected(): RouteDef[] {
    return ROUTES.filter(r => r.access === "protected");
  },

  /**
   * Get all creator-only routes
   */
  creator(): RouteDef[] {
    return ROUTES.filter(r => r.access === "creator");
  },

  /**
   * Get all non-dynamic routes
   */
  static(): RouteDef[] {
    return ROUTES.filter(r => !r.dynamic && r.path !== "*");
  },

  /**
   * Get all dynamic routes
   */
  dynamic(): RouteDef[] {
    return ROUTES.filter(r => r.dynamic);
  },

  /**
   * Get total route count (excluding catch-all)
   */
  count(): number {
    return ROUTES.filter(r => r.path !== "*").length;
  },
};
