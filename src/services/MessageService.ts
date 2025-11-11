/**
 * MessageService - Business logic layer for Message management
 * Handles message creation, retrieval, and deletion
 * Requirements: 2.3, 3.1, 3.2, 3.4, 3.5
 */

import { Message } from '@prisma/client';
import { CreateMessageDTO, PaginationDTO, PaginatedResult } from '../models/types';
import { IMessageRepository, messageRepository } from '../repositories/MessageRepository';
import { ISessionRepository, sessionRepository } from '../repositories/SessionRepository';
import { ValidationError, NotFoundError } from '../utils/errors';

export interface IMessageService {
  createMessage(data: CreateMessageDTO): Promise<Message>;
  getSessionMessages(sessionId: number, pagination: PaginationDTO): Promise<PaginatedResult<Message>>;
  deleteSessionMessages(sessionId: number): Promise<void>;
}

export class MessageService implements IMessageService {
  constructor(
    private messageRepository: IMessageRepository,
    private sessionRepository: ISessionRepository
  ) {}

  /**
   * Create a new message with timestamp generation
   * Requirement 2.3: Message model with id, session_id, role, text, timestamp
   * Requirement 3.1: Support message creation
   */
  async createMessage(data: CreateMessageDTO): Promise<Message> {
    // Validate inputs
    if (!data.sessionId || data.sessionId <= 0) {
      throw new ValidationError('Invalid session ID');
    }

    if (!data.role || data.role.trim() === '') {
      throw new ValidationError('Role is required');
    }

    // Validate role is one of the allowed values
    const validRoles = ['user', 'assistant', 'system'];
    if (!validRoles.includes(data.role)) {
      throw new ValidationError('Role must be one of: user, assistant, system');
    }

    if (!data.text || data.text.trim() === '') {
      throw new ValidationError('Message text is required');
    }

    if (data.text.length > 10000) {
      throw new ValidationError('Message text must be less than 10000 characters');
    }

    // Verify session exists
    const session = await this.sessionRepository.findById(data.sessionId);
    if (!session) {
      throw new NotFoundError('Session');
    }

    // Create message with timestamp (handled by repository)
    return await this.messageRepository.create({
      sessionId: data.sessionId,
      role: data.role,
      text: data.text.trim(),
    });
  }

  /**
   * Get all messages for a session with pagination
   * Requirement 3.2: Retrieve message history
   * Requirement 3.4: Pagination support with limit and offset
   * Requirement 3.5: Return messages in chronological order
   */
  async getSessionMessages(
    sessionId: number,
    pagination: PaginationDTO
  ): Promise<PaginatedResult<Message>> {
    // Validate inputs
    if (!sessionId || sessionId <= 0) {
      throw new ValidationError('Invalid session ID');
    }

    const limit = pagination.limit || 50;
    const offset = pagination.offset || 0;

    if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative');
    }

    // Verify session exists
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session');
    }

    // Get messages and total count
    const [messages, total] = await Promise.all([
      this.messageRepository.findBySessionId(sessionId, { limit, offset, orderBy: 'asc' }),
      this.messageRepository.count(sessionId),
    ]);

    return {
      data: messages,
      total,
      limit,
      offset,
    };
  }

  /**
   * Delete all messages for a session (cascade delete)
   * Requirement 2.5: Support cascade delete operations
   * 
   * Note: This is typically handled automatically by Prisma cascade delete
   * when a session is deleted, but provided for explicit service layer use
   */
  async deleteSessionMessages(sessionId: number): Promise<void> {
    if (!sessionId || sessionId <= 0) {
      throw new ValidationError('Invalid session ID');
    }

    await this.messageRepository.deleteBySessionId(sessionId);
  }
}

// Export singleton instance
export const messageService = new MessageService(messageRepository, sessionRepository);
