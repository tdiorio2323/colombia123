import { RequestHandler } from "express";
import { SmartReplyRequest, SmartReplyResponse } from "@shared/api";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export const handleSmartReply: RequestHandler = async (req, res) => {
  const { prompt } = req.body as SmartReplyRequest;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key is not configured" });
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    const smartReplyResponse: SmartReplyResponse = {
      reply,
    };

    res.json(smartReplyResponse);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to generate smart reply" });
  }
};
