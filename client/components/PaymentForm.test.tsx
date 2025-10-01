import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentForm } from "./PaymentForm";

// Mock Stripe Elements
const mockStripe = {
  createPaymentMethod: vi.fn(),
};

const mockElements = {
  getElement: vi.fn(),
  submit: vi.fn(),
};

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: ({ options }: any) => (
    <div data-testid="payment-element">Mock Payment Element</div>
  ),
  useStripe: () => mockStripe,
  useElements: () => mockElements,
}));

describe("PaymentForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders payment form correctly", () => {
    render(<PaymentForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save payment method/i }),
    ).toBeInTheDocument();
  });

  it("renders submit button correctly", () => {
    render(<PaymentForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const submitButton = screen.getByRole("button", {
      name: /save payment method/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Save Payment Method");
  });

  it("shows loading state when processing payment", () => {
    render(
      <PaymentForm
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        isLoading={true}
      />,
    );

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it("calls onSuccess when payment method is created successfully", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      error: null,
      paymentMethod: { id: "pm_test_123" },
    });

    render(<PaymentForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const submitButton = screen.getByRole("button", {
      name: /save payment method/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("pm_test_123");
    });
  });

  it("calls onError when payment method creation fails", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      error: { message: "Your card was declined." },
      paymentMethod: null,
    });

    render(<PaymentForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const submitButton = screen.getByRole("button", {
      name: /save payment method/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith("Your card was declined.");
    });
  });

  it("uses custom button text when provided", () => {
    render(
      <PaymentForm
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        buttonText="Subscribe Now"
      />,
    );

    expect(
      screen.getByRole("button", { name: /subscribe now/i }),
    ).toBeInTheDocument();
  });
});
