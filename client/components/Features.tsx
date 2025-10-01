import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Sparkles, CreditCard } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Monetize Your Audience",
    description:
      "Turn your followers into revenue with subscriptions, tips, and exclusive content. Earn 80% of everything you make.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: Sparkles,
    title: "Exclusive Luxury Branding",
    description:
      "Stand out with premium creator profiles, custom branding, and a luxury platform experience that matches your quality.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description:
      "Get paid fast with automated payouts, secure transactions, and complete financial transparency. No hidden fees.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
];

export default function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-white">Why Choose</span>{" "}
            <span className="text-accent">Havana</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The tools and platform you need to build a thriving creator business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-black/50 border-gray-800 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
