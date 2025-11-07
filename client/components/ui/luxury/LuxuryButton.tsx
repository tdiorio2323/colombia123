import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface LuxuryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  (
    { variant = "primary", size = "md", children, className, ...props },
    ref,
  ) => {
    const baseClasses =
      "relative overflow-hidden transition-all duration-300 font-semibold uppercase tracking-wider inline-flex items-center justify-center active:scale-95 hover:scale-[1.02]";

    const variantClasses = {
      primary: cn(
        "bg-gradient-to-br from-luxury-charcoal to-luxury-slate",
        "text-luxury-gold border border-luxury-gold/30",
        "hover:border-luxury-gold/60 hover:shadow-[0_6px_24px_rgba(212,175,55,0.25)]",
        "hover:bg-gradient-to-br hover:from-luxury-slate hover:to-luxury-charcoal",
        "active:shadow-[0_4px_16px_rgba(212,175,55,0.2)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      ),
      gold: cn(
        "bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold",
        "text-luxury-black border-none",
        "shadow-[0_8px_24px_rgba(212,175,55,0.4)]",
        "hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)]",
        "hover:bg-gradient-to-r hover:from-luxury-gold-light hover:via-luxury-gold hover:to-luxury-gold-light",
        "active:shadow-[0_6px_20px_rgba(212,175,55,0.5)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      ),
      ghost: cn(
        "bg-transparent border border-white/20",
        "text-white hover:bg-white/10",
        "hover:border-white/40",
        "active:bg-white/5",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      ),
    };

    const sizeClasses = {
      sm: "px-6 py-2 text-sm rounded-full",
      md: "px-10 py-3.5 text-base rounded-full",
      lg: "px-12 py-4 text-lg rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && (
          <div className="absolute inset-0 bg-luxury-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
        )}
      </button>
    );
  },
);

LuxuryButton.displayName = "LuxuryButton";
