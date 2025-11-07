import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface LuxuryInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const LuxuryInput = forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-white/[0.05] backdrop-blur-xl",
            "border border-white/15 rounded-2xl",
            "px-6 py-4 text-white placeholder:text-white/40",
            "transition-all duration-250",
            "focus:bg-white/[0.08] focus:border-luxury-gold/50",
            "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]",
            "focus:outline-none",
            "hover:border-white/25",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon && "pl-14",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

LuxuryInput.displayName = "LuxuryInput";

// Luxury Textarea Component
export interface LuxuryTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const LuxuryTextarea = forwardRef<
  HTMLTextAreaElement,
  LuxuryTextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-white/[0.04] backdrop-blur-2xl",
        "border border-white/12 rounded-3xl",
        "px-6 py-5 text-white placeholder:text-white/40",
        "transition-all duration-300",
        "focus:bg-white/[0.06] focus:border-luxury-gold/40",
        "focus:shadow-[0_8px_24px_rgba(212,175,55,0.12)]",
        "focus:outline-none",
        "hover:border-white/20",
        "resize-vertical min-h-[120px]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});

LuxuryTextarea.displayName = "LuxuryTextarea";
