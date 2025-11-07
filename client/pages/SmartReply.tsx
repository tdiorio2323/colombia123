import { useState } from "react";
import { GlassCard, LuxuryButton, LuxuryTextarea } from "@/components/ui/luxury";
import { SmartReplyRequest, SmartReplyResponse } from "@shared/api";
import { Sparkles, Loader2, Brain } from "lucide-react";

export default function SmartReply() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReply = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setReply("");

    try {
      const request: SmartReplyRequest = { prompt };
      const response = await fetch("/api/smart-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to generate smart reply");
      }

      const data: SmartReplyResponse = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply("Error: Could not generate a reply.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-luxury-black"></div>
      <div className="absolute inset-0 bg-luxury-gradient"></div>
      <div className="absolute inset-0 bg-luxury-noise"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-luxury-gold/3 rounded-full blur-3xl"></div>

      <GlassCard premium className="relative z-10 w-full max-w-2xl p-12 animate-luxury-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-luxury-gold" />
          </div>
          <h1 className="text-4xl font-extralight text-white mb-3 tracking-tight">
            AI Smart <span className="text-luxury-gold">Reply</span>
          </h1>
          <p className="text-white/60 font-light">
            Generate intelligent responses powered by artificial intelligence
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-luxury-gold font-semibold block mb-3">
              Your Prompt
            </label>
            <LuxuryTextarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
            />
          </div>

          <LuxuryButton
            onClick={handleGenerateReply}
            disabled={isLoading || !prompt}
            variant="gold"
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Reply
              </>
            )}
          </LuxuryButton>

          {/* Reply Output */}
          {reply && (
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl animate-luxury-fade-in">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs uppercase tracking-wider text-luxury-gold font-semibold">
                  AI Generated Response
                </span>
              </div>
              <p className="text-white/80 font-light leading-relaxed whitespace-pre-wrap">
                {reply}
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
