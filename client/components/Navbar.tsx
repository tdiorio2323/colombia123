import { useState, useEffect } from "react";
import { LuxuryButton } from "@/components/ui/luxury";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({ className, children }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/creators", label: "Creators" },
    { to: "/showcase", label: "Explore" },
    { to: "/community", label: "Community" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-luxury-black/70 backdrop-blur-2xl backdrop-saturate-[180%]",
        "border-b border-white/10",
        "px-8 py-4",
        isScrolled && "bg-luxury-black/85 border-b-luxury-gold/20 shadow-2xl",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Crown className="h-5 w-5 text-luxury-black" />
          </div>
          <div className="text-2xl font-extralight tracking-tight text-luxury-gold">
            HAVANA
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative px-6 py-2 rounded-full",
                "text-white/80 font-medium text-sm uppercase tracking-wider",
                "transition-all duration-200",
                "hover:text-luxury-gold hover:bg-luxury-gold/5",
                "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
                "after:w-0 after:h-0.5 after:bg-luxury-gold",
                "after:transition-all after:duration-300",
                "hover:after:w-3/4",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {children || (
            <>
              <Link to="/login">
                <LuxuryButton variant="ghost" size="sm">
                  Sign In
                </LuxuryButton>
              </Link>
              <Link to="/signup">
                <LuxuryButton variant="gold" size="sm">
                  Join Now
                </LuxuryButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
