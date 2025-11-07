import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { User, Crown, Heart, MessageCircle, Settings, LogOut } from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
      } else if (data) {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

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
        <div className="max-w-6xl mx-auto mb-12 animate-luxury-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-extralight text-white mb-3 tracking-tight">
                Creator <span className="text-luxury-gold">Profiles</span>
              </h1>
              <p className="text-white/60 text-lg font-light">
                Discover exclusive creators on the Havana platform
              </p>
            </div>
            <LuxuryButton variant="primary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </LuxuryButton>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="max-w-6xl mx-auto">
            <GlassCard className="text-center py-16">
              <div className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60 font-light">Loading profiles...</p>
            </GlassCard>
          </div>
        ) : (
          /* Profiles Grid */
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.length === 0 ? (
              <GlassCard className="col-span-full text-center py-16">
                <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-light text-white mb-2">No Profiles Yet</h3>
                <p className="text-white/50 text-sm mb-6">
                  Be the first to create a profile on Havana
                </p>
                <LuxuryButton variant="gold">
                  <Crown className="w-4 h-4 mr-2" />
                  Create Profile
                </LuxuryButton>
              </GlassCard>
            ) : (
              profiles.map((profile, index) => (
                <GlassCard
                  key={profile.id}
                  className="luxury-hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                  premium={index % 3 === 0}
                >
                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-luxury-gold to-luxury-gold-light flex items-center justify-center relative overflow-hidden ring-2 ring-luxury-gold/30 ring-offset-4 ring-offset-luxury-black/50">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-luxury-black" />
                      )}
                    </div>
                    {index % 3 === 0 && (
                      <div className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black px-2 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        PRO
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-light text-white mb-2 tracking-tight">
                      {profile.username}
                    </h3>
                    <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-2">
                      {profile.bio || "Luxury content creator on Havana"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 mb-6 pb-6 border-b border-white/10">
                    <div className="text-center">
                      <div className="text-lg font-light text-luxury-gold mb-1">
                        {Math.floor(Math.random() * 1000)}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-white/40">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-light text-luxury-gold mb-1">
                        {Math.floor(Math.random() * 100)}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-white/40">
                        Posts
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <LuxuryButton variant="gold" size="sm" className="flex-1">
                      <Heart className="w-3.5 h-3.5 mr-1" />
                      Follow
                    </LuxuryButton>
                    <LuxuryButton variant="ghost" size="sm">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </LuxuryButton>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
