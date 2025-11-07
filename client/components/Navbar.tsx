import { useState, useEffect } from "react";
import { LuxuryButton } from "@/components/ui/luxury";
import { Crown, User, LogOut, Upload, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({ className, children }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/showcase", label: "Explore" },
    { to: "/shop", label: "Shop" },
    { to: "/community", label: "Community" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out successfully", {
      description: "You've been signed out of your account.",
    });
    navigate("/");
  };

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

        {/* CTA Buttons / User Menu */}
        <div className="flex items-center gap-3">
          {children ||
            (user && profile ? (
              <>
                {/* Quick Actions for logged-in users */}
                {profile.role === "CREATOR" && (
                  <Link to="/upload">
                    <LuxuryButton variant="ghost" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </LuxuryButton>
                  </Link>
                )}

                <Link to="/messages">
                  <LuxuryButton variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </LuxuryButton>
                </Link>

                {/* User Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-luxury-gold/50 transition-all">
                      <Avatar className="h-8 w-8 border-2 border-luxury-gold/30">
                        <AvatarImage
                          src={profile.avatar_url || undefined}
                          alt={profile.display_name || profile.username}
                        />
                        <AvatarFallback className="bg-luxury-gold/20 text-white text-xs">
                          {(profile.display_name || profile.username)
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white/80 text-sm font-light hidden md:inline">
                        {profile.display_name || profile.username}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-luxury-black/95 backdrop-blur-xl border border-white/10"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-light text-white">
                        {profile.display_name || profile.username}
                      </p>
                      <p className="text-xs text-white/50">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                        {profile.role}
                      </span>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-white/10 text-white/80"
                    >
                      <Link to="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-red-500/10 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
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
            ))}
        </div>
      </div>
    </nav>
  );
}
