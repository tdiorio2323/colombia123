import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  Sparkles,
  ShieldCheck,
  Flame,
  Crown,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Filter,
  Search,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { GlassCard, LuxuryButton, LuxuryInput } from "@/components/ui/luxury";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ConversationPreview {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tier: "Preview" | "Premium" | "Constellation";
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  spend?: string;
}

interface ThreadMessage {
  id: string;
  sender: "self" | "fan";
  content: string;
  timestamp: string;
  attachments?: { type: "image" | "video" | "audio" | "file"; url: string }[];
  reactions?: string[];
}

const DEMO_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "1",
    name: "Levi",
    handle: "@levi_aurora",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    tier: "Constellation",
    lastMessage: "Sending over the moodboard for Friday's livestream!",
    timestamp: "2m ago",
    unread: 2,
    isOnline: true,
    spend: "$12.4K",
  },
  {
    id: "2",
    name: "Mia",
    handle: "@alumina",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    tier: "Premium",
    lastMessage: "The bonus episode made me cry. Thank you for the vulnerability.",
    timestamp: "12m ago",
    unread: 0,
    isOnline: false,
    spend: "$2.7K",
  },
  {
    id: "3",
    name: "Omar",
    handle: "@omniomar",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    tier: "Preview",
    lastMessage: "Is there a replay for last night's drop?",
    timestamp: "1h ago",
    unread: 1,
    isOnline: true,
    spend: "$480",
  },
  {
    id: "4",
    name: "Zara",
    handle: "@zarastardust",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    tier: "Premium",
    lastMessage: "I'll see you at the salon tomorrow!",
    timestamp: "3h ago",
    unread: 0,
    isOnline: false,
    spend: "$4.1K",
  },
];

const DEMO_THREADS: Record<string, ThreadMessage[]> = {
  "1": [
    {
      id: "m-1",
      sender: "fan",
      content: "Just bookmarked the new teaser. The lighting is unreal—48k tipped because I'm obsessed.",
      timestamp: "11:58",
    },
    {
      id: "m-2",
      sender: "self",
      content: "You're the best. Dropping the full storyboard to your Constellation vault tonight.",
      timestamp: "12:01",
    },
    {
      id: "m-3",
      sender: "fan",
      content: "Can we add neon cyan into the live set?",
      timestamp: "12:05",
    },
  ],
  "2": [
    {
      id: "m-4",
      sender: "fan",
      content: "The bonus episode made me cry. Thank you for the vulnerability.",
      timestamp: "09:17",
    },
    {
      id: "m-5",
      sender: "self",
      content: "You being here made it possible. I'll drop the commentary cut for you tonight.",
      timestamp: "09:25",
    },
  ],
  "3": [
    {
      id: "m-6",
      sender: "fan",
      content: "Is there a replay for last night's drop?",
      timestamp: "10:13",
    },
    {
      id: "m-7",
      sender: "self",
      content: "Preview tier will get the trailer tomorrow, full replay hits Premium in 2 hours 💫",
      timestamp: "10:16",
    },
  ],
  "4": [
    {
      id: "m-8",
      sender: "fan",
      content: "I'll see you at the salon tomorrow! Sending over my outfit inspo.",
      timestamp: "07:42",
    },
    {
      id: "m-9",
      sender: "self",
      content: "Can't wait. Concierge will text you the suite number tonight.",
      timestamp: "07:46",
    },
  ],
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "vip" | "unread">("all");
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<ConversationPreview | null>(
    DEMO_CONVERSATIONS[0],
  );
  const [thread, setThread] = useState<ThreadMessage[]>(DEMO_THREADS[DEMO_CONVERSATIONS[0].id]);
  const [composerValue, setComposerValue] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  useEffect(() => {
    if (!selectedConversation) return;
    setThread(DEMO_THREADS[selectedConversation.id] ?? []);
  }, [selectedConversation]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.handle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "vip" && conversation.tier !== "Preview") ||
        (activeFilter === "unread" && conversation.unread > 0);
      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchTerm, activeFilter]);

  const handleSend = () => {
    if (!composerValue.trim() || !selectedConversation) return;

    const newMessage: ThreadMessage = {
      id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      sender: "self",
      content: composerValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThread((prev) => [...prev, newMessage]);
    setComposerValue("");
  };

  const headerTitle = user?.role === "CREATOR" ? "Creator inbox" : "Messages";

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
        <div className="max-w-7xl mx-auto mb-12 animate-luxury-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10">
              <MessageCircle className="w-4 h-4 text-luxury-gold" />
              <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                Havana Messenger
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4" />
              <span>Protected by Trust & Safety</span>
            </div>
          </div>

          <h1 className="text-5xl font-extralight text-white mb-3 tracking-tight">
            {user?.role === "CREATOR" ? (
              <>
                Creator <span className="text-luxury-gold">Inbox</span>
              </>
            ) : (
              <>
                Direct <span className="text-luxury-gold">Messages</span>
              </>
            )}
          </h1>
          <p className="text-white/60 text-lg font-light max-w-3xl">
            {user?.role === "CREATOR"
              ? "Respond in real time, queue premium replies, and trigger upsells in one luxury console."
              : "Talk directly with your favorite creators, unlock concierge perks, and keep your streaks alive."}
          </p>
        </div>

        {/* Messenger Interface */}
        <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-[360px,1fr]">
          {/* Conversations List */}
          <GlassCard className="h-[70vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 space-y-4 border-b border-white/10">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <LuxuryInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search fans, tier, or handle"
                  className="pl-11"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                    "border border-white/15",
                    activeFilter === "all"
                      ? "bg-luxury-gold text-luxury-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  <Filter className="w-3 h-3 inline mr-1" /> All
                </button>
                <button
                  onClick={() => setActiveFilter("vip")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                    "border border-white/15",
                    activeFilter === "vip"
                      ? "bg-luxury-gold text-luxury-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  <Crown className="w-3 h-3 inline mr-1" /> VIP
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                    "border border-white/15",
                    activeFilter === "unread"
                      ? "bg-luxury-gold text-luxury-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  <Flame className="w-3 h-3 inline mr-1" /> Unread
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {filteredConversations.map((conversation) => {
                  const isActive = conversation.id === selectedConversation?.id;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={cn(
                        "w-full rounded-2xl p-3 text-left transition-all",
                        "border",
                        isActive
                          ? "border-luxury-gold/30 bg-luxury-gold/10 shadow-lg"
                          : "border-transparent hover:border-white/10 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white/10">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback className="bg-luxury-gold/20 text-white">
                              {conversation.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <span className="absolute -right-0.5 bottom-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-luxury-black" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-light text-white truncate">
                              {conversation.name}
                            </p>
                            <span className="text-xs text-white/40 ml-2 flex-shrink-0">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 truncate mb-2">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-white/40">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full border",
                              conversation.tier === "Constellation"
                                ? "border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold"
                                : "border-white/15 bg-white/5 text-white/60"
                            )}>
                              {conversation.tier}
                            </span>
                            <span>{conversation.spend}</span>
                          </div>
                        </div>

                        {conversation.unread > 0 && (
                          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-luxury-gold text-luxury-black text-xs font-bold">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </GlassCard>

          {/* Message Thread */}
          <GlassCard className="h-[70vh] flex flex-col p-0 overflow-hidden" premium>
            {selectedConversation ? (
              <>
                {/* Thread Header */}
                <div className="p-6 border-b border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 border-2 border-luxury-gold/30">
                        <AvatarImage
                          src={selectedConversation.avatar}
                          alt={selectedConversation.name}
                        />
                        <AvatarFallback className="bg-luxury-gold/20 text-white text-lg">
                          {selectedConversation.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-light text-white">
                          {selectedConversation.name}
                        </p>
                        <p className="text-xs text-white/50">{selectedConversation.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={cn(
                        "px-3 py-1 rounded-full border",
                        selectedConversation.tier === "Constellation"
                          ? "border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold"
                          : "border-white/15 bg-white/5 text-white/60"
                      )}>
                        {selectedConversation.tier}
                      </span>
                      <span className="text-white/50">
                        {selectedConversation.isOnline ? (
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Online
                          </span>
                        ) : (
                          `Last seen ${selectedConversation.timestamp}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-luxury-gold/20 bg-luxury-gold/5 text-xs text-luxury-gold">
                      <Sparkles className="w-3 h-3" />
                      <span>Suggested upsell: livestream VIP</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-white/50">
                      <Crown className="w-3 h-3" />
                      <span>Lifetime spend {selectedConversation.spend}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-6 py-6">
                  <div className="space-y-6">
                    {thread.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex animate-luxury-fade-in",
                          message.sender === "self" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-md rounded-3xl px-5 py-4 text-sm leading-relaxed",
                            "border shadow-lg transition-all",
                            message.sender === "self"
                              ? "border-luxury-gold/30 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/10 text-white"
                              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                          )}
                        >
                          <p className="font-light">{message.content}</p>
                          <div className="mt-3 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider">
                            <span>{message.timestamp}</span>
                            {message.sender === "self" && <span>Read</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                </ScrollArea>

                {/* Composer */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <LuxuryInput
                      value={composerValue}
                      onChange={(e) => setComposerValue(e.target.value)}
                      placeholder="Write a premium reply..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                      <Smile className="w-4 h-4" />
                    </button>
                    <LuxuryButton variant="gold" onClick={handleSend}>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </LuxuryButton>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/60">
                <MessageCircle className="w-16 h-16 text-luxury-gold/30" />
                <p className="text-lg font-light">Select a conversation to begin</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
