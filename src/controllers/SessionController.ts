/**
 * SessionController - HTTP request handlers for session management endpoints
 * Handles session creation, listing, and deletion API endpoints
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.4
 */

import { Request, Response, NextFunction } from 'express';
import { sessionService, ISessionService } from '../services/SessionService';
import { ValidationError } from '../utils/errors';

export class SessionController {
  constructor(private sessionService: ISessionService) {}

  /**
   * POST /api/session
   * Create a new session for the authenticated user
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
   * Note: Validation is handled by middleware
   */
  createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ValidationError('Authentication required');
      }

      const { assistant_role } = req.body;

      // Create session
      const session = await this.sessionService.createSession(
        req.user.userId,
        assistant_role
      );

      // Return created session with id and timestamp
      res.status(201).json({
        id: session.id,
        user_id: session.userId,
        assistant_role: session.assistantRole,
        timestamp: session.timestamp,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/sessions
   * List all sessions for the authenticated user with pagination
   * Requirements: 8.1, 8.4
   * Note: Validation is handled by middleware
   */
  getUserSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ValidationError('Authentication required');
      }

      const { limit, offset } = req.query;

      // Get user sessions with pagination
      const result = await this.sessionService.getUserSessions(
        req.user.userId,
        { limit: Number(limit), offset: Number(offset) }
      );

      // Return sessions array with total count
      res.status(200).json({
        sessions: result.data.map(session => ({
          id: session.id,
          user_id: session.userId,
          assistant_role: session.assistantRole,
          timestamp: session.timestamp,
          created_at: session.createdAt,
        })),
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/session/{id}
   * Delete a session and all associated messages
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
   * Note: Validation is handled by middleware
   */
  deleteSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ValidationError('Authentication required');
      }

      // Extract session ID (already validated by middleware)
      const sessionId = Number(req.params.id);

      // Delete session (ownership verification is done in service layer)
      await this.sessionService.deleteSession(sessionId, req.user.userId);

      // Return 204 status on success
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const sessionController = new SessionController(sessionService);
