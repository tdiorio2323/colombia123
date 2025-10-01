import { useMemo } from "react";
import { Shield, Crown, Star, Users, Heart, Lock, BadgeCheck } from "lucide-react";

export interface Plan {
  name: string;
  price: string;
  desc: string;
  cta: string;
  icon: JSX.Element;
  features: string[];
  popular?: boolean;
}

export interface Creator {
  username: string;
  displayName: string;
  tagline: string;
  avatarUrl: string;
  description: string;
  plans: Plan[];
}

interface CreatorPageProps {
  creator: Creator;
}

export default function CreatorPage({ creator }: CreatorPageProps) {
  return (
    <main
      className="min-h-screen w-full text-neutral-100 relative overflow-hidden"
    >
      {/* Luxury Colombian Flag Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            linear-gradient(to bottom, #fcd116 0 33.3%, #003893 33.3% 66.6%, #ce1126 66.6% 100%)
          `,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      />

      {/* Metallic luxury overlays */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(255,255,255,0.2), transparent 60%),
            radial-gradient(circle at bottom right, rgba(255,215,0,0.15), transparent 70%),
            linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(35deg, rgba(255,215,0,0.1) 0%, transparent 60%)
          `,
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/black-linen.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      {/* Hero / Profile */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-[360px,1fr] md:items-center">
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
              <img
                src={creator.avatarUrl}
                alt={`${creator.username} profile`}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 [box-shadow:inset_0_-120px_120px_-80px_rgba(0,0,0,0.8)]">
                <div className="text-sm font-medium">@{creator.username}</div>
                <div className="text-xs text-neutral-300/80">{creator.tagline}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="rounded-xl bg-yellow-300 px-3 py-1.5 text-xs font-semibold text-neutral-900">
                    Follow
                  </button>
                  <button className="rounded-xl bg-white/10 px-3 py-1.5 text-xs">Message</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <Lock size={14} /> Colombian Content Creator
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
              {creator.displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-200/90">
              {creator.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg shadow-yellow-500/30"
              >
                VIP Access <Crown size={16} />
              </a>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/20 transition">
                Send Tip <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 bg-black/60 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Subscription Plans
          </h2>
          <p className="mt-2 text-neutral-300/80 text-center max-w-xl mx-auto">
            Choose your level of premium access with perks designed for real fans.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {creator.plans.map((plan, i) => (
              <div
                key={i}
                className="flex flex-col justify-between h-full rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur text-center hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/20 transition"
              >
                <div>
                  <div className="flex items-center justify-center gap-2">
                    {plan.icon}
                    <h3 className="font-semibold">{plan.name}</h3>
                  </div>
                  {plan.popular && (
                    <div className="mt-1 text-xs text-yellow-300 font-medium">
                      Most Popular
                    </div>
                  )}
                  <p className="mt-3 text-sm text-neutral-300/80 min-h-[48px] flex items-center justify-center">
                    {plan.desc}
                  </p>
                  <div className="mt-3 text-2xl font-bold">
                    {plan.price}
                    <span className="text-sm text-neutral-400 font-normal">/month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-left">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <BadgeCheck size={14} className="text-yellow-300" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-6 w-full rounded-xl bg-yellow-300 text-neutral-900 py-2 font-semibold shadow-md shadow-yellow-500/30">
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          
          {/* PPV / Unlock Paywall */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-center h-56 rounded-2xl border border-white/20 bg-white/10 backdrop-blur group hover:bg-white/15 transition p-6"
              >
                {/* Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm" />

                {/* Content on top of overlay */}
                <div className="relative z-10 flex flex-col items-center">
                  <Lock size={40} className="text-white/70 group-hover:text-yellow-300 transition" />
                  <p className="mt-3 text-sm text-neutral-200/90">Exclusive PPV Drop</p>
                  <button className="mt-4 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-md shadow-yellow-500/30 hover:bg-yellow-400 transition">
                    Unlock $9.99
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
