/**
 * MessageRepository - Data access layer for Message model
 * Implements CRUD operations for Message entity with pagination support
 * Requirements: 2.3, 2.4, 3.4, 3.5
 */

import { prisma } from '../utils/database';
import { Message } from '@prisma/client';
import { CreateMessageDTO, QueryOptions } from '../models/types';

export interface IMessageRepository {
  create(data: CreateMessageDTO): Promise<Message>;
  findBySessionId(sessionId: number, options?: QueryOptions): Promise<Message[]>;
  deleteBySessionId(sessionId: number): Promise<void>;
  count(sessionId: number): Promise<number>;
}

export class MessageRepository implements IMessageRepository {
  /**
   * Create a new message
   * Requirement 2.3: Message model with id, session_id, role, text, timestamp
   */
  async create(data: CreateMessageDTO): Promise<Message> {
    return await prisma.message.create({
      data: {
        sessionId: data.sessionId,
        role: data.role,
        text: data.text,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Find all messages for a specific session with pagination
   * Requirement 3.4: Pagination support with limit and offset parameters
   * Requirement 3.5: Return messages in chronological order
   */
  async findBySessionId(sessionId: number, options: QueryOptions = {}): Promise<Message[]> {
    const { limit = 50, offset = 0, orderBy = 'asc' } = options;

    return await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: orderBy },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Delete all messages for a specific session
   * Used for cascade delete operations
   * Requirement 2.4: Enforce referential integrity
   * 
   * Note: This is typically handled automatically by Prisma cascade delete,
   * but provided as explicit method for service layer use if needed
   */
  async deleteBySessionId(sessionId: number): Promise<void> {
    await prisma.message.deleteMany({
      where: { sessionId },
    });
  }

  /**
   * Count total messages for a session
   * Used for pagination metadata
   */
  async count(sessionId: number): Promise<number> {
    return await prisma.message.count({
      where: { sessionId },
    });
  }
}

// Export singleton instance
export const messageRepository = new MessageRepository();
