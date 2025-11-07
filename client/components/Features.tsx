import { GlassCard } from "@/components/ui/luxury";
import { DollarSign, Sparkles, CreditCard } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Monetize Your Audience",
    description:
      "Turn your followers into revenue with subscriptions, tips, and exclusive content. Earn 80% of everything you make.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Luxury Branding",
    description:
      "Stand out with premium creator profiles, custom branding, and a luxury platform experience that matches your quality.",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description:
      "Get paid fast with automated payouts, secure transactions, and complete financial transparency. No hidden fees.",
  },
];

export default function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-extralight mb-6 tracking-tight">
            <span className="text-white">Why Choose</span>{" "}
            <span className="text-luxury-gold">Havana</span>
          </h2>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
            The tools and platform you need to build a thriving creator business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              className="text-center luxury-hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="font-light text-2xl mb-4 text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/60 font-light leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
