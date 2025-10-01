import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#D4AF37", // gold color
            colorBackground: "#0F172A", // dark background
            colorText: "#FFFFFF",
            colorDanger: "#EF4444",
            fontFamily:
              'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            spacingUnit: "4px",
            borderRadius: "8px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
