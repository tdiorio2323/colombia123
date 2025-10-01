import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectMongo } from "./db.js";
import { createSupabaseAdmin } from "./supabase.js";
import { usersRouter } from "./routes/users.js";

const {
  PORT = 4000,
  MONGODB_URI,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

async function main() {
  await connectMongo(MONGODB_URI);
  const supabase = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/users", usersRouter({ supabase }));
  app.get("/", (_req, res) => res.json({ name: "API", ok: true }));

  app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}
main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
