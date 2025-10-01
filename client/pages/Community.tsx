import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  Users,
  MessageCircle,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      {/* Luxury Beach Navigation */}
      <nav className="sticky top-0 z-50 relative overflow-hidden">
        {/* Luxury Beach Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1654828/pexels-photo-1654828.jpeg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold/80 to-primary rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-7 w-7 text-white drop-shadow-lg" />
              </div>
              <div>
                <span className="text-3xl font-script font-bold text-white drop-shadow-lg">
                  Eimy Contreras
                </span>
                <div className="text-sm text-gold/90 font-serif italic">
                  🏝️ Colombian Paradise
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/services"
                className="text-white/90 hover:text-gold transition-colors font-medium text-lg drop-shadow"
              >
                Experiences
              </Link>
              <Link
                to="/shop"
                className="text-white/90 hover:text-gold transition-colors font-medium text-lg drop-shadow"
              >
                Luxury Shop
              </Link>
              <Link
                to="/community"
                className="text-gold transition-colors font-medium text-lg drop-shadow"
              >
                VIP Club
              </Link>
              <Link
                to="/calendar"
                className="text-white/90 hover:text-gold transition-colors font-medium text-lg drop-shadow"
              >
                Book Me
              </Link>
            </div>
            <Button className="bg-gradient-to-r from-gold to-primary text-white hover:from-gold/90 hover:to-primary/90 px-6 py-3 text-lg font-bold shadow-xl">
              🌊 Join Paradise
            </Button>
          </div>
        </div>

        {/* Luxury Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-primary to-gold" />
      </nav>

      {/* Placeholder Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gold/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Users className="h-12 w-12 text-gold" />
          </div>

          <h1 className="text-5xl font-display font-bold mb-6">
            Community Page <span className="text-gradient">Coming Soon</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're building an amazing community space with fan interactions,
            exclusive content, leaderboards, and more. Stay tuned for the
            official launch!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-gold mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                Fan Feed
              </h3>
              <p className="text-muted-foreground text-sm">
                Share moments and connect with other fans
              </p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-gold mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                Leaderboards
              </h3>
              <p className="text-muted-foreground text-sm">
                Compete for top fan status
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="h-8 w-8 text-gold mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                Exclusive Content
              </h3>
              <p className="text-muted-foreground text-sm">
                Access community-only posts
              </p>
            </Card>
             <Card className="p-6 text-center">
              <h3 className="font-display font-semibold text-lg mb-2">
               Sample Text
              </h3>
              <p className="text-muted-foreground text-sm">
              No," she said quite simply, "it will not be necessary.<br/>
              You can tell them just as well. I must go with you on your journey."
              </p>
            </Card>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="btn-gold mr-4">
              <Heart className="mr-2 h-5 w-5" />
              Get Notified
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
