import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  GuestOnlyRoute,
  CreatorOnlyRoute,
  FanOnlyRoute,
} from "./ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import type { User, Profile } from "@shared/api";

// Mock the AuthContext
const mockAuthContext = vi.hoisted(() => ({
  user: null as User | null,
  profile: null as Profile | null,
  loading: false,
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", async () => {
  const actual = await vi.importActual("@/contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => mockAuthContext,
  };
});

// Test components
const PublicPage = () => <div>Public Page</div>;
const LoginPage = () => <div>Login Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const UploadPage = () => <div>Upload Page</div>;

// Helper to render with router
function renderWithRouter(ui: React.ReactElement, initialRoute = "/") {
  window.history.pushState({}, "Test", initialRoute);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <CreatorOnlyRoute>
              <UploadPage />
            </CreatorOnlyRoute>
          }
        />
        <Route
          path="/guest"
          element={
            <GuestOnlyRoute>
              <div>Guest Only Page</div>
            </GuestOnlyRoute>
          }
        />
        {ui}
      </Routes>
    </BrowserRouter>
  );
}

describe("Route Guards", () => {
  beforeEach(() => {
    // Reset auth state before each test
    mockAuthContext.user = null;
    mockAuthContext.profile = null;
    mockAuthContext.loading = false;
    vi.clearAllMocks();
  });

  describe("ProtectedRoute", () => {
    it("should show loading state when auth is loading", () => {
      mockAuthContext.loading = true;

      renderWithRouter(
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />,
        "/test"
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should redirect to /login when not authenticated", async () => {
      mockAuthContext.user = null;
      mockAuthContext.loading = false;

      renderWithRouter(
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />,
        "/test"
      );

      await waitFor(() => {
        expect(screen.getByText("Login Page")).toBeInTheDocument();
      });
    });

    it("should render children when authenticated", () => {
      mockAuthContext.user = {
        id: "1",
        email: "test@example.com",
      } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "testuser",
        role: "FAN",
      } as Profile;

      renderWithRouter(
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />,
        "/test"
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("should allow custom redirect path", async () => {
      mockAuthContext.user = null;

      renderWithRouter(
        <>
          <Route path="/custom-login" element={<div>Custom Login</div>} />
          <Route
            path="/test"
            element={
              <ProtectedRoute redirectTo="/custom-login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </>,
        "/test"
      );

      await waitFor(() => {
        expect(screen.getByText("Custom Login")).toBeInTheDocument();
      });
    });
  });

  describe("GuestOnlyRoute", () => {
    it("should render children when not authenticated", () => {
      mockAuthContext.user = null;

      renderWithRouter(<Route path="/test" element={<div />} />, "/guest");

      expect(screen.getByText("Guest Only Page")).toBeInTheDocument();
    });

    it("should redirect to /profile when authenticated", async () => {
      mockAuthContext.user = { id: "1", email: "test@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "testuser",
        role: "FAN",
      } as Profile;

      renderWithRouter(<Route path="/test" element={<div />} />, "/guest");

      await waitFor(() => {
        expect(screen.getByText("Profile Page")).toBeInTheDocument();
      });
    });
  });

  describe("CreatorOnlyRoute", () => {
    it("should redirect to /login when not authenticated", async () => {
      mockAuthContext.user = null;

      renderWithRouter(<Route path="/test" element={<div />} />, "/upload");

      await waitFor(() => {
        expect(screen.getByText("Login Page")).toBeInTheDocument();
      });
    });

    it("should show access denied for non-creator users", () => {
      mockAuthContext.user = { id: "1", email: "test@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "testuser",
        role: "FAN",
      } as Profile;

      renderWithRouter(<Route path="/test" element={<div />} />, "/upload");

      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
      expect(screen.getByText(/Creator Access Only/i)).toBeInTheDocument();
    });

    it("should render children for creator users", () => {
      mockAuthContext.user = { id: "1", email: "creator@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "creator",
        role: "CREATOR",
      } as Profile;

      renderWithRouter(<Route path="/test" element={<div />} />, "/upload");

      expect(screen.getByText("Upload Page")).toBeInTheDocument();
    });
  });

  describe("FanOnlyRoute", () => {
    it("should show access denied for creator users", () => {
      mockAuthContext.user = { id: "1", email: "creator@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "creator",
        role: "CREATOR",
      } as Profile;

      renderWithRouter(
        <Route
          path="/fan-only"
          element={
            <FanOnlyRoute>
              <div>Fan Only Content</div>
            </FanOnlyRoute>
          }
        />,
        "/fan-only"
      );

      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
      expect(screen.getByText(/Fan Access Only/i)).toBeInTheDocument();
    });

    it("should render children for fan users", () => {
      mockAuthContext.user = { id: "1", email: "fan@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "fan",
        role: "FAN",
      } as Profile;

      renderWithRouter(
        <Route
          path="/fan-only"
          element={
            <FanOnlyRoute>
              <div>Fan Only Content</div>
            </FanOnlyRoute>
          }
        />,
        "/fan-only"
      );

      expect(screen.getByText("Fan Only Content")).toBeInTheDocument();
    });
  });

  describe("Role-based access with requireRole", () => {
    it("should allow access when user has required role", () => {
      mockAuthContext.user = { id: "1", email: "creator@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "creator",
        role: "CREATOR",
      } as Profile;

      renderWithRouter(
        <Route
          path="/test"
          element={
            <ProtectedRoute requireRole="CREATOR">
              <div>Creator Content</div>
            </ProtectedRoute>
          }
        />,
        "/test"
      );

      expect(screen.getByText("Creator Content")).toBeInTheDocument();
    });

    it("should deny access when user lacks required role", () => {
      mockAuthContext.user = { id: "1", email: "fan@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "fan",
        role: "FAN",
      } as Profile;

      renderWithRouter(
        <Route
          path="/test"
          element={
            <ProtectedRoute requireRole="CREATOR">
              <div>Creator Content</div>
            </ProtectedRoute>
          }
        />,
        "/test"
      );

      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });

  describe("Guard audit checklist", () => {
    it("✓ Guest routes redirect to /profile when auth=true", async () => {
      mockAuthContext.user = { id: "1", email: "test@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "testuser",
        role: "FAN",
      } as Profile;

      renderWithRouter(<Route path="/test" element={<div />} />, "/guest");

      await waitFor(() => {
        expect(screen.getByText("Profile Page")).toBeInTheDocument();
      });
    });

    it("✓ Protected routes redirect to /login when auth=false", async () => {
      mockAuthContext.user = null;

      renderWithRouter(<Route path="/test" element={<div />} />, "/profile");

      await waitFor(() => {
        expect(screen.getByText("Login Page")).toBeInTheDocument();
      });
    });

    it("✓ Creator routes check both auth=true and role=CREATOR", () => {
      // Test 1: No auth
      mockAuthContext.user = null;
      const { rerender } = renderWithRouter(
        <Route path="/test" element={<div />} />,
        "/upload"
      );
      expect(screen.queryByText("Upload Page")).not.toBeInTheDocument();

      // Test 2: Auth but wrong role
      mockAuthContext.user = { id: "1", email: "fan@example.com" } as User;
      mockAuthContext.profile = {
        id: "1",
        user_id: "1",
        username: "fan",
        role: "FAN",
      } as Profile;
      rerender(
        <BrowserRouter>
          <Routes>
            <Route path="/upload" element={<CreatorOnlyRoute><UploadPage /></CreatorOnlyRoute>} />
          </Routes>
        </BrowserRouter>
      );
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();

      // Test 3: Auth with correct role
      mockAuthContext.profile.role = "CREATOR";
      rerender(
        <BrowserRouter>
          <Routes>
            <Route path="/upload" element={<CreatorOnlyRoute><UploadPage /></CreatorOnlyRoute>} />
          </Routes>
        </BrowserRouter>
      );
      expect(screen.getByText("Upload Page")).toBeInTheDocument();
    });
  });
});
