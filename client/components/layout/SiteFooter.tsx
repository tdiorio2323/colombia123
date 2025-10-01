import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Shield, Mail, Heart, Globe } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    items: [
      { label: "Home", to: "/" },
      { label: "Discover", to: "/showcase" },
      { label: "Creators", to: "/community" },
      { label: "Shop", to: "/shop" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Live Events", to: "/calendar" },
      { label: "Smart Reply AI", to: "/smart-reply" },
      { label: "Leaderboard", to: "/leaderboard" },
      { label: "Experiences", to: "/services" },
    ],
  },
  {
    title: "For Creators",
    items: [
      { label: "Creator Hub", to: "/upload" },
      { label: "Insights", to: "/leaderboard" },
      { label: "Profile", to: "/profile" },
      { label: "Messages", to: "/messages" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Twitter, label: "X", href: "https://x.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#050a16]/90">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(36,99,235,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(127,90,240,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,111,97,0.16),transparent_65%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr,1fr,1fr,1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue to-purple text-white shadow-lg shadow-blue-500/30">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Aurora</p>
                <p className="text-lg font-semibold text-white">Luxe Platform</p>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm text-white/60">
              Aurora Luxe elevates subscription content with cinematic storytelling, instant fan access, and concierge-level creator tools.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-white/40">
              <Shield className="h-4 w-4" />
              Bank-grade encryption & 24/7 creator safety desk
            </div>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:-translate-y-0.5 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/55">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} Aurora Labs, Inc.</span>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Globe className="h-4 w-4 text-white/40" />
            <span>Global payouts in 195 countries</span>
            <Mail className="h-4 w-4 text-white/40" />
            <Link to="/press" className="hover:text-white">
              Press inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
