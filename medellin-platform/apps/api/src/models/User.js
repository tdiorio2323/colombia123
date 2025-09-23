import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    authId: { type: String, index: true, unique: true },
    email: { type: String, index: true },
    displayName: String,
    roles: { type: [String], default: ["user"] },
    profile: {
      firstName: String,
      lastName: String,
      country: String,
      city: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
