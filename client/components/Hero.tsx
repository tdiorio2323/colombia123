import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-semibold tracking-wide">
              Havana · Premier Creator Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl lg:text-8xl font-display font-bold leading-tight">
            <span className="text-white">Elevate Your</span>
            <br />
            <span className="text-accent">Content.</span>
            <br />
            <span className="text-white">Command Your</span>
            <br />
            <span className="text-accent">Audience.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join Havana's most exclusive content creator platform.
            Monetize your audience with luxury branding and seamless payments.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-black font-bold px-8 py-6 text-lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                Apply as Creator
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent/10 px-8 py-6 text-lg"
              >
                Join as Fan
              </Button>
            </Link>
          </div>

          {/* Platform stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-display font-bold text-accent">2.8M+</div>
              <div className="text-sm text-gray-400 mt-1">Active Fans</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-accent">15K+</div>
              <div className="text-sm text-gray-400 mt-1">Creators</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-accent">$12M+</div>
              <div className="text-sm text-gray-400 mt-1">Paid Out</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
