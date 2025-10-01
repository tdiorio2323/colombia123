import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const mockCreators = [
  {
    id: 1,
    username: "sofia_rodriguez",
    displayName: "Sofia Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    monthlyEarnings: "$12,450",
    followers: "127K",
    badge: "diamond",
  },
  {
    id: 2,
    username: "carolina_morales",
    displayName: "Carolina Morales",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carolina",
    monthlyEarnings: "$8,920",
    followers: "89K",
    badge: "platinum",
  },
  {
    id: 3,
    username: "valentina_cruz",
    displayName: "Valentina Cruz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina",
    monthlyEarnings: "$15,780",
    followers: "156K",
    badge: "diamond",
  },
  {
    id: 4,
    username: "daniela_santos",
    displayName: "Daniela Santos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniela",
    monthlyEarnings: "$6,340",
    followers: "64K",
    badge: "gold",
  },
  {
    id: 5,
    username: "camila_torres",
    displayName: "Camila Torres",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camila",
    monthlyEarnings: "$10,120",
    followers: "98K",
    badge: "platinum",
  },
  {
    id: 6,
    username: "isabella_garcia",
    displayName: "Isabella Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    monthlyEarnings: "$18,560",
    followers: "203K",
    badge: "diamond",
  },
];

export default function Showcase() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-accent">Featured</span>{" "}
            <span className="text-white">Creators</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of successful creators building their empires on Colombia123
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mockCreators.map((creator) => (
            <Card
              key={creator.id}
              className="bg-black/50 border-gray-800 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-accent/50">
                    <AvatarImage src={creator.avatar} alt={creator.displayName} />
                    <AvatarFallback className="bg-accent/20 text-accent">
                      {creator.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{creator.displayName}</h3>
                      {creator.badge === "diamond" && (
                        <Crown className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">@{creator.username}</p>
                    <Badge
                      className={`mt-2 text-xs ${
                        creator.badge === "diamond"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : creator.badge === "platinum"
                            ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {creator.badge.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-green-400 text-xs mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Monthly</span>
                    </div>
                    <div className="font-display font-bold text-white text-lg">
                      {creator.monthlyEarnings}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-blue-400 text-xs mb-1">
                      <Users className="h-3 w-3" />
                      <span>Followers</span>
                    </div>
                    <div className="font-display font-bold text-white text-lg">
                      {creator.followers}
                    </div>
                  </div>
                </div>

                <Link to={`/creator/${creator.username}`}>
                  <Button
                    variant="outline"
                    className="w-full border-accent/30 text-accent hover:bg-accent/10"
                    size="sm"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-black font-bold px-8"
            >
              Start Your Creator Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
