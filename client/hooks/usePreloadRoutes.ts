import { useCallback } from "react";

export const usePreloadRoutes = () => {
  const preloadServices = useCallback(() => {
    import("../pages/Services");
  }, []);

  const preloadShowcase = useCallback(() => {
    import("../pages/Showcase");
  }, []);

  const preloadCommunity = useCallback(() => {
    import("../pages/Community");
  }, []);

  const preloadProfile = useCallback(() => {
    import("../pages/Profile");
  }, []);

  const preloadLogin = useCallback(() => {
    import("../pages/Login");
  }, []);

  const preloadSignup = useCallback(() => {
    import("../pages/Signup");
  }, []);

  return {
    preloadServices,
    preloadShowcase,
    preloadCommunity,
    preloadProfile,
    preloadLogin,
    preloadSignup,
  };
};
