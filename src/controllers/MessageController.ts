/**
 * MessageController - HTTP request handlers for message history endpoints
 * Handles message retrieval and creation API endpoints
 * Requirements: 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.5
 */

import { Request, Response, NextFunction } from 'express';
import { messageService, IMessageService } from '../services/MessageService';
import { sessionService, ISessionService } from '../services/SessionService';
import { ValidationError, ForbiddenError } from '../utils/errors';

export class MessageController {
  constructor(
    private messageService: IMessageService,
    private sessionService: ISessionService
  ) {}

  /**
   * GET /api/history/{session_id}
   * Retrieve message history for a session with pagination
   * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
   * Note: Validation is handled by middleware
   */
  getMessageHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ValidationError('Authentication required');
      }

      // Extract session ID (already validated by middleware)
      const sessionId = Number(req.params.session_id);

      // Verify session ownership
      const hasAccess = await this.sessionService.verifySessionOwnership(
        sessionId,
        req.user.userId
      );

      if (!hasAccess) {
        throw new ForbiddenError('Access denied to this session');
      }

      const { limit, offset } = req.query;

      // Get message history with pagination
      const result = await this.messageService.getSessionMessages(
        sessionId,
        { limit: Number(limit), offset: Number(offset) }
      );

      // Return messages in chronological order with JSON format
      res.status(200).json({
        messages: result.data.map(message => ({
          id: message.id,
          role: message.role,
          text: message.text,
          timestamp: message.timestamp,
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
   * POST /api/message
   * Create a new message in a session
   * Requirements: 2.3, 4.5
   * Note: Validation is handled by middleware
   */
  createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new ValidationError('Authentication required');
      }

      const { session_id, role, text } = req.body;

      // Verify session ownership before creating message
      const hasAccess = await this.sessionService.verifySessionOwnership(
        session_id,
        req.user.userId
      );

      if (!hasAccess) {
        throw new ForbiddenError('Access denied to this session');
      }

      // Create message (timestamp is set to current server time by service)
      const message = await this.messageService.createMessage({
        sessionId: session_id,
        role,
        text,
      });

      // Return created message object
      res.status(201).json({
        id: message.id,
        session_id: message.sessionId,
        role: message.role,
        text: message.text,
        timestamp: message.timestamp,
      });
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const messageController = new MessageController(messageService, sessionService);
