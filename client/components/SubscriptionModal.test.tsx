import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SubscriptionModal } from "./SubscriptionModal";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user123" },
    profile: { userId: "user123", role: "FAN" },
  }),
}));

vi.mock("./StripeProvider", () => ({
  StripeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("./PaymentForm", () => ({
  PaymentForm: ({ onSuccess, onError, buttonText }: any) => (
    <div data-testid="payment-form">
      <button onClick={() => onSuccess("pm_test_123")}>{buttonText}</button>
      <button onClick={() => onError("Test error")}>Trigger Error</button>
    </div>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

const mockCreator = {
  id: "creator123",
  userId: "creator123",
  username: "testcreator",
  displayName: "Test Creator",
  role: "CREATOR" as const,
  subscriptionPrice: 1499, // $14.99 in cents
  tipEnabled: true as const,
  mediaCount: 50,
  subscriberCount: 100,
  totalEarnings: 5000,
  isVerified: true,
  subscriptionCount: 0,
  totalSpent: 0,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SubscriptionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it("renders subscription modal trigger", () => {
    renderWithRouter(<SubscriptionModal creator={mockCreator} />);

    expect(
      screen.getByRole("button", { name: /subscribe now/i }),
    ).toBeInTheDocument();
  });

  it("shows subscription price correctly", async () => {
    renderWithRouter(<SubscriptionModal creator={mockCreator} />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /subscribe now/i }));

    await waitFor(() => {
      expect(screen.getByText("$14.99")).toBeInTheDocument();
      expect(screen.getByText("/month")).toBeInTheDocument();
    });
  });

  it("creates setup intent when modal opens", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ client_secret: "seti_test_123" }),
    });

    renderWithRouter(<SubscriptionModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /subscribe now/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/subscriptions/setup-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user123" }),
        },
      );
    });
  });

  it("handles successful subscription", async () => {
    const mockOnSubscriptionChange = vi.fn();

    // Mock setup intent
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ client_secret: "seti_test_123" }),
    });

    // Mock subscription creation
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ subscription: { id: "sub_test_123" } }),
    });

    renderWithRouter(
      <SubscriptionModal
        creator={mockCreator}
        onSubscriptionChange={mockOnSubscriptionChange}
      />,
    );

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /subscribe now/i }));

    // Wait for setup intent and payment form
    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });

    // Trigger successful payment
    fireEvent.click(screen.getByText(/Subscribe for \$14\.99\/month/i));

    await waitFor(() => {
      expect(screen.getByText(/subscription active/i)).toBeInTheDocument();
      expect(mockOnSubscriptionChange).toHaveBeenCalled();
    });
  });

  it("handles subscription error", async () => {
    // Mock setup intent
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ client_secret: "seti_test_123" }),
    });

    // Mock subscription error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Payment failed" }),
    });

    renderWithRouter(<SubscriptionModal creator={mockCreator} />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /subscribe now/i }));

    // Wait for payment form
    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });

    // Trigger payment
    fireEvent.click(screen.getByText(/Subscribe for \$14\.99\/month/i));

    await waitFor(() => {
      expect(screen.getByText("Payment failed")).toBeInTheDocument();
    });
  });

  it("shows loading state during setup intent creation", async () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithRouter(<SubscriptionModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /subscribe now/i }));

    await waitFor(() => {
      expect(screen.getByText(/setting up payment/i)).toBeInTheDocument();
    });
  });
});
