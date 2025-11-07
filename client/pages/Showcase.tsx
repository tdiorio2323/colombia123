import {
  Shield,
  Crown,
  Star,
  Users,
  Heart,
  Lock,
  BadgeCheck,
  DollarSign,
  Zap,
  Gift,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <GlassCard className="luxury-hover-lift">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30">{icon}</div>
      <h3 className="font-light text-xl text-white tracking-tight">{title}</h3>
    </div>
    <p className="text-sm text-white/60 font-light leading-relaxed">{children}</p>
  </GlassCard>
);

export default function ShowcasePage() {
  const plans = [
    {
      name: "Premium Fan",
      price: "$14.99",
      icon: <Star size={18} className="text-luxury-gold" />,
      features: [
        "Daily photos & videos",
        "Weekly live streams",
        "Behind‑the‑scenes",
      ],
    },
    {
      name: "VIP Supporter",
      price: "$39.99",
      icon: <Crown size={18} className="text-luxury-gold" />,
      features: [
        "Everything in Premium",
        "Private messaging",
        "VIP video calls",
      ],
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-40 w-96 h-96 bg-luxury-gold/4 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-32 text-center">
          <div className="animate-luxury-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  Platform Showcase
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight leading-tight max-w-5xl mx-auto">
              Monetize Your Content, <br />
              <span className="text-luxury-gold font-light">Connect with Your Fans</span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-xl text-white/60 font-light leading-relaxed">
              The ultimate platform for creators to build a powerful, independent business.
              We provide the tools, you provide the talent.
            </p>

            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <LuxuryButton variant="gold" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Features
              </LuxuryButton>
              <LuxuryButton variant="ghost" size="lg">
                Join Now
              </LuxuryButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-white/[0.02]"></div>
          <div className="relative container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extralight text-white mb-4 tracking-tight">
                All The Tools You <span className="text-luxury-gold">Need To Succeed</span>
              </h2>
              <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
                From subscriptions to direct messages, we've got you covered.
              </p>
            </div>

            {/* Subscription Tiers Demo */}
            <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-luxury-fade-in">
                <FeatureCard
                  icon={<Star className="text-luxury-gold" size={24} />}
                  title="Flexible Subscription Tiers"
                >
                  Create multiple tiers of monthly subscriptions to offer exclusive content and perks.
                  You set the price, you set the benefits. Attract casual fans and high-value supporters alike.
                </FeatureCard>
              </div>

              <div className="grid grid-cols-2 gap-6 animate-luxury-fade-in" style={{ animationDelay: "100ms" }}>
                {plans.map((plan, i) => (
                  <GlassCard key={i} className="text-center p-6" premium={i === 1}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {plan.icon}
                      <h3 className="font-light text-sm text-white uppercase tracking-wider">{plan.name}</h3>
                    </div>
                    <div className="text-3xl font-extralight text-luxury-gold mb-1">
                      {plan.price}
                    </div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">/month</span>

                    <ul className="mt-6 space-y-2 text-xs text-left">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white/70">
                          <BadgeCheck size={14} className="text-luxury-gold flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <LuxuryButton variant="gold" size="sm" className="w-full mt-6">
                      Subscribe
                    </LuxuryButton>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* PPV Content Demo */}
            <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-6 animate-luxury-fade-in">
                {[
                  { title: "Exclusive Video", price: "$19.99" },
                  { title: "Behind The Scenes", price: "$9.99" }
                ].map((item, i) => (
                  <GlassCard key={i} className="relative h-56 flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 bg-luxury-black/40 rounded-3xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <Lock size={36} className="text-luxury-gold/60 mb-4" />
                      <p className="text-sm text-white/80 font-light mb-4">{item.title}</p>
                      <LuxuryButton variant="gold" size="sm">
                        Unlock {item.price}
                      </LuxuryButton>
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div className="animate-luxury-fade-in md:order-first" style={{ animationDelay: "100ms" }}>
                <FeatureCard
                  icon={<Lock className="text-luxury-gold" size={24} />}
                  title="Pay-Per-View (PPV) Content"
                >
                  Sell individual photo sets, videos, or other digital content for a one-time fee.
                  Perfect for exclusive drops and maximizing revenue from your most sought-after content.
                </FeatureCard>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Heart className="text-luxury-gold" size={24} />}
                title="Direct Messaging & Tips"
              >
                Engage directly with your fans through private messages. Fans can also send you tips to show their support.
              </FeatureCard>
              <FeatureCard
                icon={<Zap className="text-luxury-gold" size={24} />}
                title="Exclusive Live Streaming"
              >
                Host exclusive live streams for your subscribers. Engage with your audience in real-time and offer unique experiences.
              </FeatureCard>
              <FeatureCard
                icon={<Gift className="text-luxury-gold" size={24} />}
                title="Wishlist & Gifting"
              >
                Allow fans to buy you gifts directly from your wishlist. A fun and personal way for fans to support you.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-24 container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extralight text-white mb-4 tracking-tight">
              Why Choose <span className="text-luxury-gold">Havana?</span>
            </h2>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
              Built for creators, by creators. We understand what you need to succeed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Highest Commission Rate",
                description: "Keep 90% of your earnings. No hidden fees, no surprises. We only make money when you do."
              },
              {
                title: "Fast & Secure Payouts",
                description: "Get paid out weekly directly to your bank account. Your financial security is our priority."
              },
              {
                title: "You Own Your Content",
                description: "You have 100% ownership of your content and your audience. We never lock you in."
              }
            ].map((item, i) => (
              <GlassCard key={i} className="text-center luxury-hover-lift" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
                    <CheckCircle className="text-luxury-gold" size={32} />
                  </div>
                </div>
                <h3 className="font-light text-xl text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">{item.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-white/[0.02]"></div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <h2 className="text-4xl font-extralight text-white mb-12 tracking-tight text-center">
              Loved by <span className="text-luxury-gold">Creators</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote: "This platform changed my life. I'm making more than ever and have a real connection with my fans.",
                  name: "Karol R.",
                  role: "Fashion & Lifestyle Creator",
                  avatar: "https://i.imgur.com/b2oBun3.png"
                },
                {
                  quote: "Finally, a platform that understands the needs of creators. The support is amazing.",
                  name: "Sofia V.",
                  role: "Fitness & Dance Creator",
                  avatar: "https://i.pravatar.cc/150?img=32"
                }
              ].map((testimonial, i) => (
                <GlassCard key={i} premium className="luxury-hover-lift" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start gap-3 mb-4">
                    <Star className="text-luxury-gold flex-shrink-0" size={20} />
                    <Star className="text-luxury-gold flex-shrink-0" size={20} />
                    <Star className="text-luxury-gold flex-shrink-0" size={20} />
                    <Star className="text-luxury-gold flex-shrink-0" size={20} />
                    <Star className="text-luxury-gold flex-shrink-0" size={20} />
                  </div>
                  <p className="text-white/80 font-light leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-luxury-gold/30"
                      loading="lazy"
                      decoding="async"
                      width={48}
                      height={48}
                    />
                    <div>
                      <p className="font-light text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/50 uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-extralight text-white mb-12 tracking-tight text-center">
            Frequently Asked <span className="text-luxury-gold">Questions</span>
          </h2>

          <GlassCard className="space-y-8">
            {[
              {
                question: "How much does it cost?",
                answer: "It's free to create an account. We take a flat 10% commission on your earnings. That's it."
              },
              {
                question: "What kind of content can I post?",
                answer: "You can post photos, videos, and text. All content must adhere to our acceptable use policy."
              },
              {
                question: "How do I get paid?",
                answer: "We pay out weekly via direct bank transfer. You can connect your bank account securely in your dashboard."
              }
            ].map((faq, i) => (
              <div key={i} className={i > 0 ? "pt-8 border-t border-white/10" : ""}>
                <h3 className="font-light text-lg text-white mb-3 tracking-tight">{faq.question}</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </GlassCard>
        </section>

        {/* Call to Action Section */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/5"></div>
          <div className="relative container mx-auto px-6 max-w-4xl text-center">
            <GlassCard premium className="py-16">
              <Crown className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
              <h2 className="text-5xl font-extralight text-white mb-6 tracking-tight">
                Ready to Start <span className="text-luxury-gold">Earning?</span>
              </h2>
              <p className="text-lg text-white/60 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our community of creators and take control of your content and income.
                Signing up is fast and easy.
              </p>
              <LuxuryButton variant="gold" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Become a Creator Today
              </LuxuryButton>
            </GlassCard>
          </div>
        </section>
      </div>
    </main>
  );
}
