import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "../server";

// Reuse the Express app for Vercel serverless
const app = createServer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express app is a request handler compatible with (req, res)
  // Cast types to satisfy Vercel + Express typings
  return (app as any)(req, res);
}

