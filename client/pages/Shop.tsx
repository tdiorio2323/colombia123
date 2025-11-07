import { useState } from "react";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { ShoppingCart, Star, Heart, Sparkles } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
};

export default function Shop() {
  const [cart, setCart] = useState<Product[]>([]);

  const products: Product[] = [
    { id: 1, name: "Signed Debut Album", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1619983081563-430f63602796", category: "music", description: "Hand-signed debut album with exclusive photo insert", rating: 5 },
    { id: 2, name: "Official Tour T-Shirt", price: 34.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", category: "apparel", description: "Premium cotton tour merchandise", rating: 4.8 },
    { id: 3, name: "Exclusive Photo Book", price: 59.99, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794", category: "books", description: "Limited edition hardcover photo book", rating: 4.9 },
    { id: 4, name: "VIP Concert Poster", price: 24.99, image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868", category: "art", description: "Collectible concert poster", rating: 4.7 },
  ];

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
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
                    Exclusive Merchandise
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
              Luxury <span className="text-luxury-gold">Shop</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
              Exclusive merchandise and collectibles for true fans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <GlassCard key={product.id} className="luxury-hover-lift group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative mb-6 rounded-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-luxury-gold border border-luxury-gold/30">
                      <span className="text-xs font-bold text-luxury-black uppercase">Sale</span>
                    </div>
                  )}
                  <button className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
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
                  <p className="text-sm text-white/60 font-light mb-4">{product.description}</p>

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
                  Add to Cart
                </LuxuryButton>
              </GlassCard>
            ))}
          </div>

          {cart.length > 0 && (
            <GlassCard premium className="mt-12 p-8 max-w-md ml-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-light text-white tracking-tight">Shopping Cart</h3>
                <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center">
                  <span className="text-sm font-bold text-luxury-black">{cart.length}</span>
                </div>
              </div>
              <div className="text-3xl font-extralight text-luxury-gold mb-6">
                ${cart.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </div>
              <LuxuryButton variant="gold" size="lg" className="w-full">
                <Sparkles className="w-5 h-5 mr-2" />
                Checkout
              </LuxuryButton>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
