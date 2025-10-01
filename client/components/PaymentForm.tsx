import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { usePerformanceTracking } from "@/lib/performance";

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  buttonText?: string;
}

export function PaymentForm({
  onSuccess,
  onError,
  isLoading = false,
  buttonText = "Save Payment Method",
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { trackPayment } = usePerformanceTracking("PaymentForm");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe not loaded");
      return;
    }

    const startTime = trackPayment("create_payment_method_start");
    setProcessing(true);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          type: "card",
        },
      });

      if (error) {
        trackPayment("create_payment_method_error", startTime);
        onError(error.message || "Payment method creation failed");
      } else if (paymentMethod) {
        trackPayment("create_payment_method_success", startTime);
        onSuccess(paymentMethod.id);
      }
    } catch (err: any) {
      trackPayment("create_payment_method_error", startTime);
      onError(err.message || "Payment method creation failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-white/5 rounded-lg border border-gold/20">
        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: false,
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || processing || isLoading}
        className="w-full btn-luxury py-3"
      >
        {processing || isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  );
}
