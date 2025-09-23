import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone?: string;
  passwordHash?: string;
  role: "fan" | "creator" | "admin";
  isVerified: boolean;
  kycStatus: "pending" | "approved" | "rejected";
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: Date;
    country: string;
    city?: string;
  };
  preferences: {
    language: "es" | "en";
    currency: "COP" | "USD";
    notifications: boolean;
  };
  metadata: {
    lastLogin?: Date;
    ipAddress?: string;
    deviceInfo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, sparse: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["fan", "creator", "admin"], default: "fan" },
    isVerified: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profile: {
      firstName: String,
      lastName: String,
      displayName: String,
      avatar: String,
      bio: String,
      dateOfBirth: Date,
      country: { type: String, default: "CO" },
      city: String,
    },
    preferences: {
      language: { type: String, enum: ["es", "en"], default: "es" },
      currency: { type: String, enum: ["COP", "USD"], default: "COP" },
      notifications: { type: Boolean, default: true },
    },
    metadata: {
      lastLogin: Date,
      ipAddress: String,
      deviceInfo: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
