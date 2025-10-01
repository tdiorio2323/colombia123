import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Filter, Search, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

// Define a type for our product for better type safety
type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: string;
  description: string;
  rating: number;
  reviews: number;
};

export default function Shop() {
  const [cart, setCart] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: 'Signed Debut Album',
      price: 79.99,
      originalPrice: 99.99,
      image: '/placeholder.svg',
      category: 'music',
      stock: 'Limited Edition',
      description: 'Hand-signed debut album with exclusive photo insert',
      rating: 5,
      reviews: 127,
    },
    {
      id: 2,
      name: 'Official Tour T-Shirt',
      price: 34.99,
      image: '/placeholder.svg',
      category: 'apparel',
      stock: 'In Stock',
      description: 'Premium cotton tour merchandise in black and gold',
      rating: 4.8,
      reviews: 89,
    },
    {
      id: 3,
      name: 'VIP Concert Pass',
      price: 299.99,
      image: '/placeholder.svg',
      category: 'experiences',
      stock: 'Few Left',
      description: 'Backstage access, meet & greet, and premium seating',
      rating: 5,
      reviews: 34,
    },
    {
      id: 4,
      name: 'Exclusive Photo Bundle',
      price: 24.99,
      image: '/placeholder.svg',
      category: 'digital',
      stock: 'Digital',
      description: 'High-res photo collection from recent shoots',
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 5,
      name: 'Gold Crown Necklace',
      price: 149.99,
      image: '/placeholder.svg',
      category: 'jewelry',
      stock: 'Limited',
      description: '18k gold-plated crown pendant, Eimy\'s signature piece',
      rating: 4.7,
      reviews: 43,
    },
    {
      id: 6,
      name: 'Vintage Poster Set',
      price: 19.99,
      image: '/placeholder.svg',
      category: 'collectibles',
      stock: 'In Stock',
      description: 'Set of 3 vintage-style concert posters',
      rating: 4.6,
      reviews: 78,
    },
  ];

  // useMemo will prevent recalculating categories on every render
  const categories = useMemo(() => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>); // Fix: Added missing comma here
    
    const allCategories = [
      { id: 'all', name: 'All Items', count: products.length },
      ...Object.keys(categoryCounts).map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), count: categoryCounts[cat] }))
    ];
    return allCategories;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => filter === 'all' || p.category === filter)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, filter, searchTerm]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar className="sticky glass-nav py-4">
        <Button className="btn-gold relative" onClick={() => console.log('Cart clicked')}>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[20px] h-5 rounded-full text-xs">
              {cart.length}
            </Badge>
          )}
        </Button>
      </Navbar>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-cream via-background to-gold/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Official <span className="text-gradient">Merchandise</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Limited edition items and exclusive merchandise crafted with love for true fans
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-gold mb-4 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setFilter(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                            filter === category.id 
                              ? 'bg-gold text-gold-foreground' 
                              : 'hover:bg-cream'
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-gold mb-4">Price Range</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-input rounded-md text-sm" />
                        <span>-</span>
                        <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-input rounded-md text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold">
                  {filter === 'all' ? 'All Products' : categories.find(c => c.id === filter)?.name}
                </h2>
                <p className="text-muted-foreground">{filteredProducts.length} items found</p>
              </div>
              <select className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent">
                <option>Sort by Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Best Selling</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className="bg-gold text-gold-foreground">
                        {product.stock}
                      </Badge>
                      {product.originalPrice && (
                        <Badge variant="destructive">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-gold fill-current' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => addToCart(product)}
                          className="btn-primary"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Mock */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-2xl border-gold">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <div className="font-semibold">{cart.length} items in cart</div>
                  <div className="text-muted-foreground">
                    ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} total
                  </div>
                </div>
                <Button className="btn-gold" onClick={() => console.log('Checkout clicked')}>
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
