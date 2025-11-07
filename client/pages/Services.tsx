import { GlassCard, LuxuryButton, LuxuryInput, LuxuryTextarea } from "@/components/ui/luxury";
import { Heart, Play, Mail, Clock, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Personal Meet & Greet",
      price: "$199",
      duration: "30 minutes",
      description: "One-on-one personal time with exclusive content creators. Take photos, get autographs, and share your story.",
      features: ["Personal conversation", "Photo opportunities", "Signed merchandise", "Exclusive gift"],
      icon: Heart,
      popular: true,
    },
    {
      id: 2,
      name: "Virtual Concert Access",
      price: "$49",
      duration: "2 hours",
      description: "Exclusive access to private virtual concerts and live performances.",
      features: ["HD streaming", "Interactive chat", "Song requests", "Recording access"],
      icon: Play,
      popular: false,
    },
    {
      id: 3,
      name: "Private Message",
      price: "$29",
      duration: "24h response",
      description: "Send a personal message and receive a personalized video response.",
      features: ["Video response", "Personal message", "Fast delivery", "Shareable content"],
      icon: Mail,
      popular: false,
    },
    {
      id: 4,
      name: "Custom Song Request",
      price: "$399",
      duration: "2-3 weeks",
      description: "Commission a personalized song or cover just for you.",
      features: ["Original composition", "Professional recording", "Exclusive rights", "Behind-the-scenes"],
      icon: Star,
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "How far in advance should I book?",
      a: "For the best availability, we recommend booking at least 2-3 weeks in advance. Custom services may require additional time."
    },
    {
      q: "Can I reschedule my booking?",
      a: "Yes! You can reschedule up to 48 hours before your scheduled time. Custom work may have different policies."
    },
    {
      q: "What if I need to cancel?",
      a: "Cancellations made 7+ days in advance receive a full refund. Cancellations within 7 days receive a 50% refund."
    },
    {
      q: "Are the virtual concerts live?",
      a: "Yes! All virtual concerts are performed live with real-time interaction. Recordings are also provided."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
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
                  Exclusive Services
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight leading-tight max-w-5xl mx-auto">
              Get Closer to <br />
              <span className="text-luxury-gold font-light">Your Dreams</span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-xl text-white/60 font-light leading-relaxed">
              Experience personalized interactions and exclusive content designed to bring you closer
              to the music and moments that matter most.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <GlassCard
                key={service.id}
                premium={service.popular}
                className={cn(
                  "luxury-hover-lift relative",
                  service.popular && "ring-2 ring-luxury-gold/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-8 px-4 py-1 rounded-full bg-luxury-gold border border-luxury-gold/30">
                    <span className="text-xs uppercase tracking-widest text-luxury-black font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30">
                    <service.icon className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-extralight text-luxury-gold mb-1">
                      {service.price}
                    </div>
                    <div className="text-xs text-white/50 flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                  {service.name}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <h4 className="text-xs uppercase tracking-wider text-luxury-gold font-semibold mb-4">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <LuxuryButton
                  variant={service.popular ? "gold" : "ghost"}
                  size="lg"
                  className="w-full"
                >
                  Book Now
                </LuxuryButton>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Custom Request Form */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-white/[0.02]"></div>
          <div className="relative container mx-auto px-6 max-w-3xl">
            <GlassCard premium className="p-12">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-luxury-gold" />
                </div>
                <h2 className="text-4xl font-extralight text-white mb-4 tracking-tight">
                  Custom <span className="text-luxury-gold">Request</span>
                </h2>
                <p className="text-white/60 font-light">
                  Have something special in mind? Let's create something unique together.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                      Full Name
                    </label>
                    <LuxuryInput
                      type="text"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                      Email
                    </label>
                    <LuxuryInput
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                    Service Type
                  </label>
                  <select className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/15 rounded-2xl px-6 py-4 text-white focus:bg-white/[0.08] focus:border-luxury-gold/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all">
                    <option value="">Select a service...</option>
                    <option value="meet">Personal Meet & Greet</option>
                    <option value="concert">Virtual Concert</option>
                    <option value="message">Private Message</option>
                    <option value="song">Custom Song Request</option>
                    <option value="other">Other (describe below)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
                    Special Requests
                  </label>
                  <LuxuryTextarea
                    rows={4}
                    placeholder="Tell us about your dream experience..."
                  />
                </div>

                <LuxuryButton variant="gold" size="lg" className="w-full">
                  <Heart className="w-5 h-5 mr-2" />
                  Submit Request
                </LuxuryButton>
              </form>
            </GlassCard>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extralight text-white mb-4 tracking-tight">
              Frequently Asked <span className="text-luxury-gold">Questions</span>
            </h2>
            <p className="text-white/60 text-lg font-light">
              Everything you need to know about our services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((item, index) => (
              <GlassCard
                key={index}
                className="luxury-hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="font-light text-lg text-white mb-3 tracking-tight">
                  {item.q}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  {item.a}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
