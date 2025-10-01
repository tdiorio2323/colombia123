// Client-side database operations via API calls
// This file provides typed interfaces for making API calls to server-side Prisma operations

import type { User, Profile, Creator, Fan, Media, Subscription, Transaction, Message } from '@shared/api'

const API_BASE = '/api'

// Helper function for making authenticated API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

// User operations
export const userApi = {
  async create(data: { email: string; name?: string; passwordHash: string }) {
    return apiCall<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<User>(`/users/${id}`)
  },

  async getByEmail(email: string) {
    return apiCall<User>(`/users/email/${email}`)
  },

  async update(id: string, data: Partial<User>) {
    return apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// Profile operations
export const profileApi = {
  async create(data: { userId: string; username: string; role: 'CREATOR' | 'FAN' | 'ADMIN'; displayName?: string }) {
    return apiCall<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<Profile>(`/profiles/${id}`)
  },

  async getByUsername(username: string) {
    return apiCall<Profile>(`/profiles/username/${username}`)
  },

  async update(id: string, data: Partial<Profile>) {
    return apiCall<Profile>(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async getCreators() {
    return apiCall<Creator[]>('/profiles/creators')
  },
}

// Media operations
export const mediaApi = {
  async create(data: { creatorId: string; title: string; description?: string; mediaUrl: string; mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO'; isPremium: boolean; price?: number }) {
    return apiCall<Media>('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<Media>(`/media/${id}`)
  },

  async getByCreator(creatorId: string) {
    return apiCall<Media[]>(`/media/creator/${creatorId}`)
  },

  async update(id: string, data: Partial<Media>) {
    return apiCall<Media>(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string) {
    return apiCall(`/media/${id}`, { method: 'DELETE' })
  },
}

// Subscription operations
export const subscriptionApi = {
  async create(data: { creatorId: string; subscriberId: string; amount: number }) {
    return apiCall<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<Subscription>(`/subscriptions/${id}`)
  },

  async getBySubscriber(subscriberId: string) {
    return apiCall<Subscription[]>(`/subscriptions/subscriber/${subscriberId}`)
  },

  async getByCreator(creatorId: string) {
    return apiCall<Subscription[]>(`/subscriptions/creator/${creatorId}`)
  },

  async cancel(id: string) {
    return apiCall<Subscription>(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    })
  },
}

// Transaction operations
export const transactionApi = {
  async create(data: { buyerId: string; creatorId: string; type: 'SUBSCRIPTION' | 'TIP' | 'MEDIA_PURCHASE'; amount: number; mediaId?: string; description?: string }) {
    return apiCall<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<Transaction>(`/transactions/${id}`)
  },

  async getByBuyer(buyerId: string) {
    return apiCall<Transaction[]>(`/transactions/buyer/${buyerId}`)
  },

  async getByCreator(creatorId: string) {
    return apiCall<Transaction[]>(`/transactions/creator/${creatorId}`)
  },
}

// Message operations
export const messageApi = {
  async create(data: { senderId: string; receiverId: string; content: string }) {
    return apiCall<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getById(id: string) {
    return apiCall<Message>(`/messages/${id}`)
  },

  async getConversation(userId1: string, userId2: string) {
    return apiCall<Message[]>(`/messages/conversation/${userId1}/${userId2}`)
  },

  async markAsRead(id: string) {
    return apiCall<Message>(`/messages/${id}/read`, {
      method: 'POST',
    })
  },
}