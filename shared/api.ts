/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface SmartReplyRequest {
  prompt: string;
}

export interface SmartReplyResponse {
  reply: string;
}

// Minimal shared types to satisfy client imports. Expand later as schema stabilizes.
export type UserRole = "USER" | "FAN" | "CREATOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Creator extends Profile {
  role: "CREATOR";
  subscriptionPrice?: number;
  tipEnabled: boolean;
  subscriberCount: number;
  mediaCount: number;
  totalEarnings?: number;
}

export interface Fan extends Profile {
  role: "FAN";
}

export interface Media {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: "IMAGE" | "VIDEO" | "AUDIO";
  isPremium: boolean;
  price?: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  fanId: string;
  creatorId: string;
  status: "active" | "canceled" | "paused" | "incomplete";
  amount: number;
  currency: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  fromUserId?: string;
  toUserId: string;
  amount: number;
  currency: string;
  type: "subscription" | "tip" | "payout" | "subscription_renewal";
  status: "pending" | "completed" | "failed" | "refunded";
  platformFee?: number;
  creatorEarnings?: number;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
