import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { Users, Trophy, Crown, Medal, Award, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const leaderboardData = [
  { rank: 1, user: "FanaticFrenzy", points: 12500, avatar: "https://i.pravatar.cc/150?img=1" },
  { rank: 2, user: "DevotedDragon", points: 11800, avatar: "https://i.pravatar.cc/150?img=2" },
  { rank: 3, user: "LoyalLion", points: 11200, avatar: "https://i.pravatar.cc/150?img=3" },
  { rank: 4, user: "PassionatePhoenix", points: 10500, avatar: "https://i.pravatar.cc/150?img=4" },
  { rank: 5, user: "ArdentAngel", points: 9800, avatar: "https://i.pravatar.cc/150?img=5" },
  { rank: 6, user: "SuperfanSquad", points: 9200, avatar: "https://i.pravatar.cc/150?img=6" },
  { rank: 7, user: "EagerEagle", points: 8600, avatar: "https://i.pravatar.cc/150?img=7" },
  { rank: 8, user: "ObsessedOtter", points: 8100, avatar: "https://i.pravatar.cc/150?img=8" },
  { rank: 9, user: "ZealousZebra", points: 7600, avatar: "https://i.pravatar.cc/150?img=9" },
  { rank: 10, user: "MajorMark", points: 7200, avatar: "https://i.pravatar.cc/150?img=10" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-luxury-gold" />;
    case 2:
      return <Medal className="w-6 h-6 text-luxury-platinum" />;
    case 3:
      return <Medal className="w-6 h-6 text-luxury-bronze" />;
    default:
      return <Trophy className="w-5 h-5 text-white/40" />;
  }
};

const getRankBadge = (rank: number) => {
  if (rank === 1) {
    return "bg-luxury-gold text-luxury-black border-luxury-gold/30";
  } else if (rank === 2) {
    return "bg-luxury-platinum/20 text-luxury-platinum border-luxury-platinum/30";
  } else if (rank === 3) {
    return "bg-luxury-bronze/20 text-luxury-bronze border-luxury-bronze/30";
  }
  return "bg-white/5 text-white/60 border-white/15";
};

export default function Leaderboard() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12 text-center animate-luxury-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  Community Rankings
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extralight text-white mb-4 tracking-tight">
            Top <span className="text-luxury-gold">Fans</span> Leaderboard
          </h1>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Celebrating our most dedicated community members making the biggest impact
          </p>
        </div>

        {/* Podium - Top 3 */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-3 gap-6 items-end">
            {/* Second Place */}
            <div className="animate-luxury-fade-in" style={{ animationDelay: "100ms" }}>
              <GlassCard className="text-center p-6 luxury-hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={leaderboardData[1].avatar}
                      alt={leaderboardData[1].user}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-luxury-platinum/30"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-luxury-platinum/20 border-2 border-luxury-platinum/30 flex items-center justify-center">
                      <Medal className="w-5 h-5 text-luxury-platinum" />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-6xl font-extralight text-luxury-platinum mb-2">2</div>
                  <h3 className="text-lg font-light text-white mb-1">{leaderboardData[1].user}</h3>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-luxury-gold" />
                  <span className="text-luxury-gold font-light">{leaderboardData[1].points.toLocaleString()}</span>
                  <span className="text-white/40 text-xs uppercase tracking-wider">pts</span>
                </div>
                <LuxuryButton variant="ghost" size="sm" className="w-full">
                  View Profile
                </LuxuryButton>
              </GlassCard>
            </div>

            {/* First Place */}
            <div className="animate-luxury-fade-in">
              <GlassCard premium className="text-center p-8 luxury-hover-lift transform scale-105">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={leaderboardData[0].avatar}
                      alt={leaderboardData[0].user}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-luxury-gold/50"
                    />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-luxury-gold border-2 border-luxury-gold/30 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-luxury-black" />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-7xl font-extralight text-luxury-gold mb-2">1</div>
                  <h3 className="text-xl font-light text-white mb-1">{leaderboardData[0].user}</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/30">
                    <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                      Champion
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-luxury-gold" />
                  <span className="text-2xl text-luxury-gold font-light">{leaderboardData[0].points.toLocaleString()}</span>
                  <span className="text-white/40 text-sm uppercase tracking-wider">pts</span>
                </div>
                <LuxuryButton variant="gold" size="sm" className="w-full">
                  View Profile
                </LuxuryButton>
              </GlassCard>
            </div>

            {/* Third Place */}
            <div className="animate-luxury-fade-in" style={{ animationDelay: "200ms" }}>
              <GlassCard className="text-center p-6 luxury-hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={leaderboardData[2].avatar}
                      alt={leaderboardData[2].user}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-luxury-bronze/30"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-luxury-bronze/20 border-2 border-luxury-bronze/30 flex items-center justify-center">
                      <Medal className="w-5 h-5 text-luxury-bronze" />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-6xl font-extralight text-luxury-bronze mb-2">3</div>
                  <h3 className="text-lg font-light text-white mb-1">{leaderboardData[2].user}</h3>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-luxury-gold" />
                  <span className="text-luxury-gold font-light">{leaderboardData[2].points.toLocaleString()}</span>
                  <span className="text-white/40 text-xs uppercase tracking-wider">pts</span>
                </div>
                <LuxuryButton variant="ghost" size="sm" className="w-full">
                  View Profile
                </LuxuryButton>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="p-3 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30">
                <TrendingUp className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white tracking-tight">Full Rankings</h2>
                <p className="text-sm text-white/50">Complete leaderboard standings</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboardData.slice(3).map((item, index) => (
                <div
                  key={item.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all",
                    "border border-transparent hover:border-white/10 hover:bg-white/5"
                  )}
                  style={{ animationDelay: `${(index + 3) * 50}ms` }}
                >
                  {/* Rank */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border",
                    getRankBadge(item.rank)
                  )}>
                    <span className="text-lg font-light">{item.rank}</span>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.avatar}
                      alt={item.user}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <h3 className="text-white font-light truncate">{item.user}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-3.5 h-3.5 text-luxury-gold" />
                      <span className="text-luxury-gold font-light">{item.points.toLocaleString()}</span>
                      <span className="text-white/40 text-xs uppercase tracking-wider">points</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    <LuxuryButton variant="ghost" size="sm">
                      View Profile
                    </LuxuryButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Stats Footer */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-center p-6">
            <Award className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <div className="text-3xl font-extralight text-white mb-1">
              {leaderboardData.length}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50">Active Fans</div>
          </GlassCard>
          <GlassCard className="text-center p-6">
            <Star className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <div className="text-3xl font-extralight text-white mb-1">
              {leaderboardData.reduce((sum, item) => sum + item.points, 0).toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50">Total Points</div>
          </GlassCard>
          <GlassCard className="text-center p-6">
            <TrendingUp className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <div className="text-3xl font-extralight text-white mb-1">
              {Math.round(leaderboardData.reduce((sum, item) => sum + item.points, 0) / leaderboardData.length).toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50">Avg Points</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
