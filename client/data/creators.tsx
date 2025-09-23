import {
  Camera,
  Sparkles,
  Users,
  Video,
  Crown,
  Mic,
  Clapperboard,
  Flame,
} from "lucide-react";

import type { Creator, Plan } from "@/components/CreatorPage";

const defaultPlans = (overrides?: Partial<Plan>[]) => {
  const base: Plan[] = [
    {
      name: "Preview",
      price: "Free",
      desc: "Curated teasers, public posts, and access to community announcements.",
      cta: "Follow for free",
      icon: <Users size={18} className="text-white/70" />,
      features: ["Weekly open posts", "Fan forums", "Drop reminders"],
      frequency: "Always on",
    },
    {
      name: "Premium",
      price: "$24",
      desc: "Full storyline access, livestream lounges, and direct messaging priority.",
      cta: "Subscribe now",
      icon: <Sparkles size={18} className="text-accent" />,
      features: [
        "4K episodes & vault",
        "Weekly live premieres",
        "Priority DMs",
        "Merch drops",
      ],
      popular: true,
      frequency: "Monthly",
    },
    {
      name: "Constellation",
      price: "$88",
      desc: "Concierge content requests, backstage salons, and quarterly gift capsules.",
      cta: "Apply for Constellation",
      icon: <Crown size={18} className="text-gold" />,
      features: [
        "Monthly custom scene",
        "Private live salons",
        "Annual retreat priority",
        "Signed limited editions",
      ],
      frequency: "Monthly",
    },
  ];

  if (!overrides) return base;
  return base.map((plan, index) => ({ ...plan, ...(overrides[index] ?? {}) }));
};

export const creators: Creator[] = [
  {
    username: "noa_velas",
    displayName: "Noa Velas",
    tagline: "Neo-burlesque artist creating cinematic love letters every Friday night.",
    focus: "Cinematic performance",
    location: "Barcelona · Global",
    avatarUrl: "https://images.unsplash.com/photo-1619810167281-23ea7a4730da?auto=format&fit=crop&w=240&q=80",
    coverUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description:
      "I choreograph lush narrative series that blend burlesque, spoken word, and surreal visuals. Expect bespoke premieres, interactive salons, and immersive storytelling built for superfans.",
    tiers: "3 membership tiers · 98% retention",
    stats: [
      { label: "Active members", value: "18,200" },
      { label: "Avg tip / stream", value: "$162" },
      { label: "Premiere cadence", value: "Weekly" },
    ],
    plans: defaultPlans(),
    experiences: [
      {
        title: "Velvet Premiere Nights",
        description: "Friday livestream premieres with live scoring, moderated Q&A, and gift overlays.",
        icon: <Video size={20} className="text-accent" />,
        duration: "90 minutes · Premium",
      },
      {
        title: "Constellation Salons",
        description: "Small-group salons diving into choreography, costuming, and creative process.",
        icon: <Sparkles size={20} className="text-white" />,
        duration: "Monthly · Constellation",
      },
      {
        title: "Bespoke Storyboards",
        description: "Collaborate on custom scene concepts crafted around your fantasies and fandoms.",
        icon: <Camera size={20} className="text-white" />,
        duration: "Delivered quarterly",
      },
    ],
    gallery: [
      {
        id: "velvet-01",
        title: "Episode 12 · Midnight Cathedral",
        type: "video",
        duration: "18:27",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Premium",
      },
      {
        id: "velvet-02",
        title: "Dress rehearsal polaroids",
        type: "photo",
        thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        locked: false,
      },
      {
        id: "velvet-03",
        title: "Salon excerpt · On the process",
        type: "audio",
        duration: "08:42",
        thumbnail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Constellation",
      },
    ],
    testimonials: [
      {
        quote: "Noa's premieres feel like indie film launches every single week—Aurora makes the experience effortless.",
        name: "Maya Rivers",
        title: "Film curator & premium member",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
      {
        quote: "Partnering with Noa on capsule drops has generated sell-outs in minutes thanks to the Aurora commerce overlays.",
        name: "LightHaus Studios",
        title: "Brand collaborator",
        avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
      },
    ],
    socials: [
      { label: "Instagram", handle: "@noavelas", url: "https://instagram.com" },
      { label: "TikTok", handle: "@velvetlabs", url: "https://tiktok.com" },
      { label: "Discord", handle: "Velvet Vault", url: "https://discord.com" },
    ],
  },
  {
    username: "atlas_flux",
    displayName: "Atlas Flux",
    tagline: "Cyber sculptor streaming AI-made lovers & interactive worldbuilding.",
    focus: "Immersive worldbuilding",
    location: "Berlin · Virtual",
    avatarUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=240&q=80",
    coverUrl: "https://images.unsplash.com/photo-1520376499210-8293d1d9c4b3?auto=format&fit=crop&w=1600&q=80",
    description:
      "Atlas blends analog sculpture, volumetric capture, and AI co-creation to premiere intimate sci-fi love stories. Members vote on plotlines, unlock AR artifacts, and co-write futures.",
    tiers: "3 tiers · Multi-device",
    stats: [
      { label: "Immersive fans", value: "12,870" },
      { label: "AR artifacts shipped", value: "3,214" },
      { label: "Avg session", value: "72 min" },
    ],
    plans: defaultPlans([
      undefined,
      {
        price: "$29",
        desc: "Story universes, AR artifacts, and interactive AI co-creation nights.",
        features: [
          "Weekly cinematic drops",
          "Interactive polls",
          "AR artifact claims",
          "Backstage worldbuilding",
        ],
      },
      {
        price: "$110",
        desc: "Executive producer credit, custom avatars, and holographic keepsakes.",
        features: [
          "Custom AI avatar",
          "Producer room access",
          "Annual holographic print",
          "Signed concept art",
        ],
      },
    ]),
    experiences: [
      {
        title: "Feedback loops",
        description: "Members co-script episodes live while Atlas sculpts scenes in Unreal Engine.",
        icon: <Clapperboard size={20} className="text-accent" />,
        duration: "Bi-weekly",
      },
      {
        title: "Artifact studio",
        description: "3D print meetups where fans customize artifacts shipped worldwide.",
        icon: <Camera size={20} className="text-white" />,
        duration: "Monthly",
      },
      {
        title: "Pulse transmissions",
        description: "Private binaural audio drops paired with reactive light sculptures.",
        icon: <Mic size={20} className="text-white" />,
        duration: "Weekly",
      },
    ],
    gallery: [
      {
        id: "atlas-01",
        title: "Episode 5 · Lovers in latency",
        type: "video",
        duration: "21:04",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Premium",
      },
      {
        id: "atlas-02",
        title: "Artifact blueprint",
        type: "photo",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "atlas-03",
        title: "Pulse transmission 008",
        type: "audio",
        duration: "12:11",
        thumbnail: "https://images.unsplash.com/photo-1517430816045-df4b7de27c31?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Constellation",
      },
    ],
    testimonials: [
      {
        quote: "Atlas gives fans authorship in the story. Our agency hasn\'t seen engagement like this anywhere else.",
        name: "Pulse Collective",
        title: "Creative agency partner",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
      {
        quote: "Interactive sci-fi romance at this fidelity is a revelation—Aurora\'s tech keeps it seamless.",
        name: "Devi",
        title: "Constellation member",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
    ],
    socials: [
      { label: "Instagram", handle: "@atlasflux", url: "https://instagram.com" },
      { label: "Twitch", handle: "atlas.live", url: "https://twitch.tv" },
      { label: "Patreon", handle: "atlasflux", url: "https://patreon.com" },
    ],
  },
  {
    username: "liv_rose",
    displayName: "Liv Rose",
    tagline: "Soulful songwriter sharing private studio sessions and lover letters from tour.",
    focus: "Music & intimacy",
    location: "Los Angeles · Touring",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    coverUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    description:
      "Liv writes ballads that double as love spells. Subscribers get raw studio takes, annotated lyrics, and midnight confessionals recorded from the tour bus.",
    tiers: "3 tiers · Global audience",
    stats: [
      { label: "Premium fans", value: "22,940" },
      { label: "Avg tip", value: "$48" },
      { label: "Monthly originals", value: "6" },
    ],
    plans: defaultPlans([
      undefined,
      {
        price: "$19",
        desc: "Private acoustic sets, lyric vault, and fan-requested covers every month.",
        features: [
          "Weekly acoustic livestream",
          "Lyric annotations",
          "Fan cover voting",
          "Tour diary drops",
        ],
      },
      {
        price: "$72",
        desc: "Backstage passes, custom lullabies, and handwritten letters mailed quarterly.",
        features: [
          "Custom lullaby",
          "Backstage meet & greet",
          "Quarterly handwritten letter",
          "Signed vinyl",
        ],
      },
    ]),
    experiences: [
      {
        title: "Midnight voicemail",
        description: "Late-night confessional voicemails recorded after shows and shared exclusively.",
        icon: <Mic size={20} className="text-white" />,
        duration: "Weekly",
      },
      {
        title: "Hotel suite sessions",
        description: "Private acoustic performances streamed from tour hotel suites.",
        icon: <Video size={20} className="text-accent" />,
        duration: "Bi-weekly",
      },
      {
        title: "Love letter lab",
        description: "Collaborate on lyric lines and write love letters scored live by Liv.",
        icon: <Flame size={20} className="text-white" />,
        duration: "Monthly",
      },
    ],
    gallery: [
      {
        id: "liv-01",
        title: "Studio session · Glass Hearts",
        type: "video",
        duration: "14:08",
        thumbnail: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Premium",
      },
      {
        id: "liv-02",
        title: "Tour diary snapshots",
        type: "photo",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "liv-03",
        title: "Love letter lullaby #27",
        type: "audio",
        duration: "05:19",
        thumbnail: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Constellation",
      },
    ],
    testimonials: [
      {
        quote: "The custom lullabies Liv writes for our anniversaries are priceless—Aurora delivers them beautifully.",
        name: "Jordan & Sky",
        title: "Constellation members",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
      {
        quote: "Being part of Liv\'s lyric process feels like holding her heart in real time.",
        name: "Avi",
        title: "Premium member",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
    ],
    socials: [
      { label: "Instagram", handle: "@livrose", url: "https://instagram.com" },
      { label: "YouTube", handle: "LivRoseLive", url: "https://youtube.com" },
      { label: "Newsletter", handle: "Love Letters", url: "https://newsletter.com" },
    ],
  },
  {
    username: "sera_noir",
    displayName: "Sera Noir",
    tagline: "High-fashion muse crafting intimate styling rituals and editorial fantasies.",
    focus: "Editorial fashion",
    location: "Paris · NYC",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80",
    coverUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=1600&q=80",
    description:
      "Sera fuses couture styling, personal energy work, and art direction to create private lookbooks. Members get wardrobe rituals, makeup labs, and collector photo editions.",
    tiers: "3 tiers · Couture concierge",
    stats: [
      { label: "Collector members", value: "9,540" },
      { label: "Avg merch basket", value: "$312" },
      { label: "Editorial shoots", value: "Monthly" },
    ],
    plans: defaultPlans([
      undefined,
      {
        price: "$34",
        desc: "Weekly lookbooks, makeup labs, and runway breakdown livestreams.",
        features: [
          "Weekly lookbook",
          "Runway breakdowns",
          "Makeup labs",
          "Community styling boards",
        ],
      },
      {
        price: "$125",
        desc: "1:1 wardrobe rituals, couture sourcing, and signed collector prints.",
        features: [
          "Quarterly wardrobe ritual",
          "Sourcing concierge",
          "Signed collector print",
          "Priority fittings",
        ],
      },
    ]),
    experiences: [
      {
        title: "Runway studio",
        description: "Deconstruct shows live with fabric samples, moodboards, and Q&A.",
        icon: <Video size={20} className="text-accent" />,
        duration: "Weekly",
      },
      {
        title: "Wardrobe rituals",
        description: "Intimate wardrobe meditations and energy alignment before big moments.",
        icon: <Flame size={20} className="text-white" />,
        duration: "Monthly",
      },
      {
        title: "Collector sessions",
        description: "Limited photo editions framed & shipped with bespoke fragrance.",
        icon: <Camera size={20} className="text-white" />,
        duration: "Quarterly",
      },
    ],
    gallery: [
      {
        id: "sera-01",
        title: "Couture ritual · Eclipse gown",
        type: "video",
        duration: "09:44",
        thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Premium",
      },
      {
        id: "sera-02",
        title: "Lookbook 202",
        type: "photo",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "sera-03",
        title: "Wardrobe ritual audio",
        type: "audio",
        duration: "07:05",
        thumbnail: "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=900&q=80",
        locked: true,
        tier: "Constellation",
      },
    ],
    testimonials: [
      {
        quote: "Sera curates couture packages that arrive with playlists, scents, and ritual cards. It's pure luxury.",
        name: "Maison Lumière",
        title: "Collector",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
      {
        quote: "Her runway labs helped me land my first styling clients—it's a masterclass every week.",
        name: "Ren",
        title: "Premium member",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      },
    ],
    socials: [
      { label: "Instagram", handle: "@seranoir", url: "https://instagram.com" },
      { label: "Pinterest", handle: "Sera Noir", url: "https://pinterest.com" },
      { label: "WhatsApp", handle: "Couture concierge", url: "https://whatsapp.com" },
    ],
  },
];
