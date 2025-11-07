import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Crown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 relative border-t border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-xl flex items-center justify-center">
                <Crown className="h-5 w-5 text-luxury-black" />
              </div>
              <div>
                <span className="text-xl font-light text-luxury-gold tracking-tight">
                  Havana
                </span>
                <div className="text-xs text-white/40 uppercase tracking-wider">Creator Platform</div>
              </div>
            </div>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Premium content creator monetization platform.
              Empowering creators to build sustainable businesses.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-light text-white mb-4 tracking-tight">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  For Creators
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-light text-white mb-4 tracking-tight">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-light text-white mb-4 tracking-tight">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-white/60 hover:text-luxury-gold transition-colors font-light">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm font-light">
              &copy; {new Date().getFullYear()} Havana. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:support@havana.com"
                className="hover:text-luxury-gold transition-colors font-light"
              >
                support@havana.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
