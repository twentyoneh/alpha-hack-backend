/**
 * Type definitions for database models
 * These types are derived from Prisma schema and used throughout the application
 */

import { User, Session, Message } from '@prisma/client';

// Re-export Prisma types
export type { User, Session, Message };

// DTOs (Data Transfer Objects) for API requests/responses

export interface CreateUserDTO {
  name: string;
  email?: string;
}

export interface CreateSessionDTO {
  userId: number;
  assistantRole: string;
}

export interface CreateMessageDTO {
  sessionId: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
}

// Pagination types
export interface PaginationDTO {
  limit: number;  // default: 50
  offset: number; // default: 0
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// Query options for repositories
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'asc' | 'desc';
}

// User response (without sensitive data)
export interface UserResponse {
  id: number;
  name: string;
  email: string | null;
  createdAt: Date;
}

// Session response
export interface SessionResponse {
  id: number;
  userId: number;
  assistantRole: string;
  timestamp: Date;
  createdAt: Date;
}

// Message response
export interface MessageResponse {
  id: number;
  sessionId: number;
  role: string;
  text: string;
  timestamp: Date;
}
