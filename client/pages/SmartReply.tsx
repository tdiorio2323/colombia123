import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartReplyRequest, SmartReplyResponse } from "@shared/api";

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-luxury-display text-gold">
            AI Smart Reply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <Button
            onClick={handleGenerateReply}
            disabled={isLoading || !prompt}
            className="w-full btn-luxury"
          >
            {isLoading ? "Generating..." : "Generate Reply"}
          </Button>
          {reply && (
            <div className="p-4 bg-slate-800 rounded-md mt-4">
              <p className="text-white whitespace-pre-wrap">{reply}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
