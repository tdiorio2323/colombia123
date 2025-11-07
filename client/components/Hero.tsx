import { LuxuryButton } from "@/components/ui/luxury";
import { Link } from "react-router-dom";
import { Crown, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative luxury glow elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-luxury-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-luxury-fade-in">
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-6 py-2 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-luxury-gold text-sm font-semibold tracking-luxury uppercase">
              Havana · Premier Creator Platform
            </span>
          </div>

          {/* Luxury Headline */}
          <h1 className="text-6xl lg:text-8xl font-extralight leading-tight tracking-tighter">
            <span className="text-luxury-white">Premium Content.</span>
            <br />
            <span className="text-luxury-gold font-light">
              Elevated Experience.
            </span>
          </h1>

          {/* Luxury Subheadline */}
          <p className="text-xl lg:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light">
            Connect with exclusive creators. Access premium content. Join a
            luxury community.
          </p>

          {/* Luxury CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <LuxuryButton variant="gold" size="lg">
                <Crown className="mr-2 h-5 w-5" />
                Explore Creators
              </LuxuryButton>
            </Link>
            <Link to="/login">
              <LuxuryButton variant="ghost" size="lg">
                Sign In
              </LuxuryButton>
            </Link>
          </div>

          {/* Luxury Platform stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="luxury-hover-lift">
              <div className="text-4xl font-extralight text-luxury-gold mb-1">
                2.8M+
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40">
                Active Fans
              </div>
            </div>
            <div className="luxury-hover-lift">
              <div className="text-4xl font-extralight text-luxury-gold mb-1">
                15K+
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40">
                Creators
              </div>
            </div>
            <div className="luxury-hover-lift">
              <div className="text-4xl font-extralight text-luxury-gold mb-1">
                $12M+
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40">
                Paid Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
