import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import {
  Crown,
  Users,
  MessageCircle,
  Heart,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Community() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-32">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-20 animate-luxury-fade-in">
          <div className="w-24 h-24 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-8">
            <Users className="w-12 h-12 text-luxury-gold" />
          </div>

          <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight leading-tight">
            Community Page <br />
            <span className="text-luxury-gold font-light">Coming Soon</span>
          </h1>

          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            We're building an amazing community space with fan interactions,
            exclusive content, leaderboards, and more. Stay tuned for the official launch!
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  Under Development
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <GlassCard className="text-center luxury-hover-lift">
            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-luxury-gold" />
            </div>
            <h3 className="font-light text-xl text-white mb-3 tracking-tight">
              Fan Feed
            </h3>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Share moments and connect with other fans in real-time
            </p>
          </GlassCard>

          <GlassCard className="text-center luxury-hover-lift" premium style={{ animationDelay: "100ms" }}>
            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-luxury-gold" />
            </div>
            <h3 className="font-light text-xl text-white mb-3 tracking-tight">
              Leaderboards
            </h3>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Compete for top fan status and earn exclusive rewards
            </p>
          </GlassCard>

          <GlassCard className="text-center luxury-hover-lift" style={{ animationDelay: "200ms" }}>
            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-luxury-gold" />
            </div>
            <h3 className="font-light text-xl text-white mb-3 tracking-tight">
              Exclusive Content
            </h3>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Access community-only posts and behind-the-scenes content
            </p>
          </GlassCard>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard premium className="p-12">
            <Crown className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
            <h2 className="text-3xl font-extralight text-white mb-6 tracking-tight">
              Be the First to <span className="text-luxury-gold">Know</span>
            </h2>
            <p className="text-white/60 font-light mb-8">
              Get notified when the community launches and receive exclusive early access benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton variant="gold" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Get Notified
              </LuxuryButton>
              <LuxuryButton variant="ghost" size="lg" asChild>
                <Link to="/">Return Home</Link>
              </LuxuryButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
