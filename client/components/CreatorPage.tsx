import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  PlayCircle,
  Clock,
  Lock,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { creators } from "@/data/creators";

export interface Plan {
  name: string;
  price: string;
  desc: string;
  cta: string;
  icon: JSX.Element;
  features: string[];
  popular?: boolean;
  frequency?: string;
}

interface CreatorStat {
  label: string;
  value: string;
}

interface CreatorExperience {
  title: string;
  description: string;
  icon: JSX.Element;
  duration?: string;
}

interface CreatorMedia {
  id: string;
  title: string;
  type: "video" | "photo" | "audio";
  duration?: string;
  thumbnail: string;
  locked?: boolean;
  tier?: string;
}

interface CreatorTestimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

interface CreatorSocial {
  label: string;
  handle: string;
  url: string;
}

export interface Creator {
  username: string;
  displayName: string;
  tagline: string;
  focus: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  description: string;
  tiers: string;
  stats: CreatorStat[];
  plans: Plan[];
  experiences: CreatorExperience[];
  gallery: CreatorMedia[];
  testimonials: CreatorTestimonial[];
  socials: CreatorSocial[];
}

export default function CreatorPage() {
  const { username } = useParams<{ username: string }>();

  const creator = useMemo(
    () => creators.find((profile) => profile.username === username),
    [username],
  );

  if (!creator) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <ShieldCheck className="h-12 w-12 text-white/50" />
          <p className="text-lg text-white/70">Creator studio not found.</p>
          <Button asChild className="btn-luxury">
            <Link to="/showcase">Discover creators</Link>
          </Button>
        </div>
      </div>
    );
  }

  const primaryPlan = creator.plans.find((plan) => plan.popular) ?? creator.plans[0];

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <header className="relative overflow-hidden">
        <img
          src={creator.coverUrl}
          alt="Studio cover"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/70 to-background" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24">
          <div className="grid gap-10 lg:grid-cols-[280px,1fr] lg:items-center">
            <div className="glass-card rounded-3xl border-white/10 bg-white/5 p-6 text-center">
              <Avatar className="mx-auto h-32 w-32 border border-white/15">
                <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
                <AvatarFallback className="bg-blue/30 text-white text-2xl">
                  {creator.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="mt-6 space-y-2 text-white">
                <h1 className="text-2xl font-semibold">{creator.displayName}</h1>
                <p className="text-sm text-white/60">@{creator.username}</p>
                <Badge className="rounded-full border border-white/15 bg-white/10 text-white/70">
                  {creator.focus}
                </Badge>
              </div>
              <div className="mt-6 space-y-3 text-sm text-white/60">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {creator.location}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {creator.tiers}
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Button className="btn-luxury">Subscribe {primaryPlan ? primaryPlan.price : ""}</Button>
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Send a message
                </Button>
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  Follow for updates
                </Button>
              </div>
            </div>

            <div className="space-y-8 text-white">
              <div className="space-y-4">
                <Badge className="rounded-full border border-white/10 bg-white/10 text-white/70">
                  Premium studio
                </Badge>
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  {creator.tagline}
                </h2>
                <p className="max-w-3xl text-base text-white/70">
                  {creator.description}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {creator.stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white/50">
                {creator.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  >
                    {social.label} · {social.handle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-16 flex max-w-6xl flex-col gap-16 px-6">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Membership tiers</h3>
              <p className="mt-2 text-sm text-white/60">
                Every tier unlocks more intimacy, creative control, and bespoke drops.
              </p>
            </div>
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Compare perks
            </Button>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {creator.plans.map((plan) => (
              <Card
                key={plan.name}
                className={`glass-card border-white/10 bg-white/5 ${plan.popular ? "ring-2 ring-accent/40" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-white/15 bg-white/5 p-2 text-white/80">
                      {plan.icon}
                    </span>
                    <div>
                      <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        {plan.frequency ?? "Monthly"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/60">{plan.desc}</p>
                  <div className="mt-6 flex items-end gap-2 text-white">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    <span className="text-xs text-white/40">per month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-white/65">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Star className="mt-0.5 h-3.5 w-3.5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-white/10 text-white hover:bg-white/20">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Signature experiences</h3>
              <p className="mt-2 text-sm text-white/60">
                Limited-run salons and immersive fan journeys curated for each tier.
              </p>
            </div>
            <Badge className="rounded-full border border-white/15 bg-white/10 text-white/60">
              Concierge managed
            </Badge>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {creator.experiences.map((experience) => (
              <Card key={experience.title} className="glass-card border-white/10 bg-white/5">
                <CardHeader>
                  <div className="flex items-center gap-3 text-white">
                    <span className="rounded-2xl border border-white/15 bg-white/5 p-3">
                      {experience.icon}
                    </span>
                    <CardTitle className="text-xl">{experience.title}</CardTitle>
                  </div>
                  <p className="text-sm text-white/60">{experience.description}</p>
                </CardHeader>
                {experience.duration && (
                  <CardContent className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {experience.duration}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Latest drops</h3>
              <p className="mt-2 text-sm text-white/60">
                Premium scenes, interactive livestreams, and backstage diaries updated weekly.
              </p>
            </div>
            <Button variant="ghost" className="text-white/70 hover:text-white">
              View archive
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {creator.gallery.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 w-full space-y-3 p-5 text-white">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center gap-2 uppercase tracking-[0.3em]">
                      {item.type}
                      {item.duration && (
                        <span className="flex items-center gap-1 text-white/60">
                          <Clock className="h-3.5 w-3.5" /> {item.duration}
                        </span>
                      )}
                    </span>
                    {item.locked && (
                      <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em]">
                        <Lock className="h-3 w-3" />
                        {item.tier ?? "Premium"}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10">
            <div className="grid gap-10 md:grid-cols-[1.1fr,1fr]">
              <div>
                <h3 className="text-2xl font-semibold text-white">What the inner circle says</h3>
                <p className="mt-2 text-sm text-white/60">
                  Fan testimonials and partner brands sharing why {creator.displayName} stays booked.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                  <Sparkles className="h-4 w-4" /> 98% retention
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                  <PlayCircle className="h-4 w-4" /> Weekly premieres
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {creator.testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="glass-card border-white/10 bg-white/5">
                  <CardContent className="space-y-6 p-6">
                    <p className="text-sm text-white/75">“{testimonial.quote}”</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/15">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-blue/20 text-white">
                          {testimonial.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-white">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-xs text-white/50">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
