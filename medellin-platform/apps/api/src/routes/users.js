import { Router } from "express";
import { User } from "../models/User.js";

export function usersRouter({ supabase }) {
  const r = Router();

  r.get("/health", (_req, res) => res.json({ ok: true }));

  r.post("/admin/create", async (req, res) => {
    try {
      const { email, password, displayName } = req.body || {};
      if (!email || !password)
        return res.status(400).json({ error: "email and password required" });

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { displayName },
      });
      if (error) return res.status(500).json({ error: error.message });

      const doc = await User.create({
        authId: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.displayName,
      });

      res.status(201).json({ user: doc });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.post("/sync", async (req, res) => {
    try {
      const { authId, email, profile, displayName } = req.body || {};
      if (!authId) return res.status(400).json({ error: "authId required" });
      const user = await User.findOneAndUpdate(
        { authId },
        { $set: { email, profile, displayName } },
        { new: true, upsert: true },
      );
      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  r.get("/me", async (req, res) => {
    try {
      const authHeader = req.get("authorization") || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
      if (!token)
        return res.status(401).json({ error: "Missing bearer token" });
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user)
        return res.status(401).json({ error: "Invalid token" });
      const doc = await User.findOne({ authId: data.user.id });
      res.json({ auth: data.user, profile: doc });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return r;
}
