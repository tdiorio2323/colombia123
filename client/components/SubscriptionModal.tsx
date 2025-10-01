import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Creator } from "@shared/api";
import { StripeProvider } from "./StripeProvider";
import { PaymentForm } from "./PaymentForm";
import {
  Crown,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionModalProps {
  creator: Creator;
  className?: string;
  children?: React.ReactNode;
  onSubscriptionChange?: () => void;
}

export function SubscriptionModal({
  creator,
  className,
  children,
  onSubscriptionChange,
}: SubscriptionModalProps) {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"payment" | "processing" | "success">(
    "payment",
  );

  // Create setup intent when modal opens
  useEffect(() => {
    if (isOpen && profile && !clientSecret) {
      createSetupIntent();
    }
  }, [isOpen, profile]);

  const createSetupIntent = async () => {
    if (!profile) return;

    try {
      const response = await fetch("/api/subscriptions/setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create setup intent");
      }

      setClientSecret(data.client_secret);
    } catch (err: any) {
      setError(err.message || "Payment setup failed");
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: creator.userId,
          userId: profile?.userId,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStep("success");
      onSubscriptionChange?.();

      // Close modal after success
      setTimeout(() => {
        setIsOpen(false);
        setStep("payment");
        setClientSecret(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Subscription failed");
      setStep("payment");
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetModal = () => {
    setStep("payment");
    setError(null);
    setClientSecret(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetModal();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button
            className={cn(
              "btn-luxury group relative overflow-hidden",
              className,
            )}
            onClick={() => setIsOpen(true)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Subscribe Now
            <Crown className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 border-0 bg-transparent max-w-md w-full">
        <DialogTitle className="sr-only">
          {step === "success"
            ? "Subscription Successful"
            : step === "processing"
              ? "Processing Subscription"
              : "Subscribe to Creator"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Complete subscription by confirming your payment method and reviewing the plan details.
        </DialogDescription>
        <Card className="auth-card-luxury border-0 overflow-hidden">
          <CardHeader className="text-center pb-4 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-lg" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-gold via-primary to-blue rounded-2xl flex items-center justify-center mx-auto mb-4 animate-luxury-pulse">
                {step === "success" ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <Crown className="h-8 w-8 text-white" />
                )}
              </div>

              <h2 className="text-2xl font-luxury-display font-bold mb-2">
                <span className="text-gradient-luxury">
                  {step === "success" ? "Welcome to VIP!" : "Subscribe to VIP"}
                </span>
              </h2>

              <p className="text-white/80 text-sm font-luxury-script">
                {step === "success"
                  ? `You're now subscribed to ${creator.displayName || creator.username}!`
                  : `Get exclusive access to ${creator.displayName || creator.username}'s content`}
              </p>

              {step !== "success" && (
                <div className="flex items-center justify-center mt-3">
                  <span className="text-3xl font-bold text-gold mr-2">
                    ${((creator.subscriptionPrice || 1499) / 100).toFixed(2)}
                  </span>
                  <span className="text-white/60 text-sm">/month</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center mb-4">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {step === "success" ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gold mb-2">
                  Subscription Active!
                </h3>
                <p className="text-white/70 text-sm">
                  You now have access to all premium content.
                </p>
              </div>
            ) : step === "processing" ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gold mb-2">
                  Processing...
                </h3>
                <p className="text-white/70 text-sm">
                  Setting up your subscription...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 text-gold mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gold mb-3">
                    Enter your payment details
                  </h3>
                </div>

                {clientSecret ? (
                  <StripeProvider>
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isLoading={isLoading}
                      buttonText={`Subscribe for $${((creator.subscriptionPrice || 1499) / 100).toFixed(2)}/month`}
                    />
                  </StripeProvider>
                ) : (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto mb-2" />
                    <p className="text-white/60 text-sm">
                      Setting up payment...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
