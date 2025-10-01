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
} from "lucide-react";

const FeatureCard = ({ icon, title, children }) => (
  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 transform hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-yellow-300/10 rounded-lg">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <p className="mt-2 text-sm text-neutral-300/80">{children}</p>
  </div>
);

export default function ShowcasePage() {
  const plans = [
    {
      name: "Premium Fan",
      price: "$14.99",
      icon: <Star size={18} className="opacity-80" />,
      features: [
        "Daily photos & videos",
        "Weekly live streams",
        "Behind‑the‑scenes",
      ],
    },
    {
      name: "VIP Supporter",
      price: "$39.99",
      icon: <Crown size={18} className="opacity-80" />,
      features: [
        "Everything in Premium",
        "Private messaging",
        "VIP video calls",
      ],
    },
  ];

  return (
    <main className="min-h-screen w-full text-neutral-100 relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url('https://i.imgur.com/nul7HiI.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/30" />

      {/* Hero Section */}
      <section className="relative text-center py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          Monetize Your Content, Connect with Your Fans
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-neutral-300/90">
          The ultimate platform for Colombian creators to build a powerful,
          independent business. We provide the tools, you provide the talent.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-6 py-3 text-lg font-semibold text-neutral-900 shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-transform"
          >
            Explore Features
          </a>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-lg backdrop-blur hover:bg-white/20 transition">
            Join Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-black/40">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            All The Tools You Need To Succeed
          </h2>
          <p className="mt-2 text-neutral-300/80 text-center max-w-xl mx-auto">
            From subscriptions to direct messages, we've got you covered.
          </p>

          {/* Subscription Tiers Demo */}
          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="md:pr-8">
              <FeatureCard
                icon={<Star className="text-yellow-300" />}
                title="Flexible Subscription Tiers"
              >
                Create multiple tiers of monthly subscriptions to offer
                exclusive content and perks. You set the price, you set the
                benefits. Attract casual fans and high-value supporters alike.
              </FeatureCard>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    {plan.icon}
                    <h3 className="font-semibold text-sm">{plan.name}</h3>
                  </div>
                  <div className="mt-2 text-xl font-bold">
                    {plan.price}
                    <span className="text-xs text-neutral-400 font-normal">
                      /mo
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-left">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <BadgeCheck size={12} className="text-yellow-300" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full rounded-lg bg-yellow-300/80 text-neutral-900 py-1.5 text-xs font-semibold">
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PPV Content Demo */}
          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="md:pl-8 md:order-2">
              <FeatureCard
                icon={<Lock className="text-yellow-300" />}
                title="Pay-Per-View (PPV) Content"
              >
                Sell individual photo sets, videos, or other digital content for
                a one-time fee. Perfect for exclusive drops and maximizing
                revenue from your most sought-after content.
              </FeatureCard>
            </div>
            <div className="grid grid-cols-2 gap-4 md:order-1">
              <div className="relative flex flex-col items-center justify-center h-48 rounded-2xl border border-white/20 bg-white/10 backdrop-blur group p-4">
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Lock size={32} className="text-white/70" />
                  <p className="mt-2 text-xs text-neutral-200/90">
                    Exclusive Video
                  </p>
                  <button className="mt-3 rounded-lg bg-yellow-300 px-3 py-1.5 text-xs font-semibold text-neutral-900">
                    Unlock $19.99
                  </button>
                </div>
              </div>
              <div className="relative flex flex-col items-center justify-center h-48 rounded-2xl border border-white/20 bg-white/10 backdrop-blur group p-4">
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Lock size={32} className="text-white/70" />
                  <p className="mt-2 text-xs text-neutral-200/90">
                    Behind The Scenes
                  </p>
                  <button className="mt-3 rounded-lg bg-yellow-300 px-3 py-1.5 text-xs font-semibold text-neutral-900">
                    Unlock $9.99
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Heart className="text-yellow-300" />}
              title="Direct Messaging & Tips"
            >
              Engage directly with your fans through private messages. Fans can
              also send you tips to show their support.
            </FeatureCard>
            <FeatureCard
              icon={<Zap className="text-yellow-300" />}
              title="Exclusive Live Streaming"
            >
              Host exclusive live streams for your subscribers. Engage with your
              audience in real-time and offer unique experiences.
            </FeatureCard>
            <FeatureCard
              icon={<Gift className="text-yellow-300" />}
              title="Wishlist & Gifting"
            >
              Allow fans to buy you gifts directly from your wishlist. A fun and
              personal way for fans to support you.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Why Choose Us?
          </h2>
          <p className="mt-2 text-neutral-300/80 text-center max-w-xl mx-auto">
            Built for creators, by creators. We understand what you need to
            succeed.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <CheckCircle className="mx-auto text-yellow-300" size={40} />
              <h3 className="mt-4 font-semibold text-lg">
                Highest Commission Rate
              </h3>
              <p className="mt-1 text-sm text-neutral-300/80">
                Keep 90% of your earnings. No hidden fees, no surprises. We only
                make money when you do.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto text-yellow-300" size={40} />
              <h3 className="mt-4 font-semibold text-lg">
                Fast & Secure Payouts
              </h3>
              <p className="mt-1 text-sm text-neutral-300/80">
                Get paid out weekly directly to your bank account. Your
                financial security is our priority.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto text-yellow-300" size={40} />
              <h3 className="mt-4 font-semibold text-lg">
                You Own Your Content
              </h3>
              <p className="mt-1 text-sm text-neutral-300/80">
                You have 100% ownership of your content and your audience. We
                never lock you in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-black/40">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Loved by Colombian Creators
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
              <p className="text-neutral-200">
                "This platform changed my life. I'm making more than ever and
                have a real connection with my fans."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://i.imgur.com/b2oBun3.png"
                  alt="Creator"
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="font-semibold">Karol R.</p>
                  <p className="text-xs text-neutral-400">
                    Fashion & Lifestyle Creator
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
              <p className="text-neutral-200">
                "Finally, a platform that understands the needs of Colombian
                creators. The support is amazing."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="Creator"
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="font-semibold">Sofia V.</p>
                  <p className="text-xs text-neutral-400">
                    Fitness & Dance Creator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            <div>
              <h3 className="font-semibold">How much does it cost?</h3>
              <p className="text-sm text-neutral-300/80">
                It's free to create an account. We take a flat 10% commission on
                your earnings. That's it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                What kind of content can I post?
              </h3>
              <p className="text-sm text-neutral-300/80">
                You can post photos, videos, and text. All content must adhere
                to our acceptable use policy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How do I get paid?</h3>
              <p className="text-sm text-neutral-300/80">
                We pay out weekly via direct bank transfer. You can connect your
                bank account securely in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-yellow-300/90">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-neutral-900">
            Ready to Start Earning?
          </h2>
          <p className="mt-3 text-neutral-800">
            Join our community of Colombian creators and take control of your
            content and income. Signing up is fast and easy.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-lg font-semibold text-white shadow-lg transform hover:scale-105 transition-transform">
            Become a Creator Today
          </button>
        </div>
      </section>
    </main>
  );
}
