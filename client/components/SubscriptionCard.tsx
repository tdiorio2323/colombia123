import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Creator } from "@shared/api";
import { SubscriptionModal } from "./SubscriptionModal";
import { logError } from "@/lib/logger";
import {
  Crown,
  Heart,
  Star,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  creator: Creator;
  className?: string;
  onSubscriptionChange?: () => void;
}

export function SubscriptionCard({
  creator,
  className,
  onSubscriptionChange,
}: SubscriptionCardProps) {
  const { user, profile } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || !profile) {
        setLoadingSubscription(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/subscriptions/user/${profile.userId}`,
        );
        const data = await response.json();

        if (response.ok) {
          const activeSubscription = data.subscriptions?.find(
            (sub: any) => sub.creator_id === creator.userId && sub.is_active,
          );
          setIsSubscribed(!!activeSubscription);
          setSubscriptionData(activeSubscription);
        }
      } catch (err) {
        logError("Error checking subscription", err as Error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, profile, creator.userId]);

  const handleSubscriptionChange = () => {
    // Refresh subscription status after change
    setIsSubscribed(true);
    onSubscriptionChange?.();
  };

  const handleUnsubscribe = async () => {
    if (!user || !profile || !subscriptionData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId:
            subscriptionData.stripe_subscription_id || subscriptionData.id,
          userId: profile.userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cancellation failed");
      }

      // Update local state to reflect cancellation
      setSubscriptionData({ ...subscriptionData, cancel_at_period_end: true });
      onSubscriptionChange?.();
    } catch (err: any) {
      setError(err.message || "Unsubscribe failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn("auth-card-luxury border-0 overflow-hidden", className)}
    >
      <CardHeader className="text-center pb-4 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-lg" />
        </div>

        {/* Header content */}
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-gold via-primary to-blue rounded-2xl flex items-center justify-center mx-auto mb-4 animate-luxury-pulse">
            <Crown className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-2xl font-luxury-display font-bold mb-2">
            <span className="text-gradient-luxury">VIP Subscription</span>
          </h2>

          <p className="text-white/80 text-sm font-luxury-script mb-3">
            Get exclusive access to {creator.displayName || creator.username}'s
            premium content
          </p>

          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-gold mr-2">
              ${creator.subscriptionPrice || 0}
            </span>
            <span className="text-white/60 text-sm">/month</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="glass-card bg-gold/20 text-gold border-gold/30 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Premium Content
            </Badge>
            <Badge className="glass-card bg-primary/20 text-primary border-primary/30 text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Direct Messages
            </Badge>
            <Badge className="glass-card bg-blue/20 text-blue border-blue/30 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Exclusive Photos
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center mb-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Benefits list */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gold mb-3">
              What you get:
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Access to all premium photos and videos
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Direct messaging with {creator.displayName || creator.username}
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Exclusive live streams and content
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Priority support and responses
              </div>
            </div>
          </div>

          {loadingSubscription ? (
            <Button disabled className="w-full py-3 text-base">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Checking subscription...
            </Button>
          ) : profile?.role === "FAN" ? (
            isSubscribed ? (
              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="w-full py-3 text-base bg-destructive hover:bg-destructive/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Unsubscribing...
                  </>
                ) : (
                  <>
                    Unsubscribe
                    <Heart className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <SubscriptionModal
                creator={creator}
                onSubscriptionChange={handleSubscriptionChange}
              />
            )
          ) : profile?.role === "CREATOR" ? (
            <div className="text-center py-4">
              <p className="text-white/60 text-sm">
                You can't subscribe to other creators as a creator
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/60 text-sm mb-3">
                Sign in as a fan to subscribe
              </p>
              <Button
                variant="outline"
                className="glass-card border-gold/20 text-gold hover:bg-gold/10"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-between text-center pt-4 border-t border-gold/10">
            <div>
              <div className="text-lg font-bold text-gold">
                {creator.subscriberCount}
              </div>
              <div className="text-xs text-white/60">Subscribers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gold">
                {creator.mediaCount}
              </div>
              <div className="text-xs text-white/60">Posts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gold">
                ${(creator.totalEarnings || 0).toLocaleString()}
              </div>
              <div className="text-xs text-white/60">Earned</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
