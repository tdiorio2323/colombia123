import { Creator, Plan } from "../components/CreatorPage";
import { Shield, Crown, Star, Users } from "lucide-react";

export const creators: Creator[] = [
  {
    username: "karol_bcr",
    displayName: "Karol Rosado",
    tagline: "Colombian Goddess",
    avatarUrl: "https://i.imgur.com/b2oBun3.png",
    description: "Exclusive Colombian content, personalized messages, and direct fan interaction. Join my premium community today.",
    plans: [
      {
        name: "Free Follower",
        price: "$0",
        desc: "Basic access to public Colombian content.",
        cta: "Follow Free",
        icon: <Users size={18} className="opacity-80" />,
        features: ["Public photo drops", "Community posts", "Basic chat"],
      },
      {
        name: "Premium Fan",
        price: "$14.99",
        desc: "Exclusive photos, weekly live streams, and behind‑the‑scenes.",
        cta: "Subscribe Premium",
        popular: true,
        icon: <Star size={18} className="opacity-80" />,
        features: ["Daily photos & videos", "Weekly live streams", "Behind‑the‑scenes", "Priority replies"],
      },
      {
        name: "VIP Supporter",
        price: "$39.99",
        desc: "Ultimate access with personalized messages and private messaging.",
        cta: "Join VIP Access",
        icon: <Crown size={18} className="opacity-80" />,
        features: ["Everything in Premium", "Private messaging", "VIP video calls", "Exclusive drops"],
      },
      {
        name: "Elite Colombian",
        price: "$99.99",
        desc: "Exclusive, top‑tier online experiences and direct digital access. No physical meetings or backstage passes, just the most private premium drops.",
        cta: "Apply for Elite",
        icon: <Shield size={18} className="opacity-80" />,
        features: [
          "Monthly elite digital exclusives",
          "Priority access to premium drops",
          "Personalized digital messages",
          "Unreleased online content vault",
        ],
      },
    ],
  },
];
