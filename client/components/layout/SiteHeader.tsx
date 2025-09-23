import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Sparkles, X, MessageCircle, Crown, Flame, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Discover", to: "/showcase" },
  { label: "Creators", to: "/community" },
  { label: "Messages", to: "/messages", authRequired: true },
  { label: "Insights", to: "/leaderboard", creatorOnly: true },
];

function MobileNav() {
  return (
    <div className="flex flex-col gap-2">
      {navLinks.map((link) => {
        if (link.authRequired || link.creatorOnly) return null;
        return (
          <SheetClose asChild key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-white/10 text-white shadow-lg shadow-blue-500/10"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )
              }
            >
              {link.label}
              <Flame className="h-4 w-4 opacity-70" />
            </NavLink>
          </SheetClose>
        );
      })}
      <SheetClose asChild>
        <Link to="/signup" className="mt-4">
          <Button className="w-full btn-luxury">Join Premium</Button>
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link to="/login">
          <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white">
            Sign in
          </Button>
        </Link>
      </SheetClose>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const displayName = profile?.displayName || user?.name || user?.email?.split("@")[0] || "Fan";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "glass-nav border-b border-white/10" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue to-purple text-white shadow-lg shadow-blue-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="text-sm uppercase tracking-[0.3em] text-white/60">Aurora</span>
              <p className="text-lg font-semibold text-white">Luxe Studio</p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-between gap-6 lg:flex">
          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
            {navLinks.map((link) => {
              if (link.creatorOnly && user?.role !== "CREATOR") return null;
              if (link.authRequired && !user) return null;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all",
                      isActive
                        ? "bg-white/10 text-white shadow-lg shadow-blue-500/10"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="relative flex items-center gap-3">
            <div className="relative hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:flex">
              <Search className="h-4 w-4 text-white/60" />
              <input
                type="search"
                placeholder="Search creators, tags, or posts"
                className="w-48 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                aria-label="Search"
              />
            </div>
            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-white">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-luxury">Become a member</Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 pr-3 text-left shadow-lg shadow-blue-500/10">
                    <Avatar className="h-9 w-9 border border-white/20">
                      <AvatarImage src={profile?.avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className="bg-blue/40 text-white">
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden leading-tight md:block">
                      <span className="text-sm font-medium text-white">{displayName}</span>
                      <p className="text-[11px] uppercase text-white/40">
                        {user.role === "CREATOR" ? "Creator" : "Premium Fan"}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0f172a] text-white">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex w-full items-center gap-2">
                      <Crown className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "CREATOR" && (
                    <DropdownMenuItem asChild>
                      <Link to="/upload" className="flex w-full items-center gap-2">
                        <Flame className="h-4 w-4" /> Creator studio
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="flex w-full items-center gap-2">
                      <MessageCircle className="h-4 w-4" /> Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void signOut();
                    }}
                    className="text-red-400 focus:text-red-400"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link to="/messages" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80">
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="border-white/10 bg-[#0f172a]/95 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue to-purple text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Aurora Luxe</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Premium Creators
                    </span>
                  </div>
                </div>
                <SheetClose className="rounded-full border border-white/10 p-2">
                  <X className="h-4 w-4" />
                </SheetClose>
              </div>
              <div className="mt-8">
                <MobileNav />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
