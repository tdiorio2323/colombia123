import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Mail, Clock, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      id: 1,
      name: 'Personal Meet & Greet',
      price: '$199',
      duration: '30 minutes',
      description: 'One-on-one personal time with Eimy. Take photos, get autographs, and share your story.',
      features: ['Personal conversation', 'Photo opportunities', 'Signed merchandise', 'Exclusive gift'],
      icon: Heart,
      popular: true,
    },
    {
      id: 2,
      name: 'Virtual Concert Access',
      price: '$49',
      duration: '2 hours',
      description: 'Exclusive access to private virtual concerts and live performances.',
      features: ['HD streaming', 'Interactive chat', 'Song requests', 'Recording access'],
      icon: Play,
      popular: false,
    },
    {
      id: 3,
      name: 'Private Message',
      price: '$29',
      duration: '24h response',
      description: 'Send a personal message and receive a personalized video response.',
      features: ['Video response', 'Personal message', 'Fast delivery', 'Shareable content'],
      icon: Mail,
      popular: false,
    },
    {
      id: 4,
      name: 'Custom Song Request',
      price: '$399',
      duration: '2-3 weeks',
      description: 'Commission a personalized song or cover just for you.',
      features: ['Original composition', 'Professional recording', 'Exclusive rights', 'Behind-the-scenes'],
      icon: Star,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <Button asChild className="btn-gold hidden md:inline-flex">
          <Link to="/community">Join VIP</Link>
        </Button>
      </Navbar>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream via-background to-gold/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">Exclusive Services</Badge>
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Get Closer to <span className="text-gradient">Your Dreams</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience personalized interactions and exclusive content designed to bring you closer 
            to the music and moments that matter most.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} className={`group hover:shadow-xl transition-all duration-300 ${
                service.popular ? 'ring-2 ring-gold/50 relative' : ''
              }`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-6 bg-gold text-gold-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="bg-gold/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <service.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gold">{service.price}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-display">{service.name}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-gold">What's included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <Star className="h-4 w-4 text-gold flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className={`w-full ${service.popular ? 'btn-gold' : 'btn-primary'}`}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request Form */}
      <section className="py-20 bg-cream/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-display mb-4">
                  Custom Request
                </CardTitle>
                <p className="text-muted-foreground">
                  Have something special in mind? Let's create something unique together.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <select className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent">
                    <option>Select a service...</option>
                    <option>Personal Meet & Greet</option>
                    <option>Virtual Concert</option>
                    <option>Private Message</option>
                    <option>Custom Song Request</option>
                    <option>Other (describe below)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Tell me about your dream experience..."
                  />
                </div>
                <Button className="w-full btn-gold text-lg py-3">
                  <Heart className="mr-2 h-5 w-5" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our services</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "How far in advance should I book?",
                a: "For the best availability, we recommend booking at least 2-3 weeks in advance. Custom services may require additional time."
              },
              {
                q: "Can I reschedule my booking?",
                a: "Yes! You can reschedule up to 48 hours before your scheduled time. Custom work may have different policies."
              },
              {
                q: "What if I need to cancel?",
                a: "Cancellations made 7+ days in advance receive a full refund. Cancellations within 7 days receive a 50% refund."
              },
              {
                q: "Are the virtual concerts live?",
                a: "Yes! All virtual concerts are performed live with real-time interaction. Recordings are also provided."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gold">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
