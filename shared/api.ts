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

// User & Auth Types
export enum UserRole {
  CREATOR = "CREATOR",
  FAN = "FAN",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  subscription_price: number;
  stripe_account_id?: string;
  payout_enabled: boolean;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Fan {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Media {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  media_url: string;
  media_type: string;
  is_premium: boolean;
  price?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  stripe_subscription_id: string;
  creator_id: string;
  fan_id: string;
  amount: number;
  status: string;
  is_active: boolean;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end?: boolean;
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  metadata?: any;
  creator_earnings?: number;
  platform_fee?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

// Prisma Enums (temporary until Prisma client is generated)
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
}

export enum TransactionType {
  SUBSCRIPTION = "SUBSCRIPTION",
  SUBSCRIPTION_RENEWAL = "SUBSCRIPTION_RENEWAL",
  TIP = "TIP",
  PAYOUT = "PAYOUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// Temporary Prisma Client stub (until Prisma client can be properly generated)
export class PrismaClient {
  constructor(config?: any) {}
  $disconnect() {
    return Promise.resolve();
  }
}
