import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TipModal } from "./TipModal";
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
  subscriptionPrice: 1499,
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

describe("TipModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it("renders tip modal trigger", () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    expect(
      screen.getByRole("button", { name: /send tip/i }),
    ).toBeInTheDocument();
  });

  it("shows preset amount buttons", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "$5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "$10" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "$25" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "$50" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "$100" })).toBeInTheDocument();
    });
  });

  it("allows custom amount input", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      const customInput = screen.getByPlaceholderText("0");
      expect(customInput).toBeInTheDocument();

      fireEvent.change(customInput, { target: { value: "15" } });
      expect(customInput).toHaveValue("15");
    });
  });

  it("validates minimum tip amount", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      const customInput = screen.getByPlaceholderText("0");
      fireEvent.change(customInput, { target: { value: "0.5" } });
    });

    // Try to proceed with invalid amount
    const nextButton = screen.getByRole("button", { name: /continue to payment/i });
    expect(nextButton).toBeDisabled();
  });

  it("validates maximum tip amount", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      const customInput = screen.getByPlaceholderText("0");
      fireEvent.change(customInput, { target: { value: "1500" } });
    });

    const nextButton = screen.getByRole("button", { name: /continue to payment/i });
    expect(nextButton).toBeDisabled();
  });

  it("handles successful tip processing", async () => {
    const mockOnTipSent = vi.fn();

    // Mock setup intent
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ client_secret: "seti_test_123" }),
    });

    // Mock tip processing
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tip: { id: "tip_test_123" } }),
    });

    renderWithRouter(
      <TipModal creator={mockCreator} onTipSent={mockOnTipSent} />,
    );

    // Open modal and select amount
    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: "$10" }));
    });

    // Proceed to payment
    fireEvent.click(screen.getByRole("button", { name: /continue to payment/i }));

    // Wait for payment form and complete payment
    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Send \$10\.00 Tip/i));

    await waitFor(() => {
      expect(screen.getByText(/tip sent successfully/i)).toBeInTheDocument();
      expect(mockOnTipSent).toHaveBeenCalled();
    });
  });

  it("handles tip processing error", async () => {
    // Mock setup intent
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ client_secret: "seti_test_123" }),
    });

    // Mock tip error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Insufficient funds" }),
    });

    renderWithRouter(<TipModal creator={mockCreator} />);

    // Open modal and select amount
    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: "$10" }));
    });

    // Proceed to payment
    fireEvent.click(screen.getByRole("button", { name: /continue to payment/i }));

    // Complete payment
    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Send \$10\.00 Tip/i));

    await waitFor(() => {
      expect(screen.getByText("Insufficient funds")).toBeInTheDocument();
    });
  });

  it("allows message input", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      const messageInput = screen.getByPlaceholderText("Say something nice...");
      expect(messageInput).toBeInTheDocument();

      fireEvent.change(messageInput, { target: { value: "Great content!" } });
      expect(messageInput).toHaveValue("Great content!");
    });
  });

  it("shows character count for message", async () => {
    renderWithRouter(<TipModal creator={mockCreator} />);

    fireEvent.click(screen.getByRole("button", { name: /send tip/i }));

    await waitFor(() => {
      const messageInput = screen.getByPlaceholderText("Say something nice...");
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      expect(screen.getByText("12/500")).toBeInTheDocument();
    });
  });
});
