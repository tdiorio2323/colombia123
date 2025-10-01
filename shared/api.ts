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

export type UserRole = "FAN" | "CREATOR" | "ADMIN"; // Inferred roles

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  // ... other profile properties
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Creator {
  id: string;
  userId: string;
  // ... other creator properties
}

export interface Fan {
  id: string;
  userId: string;
  // ... other fan properties
}

export interface Media {
  id: string;
  creatorId: string;
  url: string;
  type: string; // e.g., "image", "video"
  // ... other media properties
}

export interface Subscription {
  id: string;
  fanId: string;
  creatorId: string;
  status: string; // e.g., "active", "cancelled"
  // ... other subscription properties
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string; // e.g., "tip", "subscription"
  // ... other transaction properties
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  // ... other message properties
}

export interface SmartReplyRequest {
  message: string;
  context?: string;
}

export interface SmartReplyResponse {
  reply: string;
}