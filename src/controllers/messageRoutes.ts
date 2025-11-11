/**
 * Message history routes
 * Defines API endpoints for message operations
 * Requirements: 3.1, 3.2, 2.3, 4.4, 4.5
 */

import { Router } from 'express';
import { messageController } from './MessageController';
import {
  authenticate,
  validate,
  validateMultiple,
  createMessageSchema,
  sessionIdMessageParamSchema,
  paginationSchema,
} from '../middleware';

const router = Router();

/**
 * GET /api/history/{session_id}
 * Retrieve message history for a session with pagination
 * Requires authentication, param validation, and query validation
 * Requirements: 3.1, 3.2, 4.4 - Message history with validation
 */
router.get(
  '/history/:session_id',
  authenticate,
  validateMultiple([
    { schema: sessionIdMessageParamSchema, target: 'params' },
    { schema: paginationSchema, target: 'query' },
  ]),
  messageController.getMessageHistory
);

/**
 * POST /api/message
 * Create a new message in a session
 * Requires authentication and input validation
 * Requirements: 2.3, 4.4, 4.5 - Message creation with validation
 */
router.post(
  '/message',
  authenticate,
  validate(createMessageSchema, 'body'),
  messageController.createMessage
);

export default router;
