import { useState } from "react";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { ShoppingCart, Star, Heart, Sparkles, Video, Image as ImageIcon, Music, Lock, Download } from "lucide-react";

type ContentProduct = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: "video" | "photos" | "audio" | "bundle";
  contentType: string;
  creator: string;
  description: string;
  rating: number;
  duration?: string;
  itemCount?: number;
  isPremium?: boolean;
};

export default function Shop() {
  const [cart, setCart] = useState<ContentProduct[]>([]);
  const [filter, setFilter] = useState<"all" | "video" | "photos" | "audio" | "bundle">("all");

  const products: ContentProduct[] = [
    {
      id: 1,
      name: "Exclusive Behind The Scenes",
      price: 24.99,
      originalPrice: 34.99,
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
      category: "video",
      contentType: "HD Video",
      creator: "Sofia Martinez",
      description: "30-minute exclusive behind the scenes footage",
      rating: 5,
      duration: "30 min",
      isPremium: true
    },
    {
      id: 2,
      name: "Premium Photo Collection",
      price: 19.99,
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      category: "photos",
      contentType: "Photo Set",
      creator: "Emma Rodriguez",
      description: "50 high-resolution exclusive photos",
      rating: 4.9,
      itemCount: 50
    },
    {
      id: 3,
      name: "Private Podcast Episode",
      price: 9.99,
      thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc",
      category: "audio",
      contentType: "Audio",
      creator: "Marcus Johnson",
      description: "Exclusive 45-minute podcast conversation",
      rating: 4.8,
      duration: "45 min"
    },
    {
      id: 4,
      name: "Ultimate Content Bundle",
      price: 79.99,
      originalPrice: 120.00,
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868",
      category: "bundle",
      contentType: "Bundle",
      creator: "Isabella Chen",
      description: "Complete collection: 5 videos + 100 photos + bonus audio",
      rating: 5,
      itemCount: 106,
      isPremium: true
    },
    {
      id: 5,
      name: "Workout Tutorial Series",
      price: 29.99,
      thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
      category: "video",
      contentType: "Video Series",
      creator: "Alex Turner",
      description: "Complete 6-part workout series with meal plan PDF",
      rating: 4.9,
      duration: "2 hours",
      itemCount: 6
    },
    {
      id: 6,
      name: "Intimate Portrait Session",
      price: 34.99,
      thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
      category: "photos",
      contentType: "Photo Set",
      creator: "Luna Vega",
      description: "Exclusive 80-photo intimate portrait collection",
      rating: 5,
      itemCount: 80,
      isPremium: true
    },
    {
      id: 7,
      name: "Music Production Tutorial",
      price: 39.99,
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
      category: "video",
      contentType: "Tutorial Video",
      creator: "DJ Phoenix",
      description: "Professional music production masterclass",
      rating: 4.8,
      duration: "90 min"
    },
    {
      id: 8,
      name: "Meditation Audio Pack",
      price: 14.99,
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      category: "audio",
      contentType: "Audio Pack",
      creator: "Zen Masters",
      description: "10 guided meditation sessions for relaxation",
      rating: 4.9,
      itemCount: 10,
      duration: "3 hours"
    },
  ];

  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  const addToCart = (product: ContentProduct) => {
    setCart([...cart, product]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "video": return <Video className="w-5 h-5" />;
      case "photos": return <ImageIcon className="w-5 h-5" />;
      case "audio": return <Music className="w-5 h-5" />;
      case "bundle": return <Sparkles className="w-5 h-5" />;
      default: return <ShoppingCart className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-luxury-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-luxury-gold" />
                  <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                    Digital Content
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
              Creator <span className="text-luxury-gold">Content</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
              Exclusive digital content from your favorite creators
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: "all", label: "All Content", icon: <Sparkles className="w-4 h-4" /> },
              { key: "video", label: "Videos", icon: <Video className="w-4 h-4" /> },
              { key: "photos", label: "Photos", icon: <ImageIcon className="w-4 h-4" /> },
              { key: "audio", label: "Audio", icon: <Music className="w-4 h-4" /> },
              { key: "bundle", label: "Bundles", icon: <ShoppingCart className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 border ${
                  filter === tab.key
                    ? "bg-luxury-gold text-luxury-black border-luxury-gold"
                    : "bg-white/5 text-white/60 border-white/15 hover:bg-white/10 hover:border-white/30"
                }`}
              >
                {tab.icon}
                <span className="text-sm font-semibold uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <GlassCard key={product.id} className="luxury-hover-lift group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  {/* Content Type Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-luxury-black/70 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    {getCategoryIcon(product.category)}
                    <span className="text-xs font-bold text-white uppercase">{product.contentType}</span>
                  </div>

                  {/* Premium Badge */}
                  {product.isPremium && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-luxury-gold border border-luxury-gold/30">
                      <span className="text-xs font-bold text-luxury-black uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Premium
                      </span>
                    </div>
                  )}

                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-red-500 border border-red-400">
                      <span className="text-xs font-bold text-white uppercase">Sale</span>
                    </div>
                  )}

                  <button className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-luxury-gold fill-luxury-gold" : "text-white/20"}`} />
                    ))}
                    <span className="text-xs text-white/50 ml-2">{product.rating}</span>
                  </div>

                  <h3 className="text-lg font-light text-white mb-2 tracking-tight">{product.name}</h3>
                  <p className="text-xs text-luxury-gold/80 mb-2 uppercase tracking-wider">By {product.creator}</p>
                  <p className="text-sm text-white/60 font-light mb-3">{product.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
                    {product.duration && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {product.duration}
                      </span>
                    )}
                    {product.itemCount && (
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(product.category)}
                        {product.itemCount} items
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-extralight text-luxury-gold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-white/40 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <LuxuryButton
                  variant="gold"
                  size="sm"
                  className="w-full"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase
                </LuxuryButton>
              </GlassCard>
            ))}
          </div>

          {cart.length > 0 && (
            <GlassCard premium className="mt-12 p-8 max-w-md ml-auto animate-luxury-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-white tracking-tight">Shopping Cart</h3>
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center">
                  <span className="text-sm font-bold text-luxury-black">{cart.length}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getCategoryIcon(item.category)}
                      <span className="text-white/80 truncate">{item.name}</span>
                    </div>
                    <span className="text-luxury-gold font-light ml-3">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Subtotal</span>
                  <span className="text-white">${cart.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-light text-lg">Total</span>
                  <span className="text-3xl font-extralight text-luxury-gold">
                    ${cart.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <LuxuryButton variant="gold" size="lg" className="w-full">
                <Lock className="w-5 h-5 mr-2" />
                Secure Checkout
              </LuxuryButton>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
