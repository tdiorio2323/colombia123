import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-luxury-black/95 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white rounded-2xl",
          description: "text-white/60",
          actionButton:
            "bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light font-semibold rounded-xl",
          cancelButton:
            "bg-white/10 text-white/80 hover:bg-white/20 rounded-xl",
          success:
            "border-green-500/30 shadow-[0_8px_32px_rgba(34,197,94,0.2)]",
          error: "border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.2)]",
          warning:
            "border-yellow-500/30 shadow-[0_8px_32px_rgba(234,179,8,0.2)]",
          info: "border-luxury-gold/30 shadow-[0_8px_32px_rgba(212,175,55,0.2)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
