import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Crown,
  ShoppingCart,
  Users,
  Calendar,
  Sparkles,
  Ship,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({ className, children }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-nav py-4" : "bg-transparent py-6",
        className
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold via-primary to-blue rounded-xl flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-luxury-display font-bold text-gold">
                Eimy Contreras
              </h1>
              <p className="text-sm text-gold/80 font-luxury-script">
                Colombian Luxury
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/services"
              className="text-white/90 hover:text-gold transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/shop"
              className="text-white/90 hover:text-gold transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/community"
              className="text-white/90 hover:text-gold transition-colors"
            >
              Community
            </Link>
            <Link
              to="/calendar"
              className="text-white/90 hover:text-gold transition-colors"
            >
              Book
            </Link>
          </div>
          {children}
        </div>
      </div>
    </nav>
  );
}