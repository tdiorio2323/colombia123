import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
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

  const handleTip = async () => {
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

    setIsLoading(true);
    setError(null);

    try {
      // Convert to cents for Stripe API
      const amountInCents = Math.round(amount * 100);

      // TODO: Implement payment method collection with Stripe Elements
      // For now, this will fail without a payment method
      const response = await fetch("/api/subscriptions/tip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: creator.userId,
          userId: profile.userId,
          amount: amountInCents,
          message: message.trim() || undefined,
          // paymentMethodId: 'pm_card_visa', // TODO: Get from Stripe Elements
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tip failed");
      }

      setStatus("success");
      onTipSent?.();

      // Reset form after success
      setTimeout(() => {
        setIsOpen(false);
        setSelectedAmount(null);
        setCustomAmount("");
        setMessage("");
        setStatus("idle");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Tip failed");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    setMessage("");
    setError(null);
    setStatus("idle");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <Gift className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-luxury-display font-bold mb-2">
                <span className="text-gradient-luxury">Send a Tip</span>
              </h2>

              <p className="text-white/80 text-sm font-luxury-script">
                Show your appreciation for{" "}
                {creator.displayName || creator.username}
              </p>

              <Badge className="glass-card bg-gold/20 text-gold border-gold/30 mt-3 px-3 py-1 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Support Creator
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2 space-y-4">
            {status === "success" && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <div className="text-center">
                  <div className="font-medium">Tip Sent Successfully!</div>
                  <div className="text-xs opacity-80">
                    Thank you for supporting{" "}
                    {creator.displayName || creator.username}
                  </div>
                </div>
              </div>
            )}

            {status !== "success" && (
              <>
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                {/* Preset amounts */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gold">
                    Choose Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={cn(
                          "glass-card border-gold/20 text-gold hover:bg-gold/10 transition-all duration-300",
                          selectedAmount === amount &&
                            "bg-gold/20 border-gold/40",
                        )}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Custom Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    max="1000"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="auth-input-luxury text-white placeholder:text-white/50"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Send a sweet message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="auth-input-luxury text-white placeholder:text-white/50 resize-none"
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-white/50">
                    {message.length}/200
                  </div>
                </div>

                {/* Amount display */}
                {getTipAmount() > 0 && (
                  <div className="p-3 bg-gold/10 rounded-lg text-center">
                    <div className="text-lg font-bold text-gold">
                      ${getTipAmount().toFixed(2)}
                    </div>
                    <div className="text-xs text-white/70">
                      Total tip amount
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleTip}
                  disabled={isLoading || getTipAmount() < 1}
                  className="w-full btn-luxury py-3 text-base relative overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Sending tip...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Send ${getTipAmount().toFixed(2)} Tip
                      <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </Button>
              </>
            )}

            {profile?.role !== "FAN" && (
              <div className="text-center py-4 border-t border-gold/10">
                <p className="text-white/60 text-sm">
                  {profile?.role === "CREATOR"
                    ? "Creators can't tip other creators"
                    : "Sign in as a fan to send tips"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
