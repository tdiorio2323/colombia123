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
import React from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveCount, setLiveCount] = useState(2847521); // Example live count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 30) + 10);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
      } ${className}`}
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
                Colombian Goddess
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/shop" className="text-gold/80 hover:text-gold transition-colors flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shop
            </Link>
            <Link to="/calendar" className="text-gold/80 hover:text-gold transition-colors flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book
            </Link>
            {/* You can add more navigation items here */}
            {/* Example: <Button variant="ghost" className="text-gold">Sign In</Button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
