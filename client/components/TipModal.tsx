import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Creator } from "@shared/api";
import { StripeProvider } from "./StripeProvider";
import { PaymentForm } from "./PaymentForm";
import {
  Heart,
  DollarSign,
  Gift,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TipModalProps {
  creator: Creator;
  className?: string;
  children?: React.ReactNode;
  onTipSent?: () => void;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export function TipModal({
  creator,
  className,
  children,
  onTipSent,
}: TipModalProps) {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "amount" | "payment" | "processing" | "success"
  >("amount");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const getTipAmount = () => {
    if (selectedAmount) return selectedAmount;
    const custom = parseFloat(customAmount);
    return custom > 0 ? custom : 0;
  };

  const handleContinueToPayment = async () => {
    const amount = getTipAmount();

    if (!user || !profile || profile.role !== "FAN") {
      setError("Please sign in as a fan to send tips");
      return;
    }

    if (amount < 1) {
      setError("Minimum tip amount is $1");
      return;
    }

    if (amount > 1000) {
      setError("Maximum tip amount is $1000");
      return;
    }

    setError(null);
    setStep("payment");

    // Create setup intent for payment
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
        throw new Error(data.error || "Payment setup failed");
      }

      setClientSecret(data.client_secret);
    } catch (err: any) {
      setError(err.message || "Payment setup failed");
      setStep("amount");
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    const amount = getTipAmount();
    setStep("processing");
    setError(null);

    try {
      const amountInCents = Math.round(amount * 100);

      const response = await fetch("/api/subscriptions/tip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: creator.userId,
          userId: profile?.userId,
          amount: amountInCents,
          message: message.trim() || undefined,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tip failed");
      }

      setStep("success");
      onTipSent?.();

      // Reset form after success
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Tip failed");
      setStep("payment");
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    setMessage("");
    setError(null);
    setStep("amount");
    setClientSecret(null);
  };

  const goBackToAmount = () => {
    setStep("amount");
    setError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button
            className={cn(
              "btn-luxury group relative overflow-hidden",
              className,
            )}
            onClick={() => {
              setIsOpen(true);
              resetForm();
            }}
          >
            <Heart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-luxury-display tracking-wide">Send Tip</span>
            <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 border-0 bg-transparent max-w-md w-full">
        <DialogTitle className="sr-only">
          {step === "success"
            ? "Tip Sent Successfully"
            : step === "payment"
              ? "Payment Details"
              : step === "processing"
                ? "Processing Payment"
                : "Send a Tip"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Send a tip to the creator. Choose a preset or enter a custom amount, then confirm payment.
        </DialogDescription>
        <Card className="auth-card-luxury border-0 overflow-hidden">
          <CardHeader className="text-center pb-4 relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-lg" />
            </div>

            {/* Header content */}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-gold via-primary to-blue rounded-2xl flex items-center justify-center mx-auto mb-4 animate-luxury-pulse">
                {step === "success" ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : step === "payment" ? (
                  <CreditCard className="h-8 w-8 text-white" />
                ) : (
                  <Gift className="h-8 w-8 text-white" />
                )}
              </div>

              <h1 className="text-3xl font-luxury-display font-bold mb-2">
                <span className="text-gradient-luxury">
                  {step === "success"
                    ? "Tip Sent!"
                    : step === "payment"
                      ? "Payment Details"
                      : step === "processing"
                        ? "Processing..."
                        : "Send a Tip"}
                </span>
              </h1>

              <p className="text-white/80 text-sm font-luxury-script">
                {step === "success"
                  ? `Your tip has been sent to ${creator.displayName || creator.username}!`
                  : step === "payment" || step === "processing"
                    ? `Sending $${getTipAmount().toFixed(2)} tip`
                    : `Show your appreciation to ${creator.displayName || creator.username}`}
              </p>

              <Badge className="glass-card bg-gold/20 text-gold border-gold/30 mt-3 px-3 py-1 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Support Creator
              </Badge>
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
                  Tip Sent Successfully!
                </h3>
                <p className="text-white/70 text-sm">
                  Your support means everything to{" "}
                  {creator.displayName || creator.username}.
                </p>
              </div>
            ) : step === "processing" ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gold mb-2">
                  Processing Tip...
                </h3>
                <p className="text-white/70 text-sm">
                  Please wait while we process your tip.
                </p>
              </div>
            ) : step === "payment" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBackToAmount}
                    className="text-gold hover:text-gold/80 p-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Tip Amount</p>
                    <p className="text-lg font-bold text-gold">
                      ${getTipAmount().toFixed(2)}
                    </p>
                  </div>
                </div>

                {clientSecret ? (
                  <StripeProvider>
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      buttonText={`Send $${getTipAmount().toFixed(2)} Tip`}
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
            ) : (
              <form className="space-y-4">
                {/* Amount Selection */}
                <div>
                  <label className="text-sm font-medium text-gold block mb-3">
                    Choose amount
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {PRESET_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedAmount === amount ? "default" : "outline"
                        }
                        className={cn(
                          "relative text-sm py-2",
                          selectedAmount === amount
                            ? "bg-gold text-background hover:bg-gold/90"
                            : "glass-card border-gold/20 text-gold hover:bg-gold/10",
                        )}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/60">
                      Custom amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold/60" />
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        max="1000"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="auth-input-luxury pl-10 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gold block mb-2">
                    Add a message (optional)
                  </label>
                  <Textarea
                    placeholder="Say something nice..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="auth-input-luxury text-white placeholder:text-white/50 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {message.length}/500
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={getTipAmount() < 1}
                  className="w-full btn-luxury py-3 text-base"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Continue to Payment
                  <span className="ml-auto font-bold">
                    ${getTipAmount().toFixed(2)}
                  </span>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
