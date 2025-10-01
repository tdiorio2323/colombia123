import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Crown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 relative border-t border-gray-800">
      <div className="absolute inset-0 bg-black"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-black" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-accent">
                  Colombia123
                </span>
                <div className="text-xs text-gray-500">Creator Platform</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Colombia's premier content creator monetization platform.
              Empowering creators to build sustainable businesses.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  For Creators
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Colombia123. All rights reserved.
              Made with 💛 in Colombia 🇨🇴
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:support@colombia123.com"
                className="hover:text-accent transition-colors"
              >
                support@colombia123.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
