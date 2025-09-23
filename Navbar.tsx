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
  User,
  LogOut,
  Upload,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveCount, setLiveCount] = useState(2847521); // Example live count
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
            {user && profile ? (
              // Logged in user navigation
              <>
                {profile.role === "creator" && (
                  <>
                    <Link
                      to="/upload"
                      className="text-gold/80 hover:text-gold transition-colors flex items-center"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload
                    </Link>
                    <Link
                      to="/messages"
                      className="text-gold/80 hover:text-gold transition-colors flex items-center"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Messages
                    </Link>
                  </>
                )}
                {profile.role === "fan" && (
                  <>
                    <Link
                      to="/shop"
                      className="text-gold/80 hover:text-gold transition-colors flex items-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Shop
                    </Link>
                    <Link
                      to="/calendar"
                      className="text-gold/80 hover:text-gold transition-colors flex items-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="text-gold/80 hover:text-gold transition-colors flex items-center"
                >
                  <User className="h-5 w-5 mr-2" />
                  {profile.display_name || profile.username}
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-gold/80 hover:text-gold transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              // Guest navigation
              <>
                <Link
                  to="/shop"
                  className="text-gold/80 hover:text-gold transition-colors flex items-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop
                </Link>
                <Link
                  to="/calendar"
                  className="text-gold/80 hover:text-gold transition-colors flex items-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book
                </Link>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-gold/80 hover:text-gold transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-luxury">
                    <Crown className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
