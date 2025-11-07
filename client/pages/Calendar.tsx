import { useState } from "react";
import { GlassCard, LuxuryButton } from "@/components/ui/luxury";
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Video, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "concert" | "meet" | "stream";
  available: number;
};

export default function Calendar() {
  const [currentMonth] = useState("November 2025");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const events: Event[] = [
    { id: 1, title: "Live Concert Experience", date: "Nov 15", time: "8:00 PM", location: "Virtual Stage", type: "concert", available: 50 },
    { id: 2, title: "VIP Meet & Greet", date: "Nov 22", time: "6:00 PM", location: "Exclusive Lounge", type: "meet", available: 10 },
    { id: 3, title: "Interactive Live Stream", date: "Nov 28", time: "7:00 PM", location: "Online", type: "stream", available: 100 },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "concert": return "from-luxury-gold/20 to-luxury-gold/10 border-luxury-gold/30";
      case "meet": return "from-luxury-gold/30 to-luxury-gold/15 border-luxury-gold/40";
      case "stream": return "from-white/10 to-white/5 border-white/20";
      default: return "from-white/5 to-white/5 border-white/10";
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-luxury-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-luxury-gold" />
                  <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                    Event Calendar
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
              Book Your <span className="text-luxury-gold">Experience</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
              Reserve your spot for exclusive events and personalized experiences
            </p>
          </div>

          <GlassCard premium className="p-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-light text-white tracking-tight">{currentMonth}</h2>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs uppercase tracking-wider text-white/50 font-semibold py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2;
                const hasEvent = [15, 22, 28].includes(day);
                const isSelected = day === selectedDate;
                return (
                  <button
                    key={i}
                    onClick={() => day > 0 && day <= 30 && setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-xl transition-all flex items-center justify-center text-sm font-light",
                      day < 1 || day > 30
                        ? "bg-transparent text-white/20 cursor-default"
                        : isSelected
                          ? "bg-luxury-gold border-2 border-luxury-gold text-luxury-black scale-110"
                          : hasEvent
                            ? "bg-luxury-gold/20 border-2 border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold/30"
                            : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                    )}
                  >
                    {day > 0 && day <= 30 ? day : ""}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <div className="space-y-6">
            <h2 className="text-2xl font-light text-white mb-6 tracking-tight">
              Upcoming <span className="text-luxury-gold">Events</span>
            </h2>
            {events.map((event, index) => (
              <GlassCard
                key={event.id}
                className={cn("bg-gradient-to-r luxury-hover-lift", getEventColor(event.type))}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/30">
                        <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">
                          {event.date}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-wider text-white/50">{event.type}</span>
                    </div>
                    <h3 className="text-xl font-light text-white mb-3 tracking-tight">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.available} spots left</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <LuxuryButton variant="gold" size="lg">
                      <Heart className="w-5 h-5 mr-2" />
                      Reserve Spot
                    </LuxuryButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
