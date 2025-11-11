/**
 * SessionService - Business logic layer for Session management
 * Handles session creation, retrieval, deletion, and ownership verification
 * Requirements: 2.2, 2.5, 4.1, 4.2, 5.2, 5.5, 8.1, 8.4
 */

import { Session } from '@prisma/client';
import { CreateSessionDTO, PaginationDTO, PaginatedResult } from '../models/types';
import { ISessionRepository, sessionRepository } from '../repositories/SessionRepository';
import { IUserRepository, userRepository } from '../repositories/UserRepository';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors';

export interface ISessionService {
  createSession(userId: number, assistantRole: string): Promise<Session>;
  getSessionById(id: number): Promise<Session | null>;
  getUserSessions(userId: number, pagination: PaginationDTO): Promise<PaginatedResult<Session>>;
  deleteSession(id: number, userId: number): Promise<void>;
  verifySessionOwnership(sessionId: number, userId: number): Promise<boolean>;
}

export class SessionService implements ISessionService {
  constructor(
    private sessionRepository: ISessionRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Create a new session with timestamp generation
   * Requirement 4.1: POST /api/session endpoint support
   * Requirement 4.2: Create session with user_id and assistant_role
   * Requirement 2.2: Session model with timestamp
   */
  async createSession(userId: number, assistantRole: string): Promise<Session> {
    // Validate inputs
    if (!userId || userId <= 0) {
      throw new ValidationError('Invalid user ID');
    }

    if (!assistantRole || assistantRole.trim() === '') {
      throw new ValidationError('Assistant role is required');
    }

    if (assistantRole.length > 255) {
      throw new ValidationError('Assistant role must be less than 255 characters');
    }

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Create session with timestamp (handled by repository)
    const sessionData: CreateSessionDTO = {
      userId,
      assistantRole: assistantRole.trim(),
    };

    return await this.sessionRepository.create(sessionData);
  }

  /**
   * Get session by ID
   */
  async getSessionById(id: number): Promise<Session | null> {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid session ID');
    }

    return await this.sessionRepository.findById(id);
  }

  /**
   * Get all sessions for a user with pagination
   * Requirement 8.1: Isolate user data by user_id
   * Requirement 8.4: Support pagination for user sessions
   */
  async getUserSessions(
    userId: number,
    pagination: PaginationDTO
  ): Promise<PaginatedResult<Session>> {
    // Validate inputs
    if (!userId || userId <= 0) {
      throw new ValidationError('Invalid user ID');
    }

    const limit = pagination.limit || 50;
    const offset = pagination.offset || 0;

    if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative');
    }

    // Get sessions and total count
    const [sessions, total] = await Promise.all([
      this.sessionRepository.findByUserId(userId, { limit, offset, orderBy: 'desc' }),
      this.sessionRepository.count(userId),
    ]);

    return {
      data: sessions,
      total,
      limit,
      offset,
    };
  }

  /**
   * Delete a session with ownership verification
   * Requirement 5.2: Delete session with ownership check
   * Requirement 5.5: Verify user ownership before deletion
   * Requirement 2.5: Cascade delete associated messages (handled by DB)
   */
  async deleteSession(id: number, userId: number): Promise<void> {
    // Validate inputs
    if (!id || id <= 0) {
      throw new ValidationError('Invalid session ID');
    }

    if (!userId || userId <= 0) {
      throw new ValidationError('Invalid user ID');
    }

    // Verify session exists and ownership
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundError('Session');
    }

    if (session.userId !== userId) {
      throw new ForbiddenError('Access denied: You do not own this session');
    }

    // Delete session (cascade delete messages handled by Prisma schema)
    await this.sessionRepository.delete(id);
  }

  /**
   * Verify session ownership
   * Requirement 5.5: Verify user ownership before allowing operations
   */
  async verifySessionOwnership(sessionId: number, userId: number): Promise<boolean> {
    if (!sessionId || sessionId <= 0 || !userId || userId <= 0) {
      return false;
    }

    const session = await this.sessionRepository.findById(sessionId);
    
    if (!session) {
      return false;
    }

    return session.userId === userId;
  }
}

// Export singleton instance
export const sessionService = new SessionService(sessionRepository, userRepository);
