/**
 * SessionRepository - Data access layer for Session model
 * Implements CRUD operations for Session entity with cascade delete support
 * Requirements: 2.2, 2.4, 2.5, 8.1
 */

import { prisma } from '../utils/database';
import { Session } from '@prisma/client';
import { CreateSessionDTO, QueryOptions } from '../models/types';

export interface ISessionRepository {
  create(data: CreateSessionDTO): Promise<Session>;
  findById(id: number): Promise<Session | null>;
  findByUserId(userId: number, options?: QueryOptions): Promise<Session[]>;
  delete(id: number): Promise<void>;
  count(userId: number): Promise<number>;
}

export class SessionRepository implements ISessionRepository {
  /**
   * Create a new session
   * Requirement 2.2: Session model with id, user_id, assistant_role, timestamp
   */
  async create(data: CreateSessionDTO): Promise<Session> {
    return await prisma.session.create({
      data: {
        userId: data.userId,
        assistantRole: data.assistantRole,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Find session by ID
   * Requirement 8.1: Isolate user data by user_id in all queries
   */
  async findById(id: number): Promise<Session | null> {
    return await prisma.session.findUnique({
      where: { id },
    });
  }

  /**
   * Find all sessions for a specific user with pagination
   * Requirement 8.1: Isolate user data by user_id in all queries
   */
  async findByUserId(userId: number, options: QueryOptions = {}): Promise<Session[]> {
    const { limit = 50, offset = 0, orderBy = 'desc' } = options;

    return await prisma.session.findMany({
      where: { userId },
      orderBy: { timestamp: orderBy },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Delete a session by ID
   * Requirement 2.5: Cascade delete all associated messages
   * Requirement 2.4: Enforce referential integrity
   * 
   * Note: Cascade delete is handled by Prisma schema (onDelete: Cascade)
   * All associated messages will be automatically deleted
   */
  async delete(id: number): Promise<void> {
    await prisma.session.delete({
      where: { id },
    });
  }

  /**
   * Count total sessions for a user
   * Used for pagination metadata
   */
  async count(userId: number): Promise<number> {
    return await prisma.session.count({
      where: { userId },
    });
  }
}

// Export singleton instance
export const sessionRepository = new SessionRepository();
