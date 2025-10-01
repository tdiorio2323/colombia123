import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ICreator extends Document {
  userId: ObjectId;
  slug: string;
  stageName: string;
  bio?: {
    es?: string;
    en?: string;
  };
  socials: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    onlyfans?: string;
  };
  pricing: {
    monthlyCOP: number;
    yearlyCOP: number;
    ppvMinCOP?: number;
    ppvMaxCOP?: number;
  };
  settings: {
    safePreview: boolean;
    watermark: boolean;
    liveEnabled: boolean;
    tipJarEnabled: boolean;
    minTipCOP: number;
  };
  verification: {
    idDocument: {
      type: "CC" | "CE" | "Passport";
      number: string;
      frontImage?: string;
      backImage?: string;
    };
    selfieImage?: string;
    status: "pending" | "approved" | "rejected";
    verifiedAt?: Date;
  };
  payout: {
    method: "Nequi" | "Daviplata" | "Bancolombia" | "Card";
    accountName: string;
    accountId: string;
    taxId?: string;
  };
  metrics: {
    followers: number;
    likes: number;
    totalEarnings: number;
    activeSubscribers: number;
  };
  content: {
    tags: string[];
    restrictions: string[];
    postingSchedule?: string[];
  };
  isActive: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema = new Schema<ICreator>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    stageName: { type: String, required: true },
    bio: {
      es: String,
      en: String,
    },
    socials: {
      instagram: String,
      twitter: String,
      tiktok: String,
      onlyfans: String,
    },
    pricing: {
      monthlyCOP: { type: Number, required: true, min: 0 },
      yearlyCOP: { type: Number, required: true, min: 0 },
      ppvMinCOP: { type: Number, min: 0 },
      ppvMaxCOP: { type: Number, min: 0 },
    },
    settings: {
      safePreview: { type: Boolean, default: true },
      watermark: { type: Boolean, default: true },
      liveEnabled: { type: Boolean, default: false },
      tipJarEnabled: { type: Boolean, default: true },
      minTipCOP: { type: Number, default: 5000 },
    },
    verification: {
      idDocument: {
        type: { type: String, enum: ["CC", "CE", "Passport"], required: true },
        number: { type: String, required: true },
        frontImage: String,
        backImage: String,
      },
      selfieImage: String,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      verifiedAt: Date,
    },
    payout: {
      method: {
        type: String,
        enum: ["Nequi", "Daviplata", "Bancolombia", "Card"],
        required: true,
      },
      accountName: { type: String, required: true },
      accountId: { type: String, required: true },
      taxId: String,
    },
    metrics: {
      followers: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
      activeSubscribers: { type: Number, default: 0 },
    },
    content: {
      tags: [String],
      restrictions: [String],
      postingSchedule: [String],
    },
    isActive: { type: Boolean, default: false },
    approvedAt: Date,
  },
  {
    timestamps: true,
  },
);

CreatorSchema.index({ slug: 1 });
CreatorSchema.index({ userId: 1 });
CreatorSchema.index({ isActive: 1 });

export const Creator = mongoose.model<ICreator>("Creator", CreatorSchema);
