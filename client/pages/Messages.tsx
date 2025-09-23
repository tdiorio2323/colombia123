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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
    <div className="relative min-h-[calc(100vh-4rem)] px-6 pb-16 pt-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Badge className="w-fit rounded-full border border-white/10 bg-white/10 text-white/70">
            <MessageCircle className="mr-2 h-3.5 w-3.5" /> Aurora Messenger
          </Badge>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{headerTitle}</h1>
              <p className="text-sm text-white/60 sm:text-base">
                {user?.role === "CREATOR"
                  ? "Respond in real time, queue premium replies, and trigger upsells in one glassy console."
                  : "Talk directly with your favorite creators, unlock concierge perks, and keep your streaks alive."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="h-4 w-4" /> Protected by Aurora Trust & Safety
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
          <Card className="glass-card flex h-[70vh] flex-col border-white/10 bg-white/5">
            <CardHeader className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search fans, tier, or handle"
                  className="pl-9 text-sm text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  className={cn(
                    "flex-1 border-white/15 text-xs",
                    activeFilter === "all" ? "bg-white/15 text-white" : "bg-white/5 text-white/70",
                  )}
                  onClick={() => setActiveFilter("all")}
                >
                  <Filter className="mr-2 h-3.5 w-3.5" /> All
                </Button>
                <Button
                  variant={activeFilter === "vip" ? "default" : "outline"}
                  className={cn(
                    "flex-1 border-white/15 text-xs",
                    activeFilter === "vip" ? "bg-white/15 text-white" : "bg-white/5 text-white/70",
                  )}
                  onClick={() => setActiveFilter("vip")}
                >
                  <Crown className="mr-2 h-3.5 w-3.5" /> VIP
                </Button>
                <Button
                  variant={activeFilter === "unread" ? "default" : "outline"}
                  className={cn(
                    "flex-1 border-white/15 text-xs",
                    activeFilter === "unread" ? "bg-white/15 text-white" : "bg-white/5 text-white/70",
                  )}
                  onClick={() => setActiveFilter("unread")}
                >
                  <Flame className="mr-2 h-3.5 w-3.5" /> Unread
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden px-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 px-3">
                  {filteredConversations.map((conversation) => {
                    const isActive = conversation.id === selectedConversation?.id;
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={cn(
                          "w-full rounded-2xl border border-transparent px-3 py-3 text-left transition",
                          isActive
                            ? "border-white/15 bg-white/10 shadow-lg shadow-blue-500/10"
                            : "hover:border-white/10 hover:bg-white/5",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-11 w-11 border border-white/10">
                              <AvatarImage src={conversation.avatar} alt={conversation.name} />
                              <AvatarFallback className="bg-blue/20 text-white">
                                {conversation.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.isOnline && (
                              <span className="absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white">{conversation.name}</p>
                              <span className="text-xs text-white/40">{conversation.timestamp}</span>
                            </div>
                            <p className="truncate text-xs text-white/50">{conversation.lastMessage}</p>
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
                              <Badge className="border-white/15 bg-white/5 text-white/60">
                                {conversation.tier}
                              </Badge>
                              <span>Lifetime spend {conversation.spend}</span>
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/40 text-xs text-white">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="glass-card flex h-[70vh] flex-col border-white/10 bg-white/5">
            {selectedConversation ? (
              <>
                <CardHeader className="flex flex-col gap-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarImage
                          src={selectedConversation.avatar}
                          alt={selectedConversation.name}
                        />
                        <AvatarFallback className="bg-blue/20 text-white">
                          {selectedConversation.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-semibold">{selectedConversation.name}</p>
                        <p className="text-xs text-white/50">{selectedConversation.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Badge className="border-white/15 bg-white/5 text-white/60">
                        {selectedConversation.tier}
                      </Badge>
                      <span>{selectedConversation.isOnline ? "Online" : "Last seen " + selectedConversation.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/50">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <Sparkles className="h-3.5 w-3.5" /> Suggested upsell: livestream VIP
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <Crown className="h-3.5 w-3.5" /> Lifetime spend {selectedConversation.spend}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden px-0">
                  <ScrollArea className="h-full px-6 py-6">
                    <div className="space-y-6">
                      {thread.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex", message.sender === "self" ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-sm rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-lg transition",
                              message.sender === "self"
                                ? "border-accent/30 bg-gradient-to-br from-accent/40 to-blue/40 text-white"
                                : "border-white/10 bg-white/5 text-white/80",
                            )}
                          >
                            <p>{message.content}</p>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
                              <span>{message.timestamp}</span>
                              {message.sender === "self" && <span>Read</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messageEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                <div className="border-t border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="rounded-full border border-white/10 bg-white/5 text-white" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="rounded-full border border-white/10 bg-white/5 text-white" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={composerValue}
                      onChange={(event) => setComposerValue(event.target.value)}
                      placeholder="Write a premium reply..."
                      className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-white/40"
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      className="rounded-full border border-white/10 bg-white/5 text-white"
                      size="icon"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button className="btn-luxury" onClick={handleSend}>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-white/60">
                <MessageCircle className="h-10 w-10" />
                <p>Select a conversation to begin</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
