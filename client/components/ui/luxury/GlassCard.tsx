import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  premium?: boolean;
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  premium = false,
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl p-8 relative",
        "bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-[180%]",
        "border border-white/[0.125]",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
        "transition-all duration-300 ease-out",
        hover &&
          "hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.45)]",
        premium && [
          "bg-gradient-to-br from-luxury-gold/10 via-white/[0.05] to-luxury-gold/10",
          "border-luxury-gold/30",
          "hover:border-luxury-gold/50 hover:shadow-[0_12px_48px_0_rgba(212,175,55,0.2)]",
        ],
        className,
      )}
    >
      {premium && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
      )}
      {children}
    </div>
  );
};
